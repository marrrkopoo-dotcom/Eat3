import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load bot credentials from environment
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8986924734:AAE5TIbbb7BFEgWfyaHFov2aoKDA52UIBo8';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
            
            messageQueues[clientId].push({
                sender: 'support',
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

// Serve static build files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
