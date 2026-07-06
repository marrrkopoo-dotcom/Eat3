import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENCRYPTION_KEY = process.env.IMAGE_PROXY_KEY || 'juyka-secret-key-32chars-for-aes!';
const KEY = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
const ALGORITHM = 'aes-256-cbc';

function decrypt(text) {
    if (!text || !text.startsWith('enc-')) return text;
    try {
        const parts = text.split('-');
        if (parts.length < 3) return text;
        const iv = Buffer.from(parts[1], 'hex');
        const encryptedText = Buffer.from(parts[2], 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error('Failed to decrypt URL:', e);
        return text;
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load bot credentials from environment
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8986924734:AAE5TIbbb7BFEgWfyaHFov2aoKDA52UIBo8';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003921545216';

// In-memory queues and mapping
let tgMap = {}; // tgMessageId -> clientId
let messageQueues = {}; // clientId -> Array of messages

const MAP_FILE = path.join(__dirname, 'tg_map.json');

// Load map from file if exists
if (fs.existsSync(MAP_FILE)) {
    try {
        tgMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
        console.log('Loaded Telegram message mapping from file');
    } catch (e) {
        console.error('Failed to parse tg_map.json', e);
    }
}

// Helper to save map
const saveMap = () => {
    try {
        fs.writeFileSync(MAP_FILE, JSON.stringify(tgMap, null, 2), 'utf8');
    } catch (e) {
        console.error('Failed to save tg_map.json', e);
    }
};

// API: Send message from client to Telegram
app.post('/api/send-message', async (req, res) => {
    const { clientId, message, clientName } = req.body;
    if (!clientId || !message) {
        return res.status(400).json({ error: 'Missing clientId or message' });
    }

    console.log(`Message from ${clientId} (${clientName || 'Anonymous'}): ${message}`);

    if (BOT_TOKEN && CHAT_ID) {
        try {
            const text = `🔔 *Нове повідомлення від клієнта*\n👤 Ім'я: ${clientName || 'Гість'}\n🆔 ID: \`${clientId}\`\n\n💬 ${message}`;
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });
            const data = await response.json();
            if (data.ok && data.result) {
                const tgMessageId = data.result.message_id;
                tgMap[tgMessageId] = clientId;
                saveMap();
                console.log(`Mapped TG message ${tgMessageId} to client ${clientId}`);
                return res.json({ success: true });
            } else {
                console.error('Telegram API error:', data);
                return res.status(500).json({ error: 'Failed to send to Telegram' });
            }
        } catch (err) {
            console.error('Failed to connect to Telegram:', err);
            return res.status(500).json({ error: 'Connection to Telegram failed' });
        }
    } else {
        // Fallback Mock mode (if no credentials are set)
        console.log('Telegram bot not configured. Running in Mock/Demo mode.');
        
        // Push a simulated response after 3 seconds
        setTimeout(() => {
            if (!messageQueues[clientId]) messageQueues[clientId] = [];
            messageQueues[clientId].push({
                sender: 'support',
                senderName: 'Дмитро',
                senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                text: `[Демо-Режим] Привіт! Дякуємо за звернення до підтримки магазину "Жуйка". Це автоматична відповідь, оскільки Telegram Bot не налаштований у змінних середовища (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID).`,
                timestamp: new Date().toISOString()
            });
        }, 3000);

        return res.json({ success: true, warning: 'Running in demo mode' });
    }
});

// API: Polling updates for client
app.get('/api/chat-updates', (req, res) => {
    const { clientId } = req.query;
    if (!clientId) {
        return res.status(400).json({ error: 'Missing clientId' });
    }

    const updates = messageQueues[clientId] || [];
    messageQueues[clientId] = []; // Clear queue after fetching
    res.json({ updates });
});

// API: Telegram webhook endpoint
app.post('/api/tg-webhook', (req, res) => {
    const update = req.body;
    
    // Check for message reply
    if (update.message && update.message.reply_to_message) {
        const replyToId = update.message.reply_to_message.message_id;
        const text = update.message.text;
        
        const clientId = tgMap[replyToId];
        if (clientId && text) {
            console.log(`Support reply to client ${clientId}: ${text}`);
            if (!messageQueues[clientId]) messageQueues[clientId] = [];
            
            // Determine manager attribution
            let managerName = 'Підтримка';
            let managerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
            
            const tgSender = update.message.from.first_name || '';
            const lowerSender = tgSender.toLowerCase();
            
            if (lowerSender.includes('нат') || lowerSender.includes('nat')) {
                managerName = 'Наташа';
                managerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
            } else if (lowerSender.includes('дм') || lowerSender.includes('dm') || lowerSender.includes('дн') || lowerSender.includes('dmi')) {
                managerName = 'Дмитро';
                managerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
            } else {
                // Alternating based on clientId characters hash
                const clientHash = clientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                if (clientHash % 2 === 0) {
                    managerName = 'Наташа';
                    managerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
                } else {
                    managerName = 'Дмитро';
                    managerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
                }
            }

            messageQueues[clientId].push({
                sender: 'support',
                senderName: managerName,
                senderAvatar: managerAvatar,
                text: text,
                timestamp: new Date().toISOString()
            });

            // Also map this new reply message ID to the same client ID, 
            // so they can continue replying to the reply!
            const newTgMessageId = update.message.message_id;
            tgMap[newTgMessageId] = clientId;
            saveMap();
        } else {
            console.log(`No active client found for reply message ID ${replyToId}`);
        }
    }
    
    // Always respond 200 OK to Telegram
    res.sendStatus(200);
});

const CACHE_DIR = path.join(__dirname, 'image_cache');
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Image Proxy Endpoint to mask original image URLs with server-side caching
app.get('/images/cache/:token', async (req, res) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).send('Missing token');
    }
    
    // Clean token for safety
    const safeToken = token.replace(/[^a-zA-Z0-9-]/g, '');
    const cachePath = path.join(CACHE_DIR, safeToken);
    
    // Check local cache
    if (fs.existsSync(cachePath)) {
        const metadataPath = cachePath + '.meta';
        let contentType = 'image/webp';
        if (fs.existsSync(metadataPath)) {
            contentType = fs.readFileSync(metadataPath, 'utf8');
        }
        res.setHeader('content-type', contentType);
        res.setHeader('cache-control', 'public, max-age=31536000');
        return fs.createReadStream(cachePath).pipe(res);
    }
    
    try {
        const decryptedUrl = decrypt(token);
        if (!decryptedUrl.startsWith('http')) {
            return res.status(400).send('Invalid image URL');
        }
        
        const response = await fetch(decryptedUrl);
        if (!response.ok) {
            return res.status(response.status).send('Failed to fetch image');
        }
        
        const contentType = response.headers.get('content-type') || 'image/webp';
        const buffer = await response.arrayBuffer();
        const nodeBuffer = Buffer.from(buffer);
        
        // Save to cache asynchronously
        fs.writeFile(cachePath, nodeBuffer, () => {});
        fs.writeFile(cachePath + '.meta', contentType, 'utf8', () => {});
        
        res.setHeader('content-type', contentType);
        res.setHeader('cache-control', 'public, max-age=31536000');
        res.send(nodeBuffer);
    } catch (err) {
        console.error('Image proxy server error:', err);
        res.status(500).send('Image proxy error');
    }
});

// Serve static build files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
