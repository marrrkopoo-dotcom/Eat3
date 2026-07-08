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
let orderUpdates = {}; // clientId -> Array of order updates

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

// API: Send order details from client to Telegram
app.post('/api/send-order', async (req, res) => {
    const { clientId, order, clientName } = req.body;
    if (!clientId || !order) {
        return res.status(400).json({ error: 'Missing clientId or order' });
    }

    console.log(`Order from ${clientId} (${clientName || 'Anonymous'}): ${order.id}`);

    if (BOT_TOKEN && CHAT_ID) {
        try {
            const itemsText = order.items.map(item => `• ${item.name} x${item.quantity} (${item.price} грн)`).join('\n');
            const text = `📦 *НОВЕ ЗАМОВЛЕННЯ ${order.id}*\n\n` +
                         `👤 *Отримувач:* ${order.customerName}\n` +
                         `📞 *Телефон:* \`${order.customerPhone}\`\n` +
                         `📍 *Доставка:* м. ${order.city}, ${order.postOffice}\n` +
                         `📞 *Підтвердження:* ${order.doNotCall ? '❌ Не телефонувати' : '📞 Зателефонувати'}\n\n` +
                         `🛍️ *Товари:*\n${itemsText}\n\n` +
                         `💰 *Сума:* *${order.total} грн*\n\n` +
                         `🆔 *ID Клієнта:* \`${clientId}\``;

            const keyboard = {
                inline_keyboard: [
                    [
                        { text: "👍 Підтвердити", callback_data: `confirm_order:${order.id}` },
                        { text: "❌ Скасувати", callback_data: `cancel_order:${order.id}` }
                    ],
                    [
                        { text: "✏️ Редагувати", callback_data: `edit_order:${order.id}` }
                    ]
                ]
            };

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown',
                    reply_markup: keyboard
                })
            });
            const data = await response.json();
            if (data.ok && data.result) {
                const tgMessageId = data.result.message_id;
                tgMap[tgMessageId] = clientId;
                saveMap();
                console.log(`Mapped TG message ${tgMessageId} (order) to client ${clientId}`);
                return res.json({ success: true });
            } else {
                console.error('Telegram API error:', data);
                return res.status(500).json({ error: 'Failed to send order to Telegram' });
            }
        } catch (err) {
            console.error('Failed to connect to Telegram:', err);
            return res.status(500).json({ error: 'Connection to Telegram failed' });
        }
    } else {
        console.log('Telegram bot not configured. Running in Mock/Demo mode for order.');
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

    const ordUpdates = orderUpdates[clientId] || [];
    orderUpdates[clientId] = []; // Clear queue after fetching

    res.json({ updates, orderUpdates: ordUpdates });
});

function parseOrderUpdate(text) {
    if (!text) return null;
    const lines = text.split('\n');
    let orderId = null;
    let name = null;
    let phone = null;
    let city = null;
    let postOffice = null;
    
    const isPlaceholder = (val) => val.startsWith('[') && val.endsWith(']');
    
    for (let line of lines) {
        const lower = line.toLowerCase().trim();
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;
        
        const val = line.substring(colonIdx + 1).trim();
        
        if (lower.startsWith('замовлення:')) {
            orderId = val;
        } else if (lower.startsWith('ім\'я:') || lower.startsWith('ім’я:') || lower.startsWith('имя:')) {
            if (!isPlaceholder(val) && val !== '') name = val;
        } else if (lower.startsWith('телефон:')) {
            if (!isPlaceholder(val) && val !== '') phone = val;
        } else if (lower.startsWith('місто:') || lower.startsWith('город:')) {
            if (!isPlaceholder(val) && val !== '') city = val;
        } else if (lower.startsWith('пошта:') || lower.startsWith('почта:')) {
            if (!isPlaceholder(val) && val !== '') postOffice = val;
        }
    }
    
    if (orderId && (name || phone || city || postOffice)) {
        return { orderId, name, phone, city, postOffice };
    }
    return null;
}

// API: Telegram webhook endpoint
app.post('/api/tg-webhook', async (req, res) => {
    const update = req.body;
    
    // 1. Handle Inline Buttons Callback Queries
    if (update.callback_query) {
        const { id, data, message } = update.callback_query;
        const callbackData = data || '';
        
        if (callbackData.startsWith('confirm_order:') || callbackData.startsWith('cancel_order:')) {
            const isConfirm = callbackData.startsWith('confirm_order:');
            const orderId = callbackData.split(':')[1];
            
            // Find client ID mapped to this TG message ID
            const tgMessageId = message.message_id;
            const clientId = tgMap[tgMessageId];
            
            if (clientId) {
                const newStatus = isConfirm ? 'in_transit' : 'cancelled';
                
                // Push order update to client
                if (!orderUpdates[clientId]) orderUpdates[clientId] = [];
                orderUpdates[clientId].push({
                    orderId: orderId,
                    status: newStatus
                });
                
                // Send service notification message to mini support chat
                const statusLabel = isConfirm ? 'підтверджено (прямує до вас 🚚)' : 'скасовано ❌';
                const notificationText = `🔔 Статус вашого замовлення ${orderId} змінено на: *${statusLabel}*.`;
                
                if (!messageQueues[clientId]) messageQueues[clientId] = [];
                messageQueues[clientId].push({
                    sender: 'support',
                    senderName: 'Жуйка Бот 🤖',
                    senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
                    text: notificationText,
                    timestamp: new Date().toISOString()
                });
                
                // Answer Telegram callback query
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: id,
                        text: `Замовлення ${isConfirm ? 'підтверджено' : 'скасовано'}!`
                    })
                }).catch(err => console.error(err));
                
                // Update order report message in Telegram to show status and update buttons (keeping Edit button only)
                const originalText = message.text || '';
                const statusEmoji = isConfirm ? '✅ ПІДТВЕРДЖЕНО' : '❌ СКАСОВАНО';
                const updatedText = `⚡️ *СТАТУС: ${statusEmoji}*\n\n` + originalText;
                
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: message.chat.id,
                        message_id: tgMessageId,
                        text: updatedText,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✏️ Редагувати дані", callback_data: `edit_order:${orderId}` }
                                ]
                            ]
                        }
                    })
                }).catch(err => console.error(err));
                
            } else {
                console.log(`No client mapped to message ID ${tgMessageId}`);
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        callback_query_id: id,
                        text: 'Помилка: не знайдено клієнта для цього замовлення.'
                    })
                }).catch(err => console.error(err));
            }
        } else if (callbackData.startsWith('edit_order:')) {
            const orderId = callbackData.split(':')[1];
            const tgMessageId = message.message_id;
            const clientId = tgMap[tgMessageId];
            
            // Send template to manager
            const promptResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: message.chat.id,
                    reply_to_message_id: tgMessageId,
                    text: `✏️ *Редагування замовлення ${orderId}*\n\n` +
                          `Скопіюйте шаблон нижче, змініть потрібні дані та надішліть як *відповідь (Reply)* на це повідомлення:\n\n` +
                          `\`\`\`\n` +
                          `Замовлення: ${orderId}\n` +
                          `Ім'я: [Ім'я]\n` +
                          `Телефон: [Телефон]\n` +
                          `Місто: [Місто]\n` +
                          `Пошта: [Відділення Нової Пошти]\n` +
                          `\`\`\``,
                    parse_mode: 'Markdown'
                })
            }).catch(err => console.error(err));
            
            if (clientId && promptResponse) {
                try {
                    const promptData = await promptResponse.json();
                    if (promptData.ok && promptData.result) {
                        const promptMsgId = promptData.result.message_id;
                        tgMap[promptMsgId] = clientId;
                        saveMap();
                    }
                } catch (e) {
                    console.error('Failed to parse prompt message response', e);
                }
            }
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: id })
            }).catch(err => console.error(err));
        }
        
        return res.sendStatus(200);
    }
    
    // 2. Handle Text Messages & Edited Messages (Replies & Edits)
    const msg = update.message || update.edited_message;
    if (msg && msg.reply_to_message) {
        const replyToId = msg.reply_to_message.message_id;
        const text = msg.text;
        
        const clientId = tgMap[replyToId];
        if (clientId && text) {
            const parsed = parseOrderUpdate(text);
            if (parsed) {
                console.log(`Order edit parsed for client ${clientId}:`, parsed);
                if (!orderUpdates[clientId]) orderUpdates[clientId] = [];
                orderUpdates[clientId].push({
                    orderId: parsed.orderId,
                    customerName: parsed.name,
                    customerPhone: parsed.phone,
                    city: parsed.city,
                    postOffice: parsed.postOffice
                });
                
                let changeDetails = [];
                if (parsed.name) changeDetails.push(`ім'я одержувача: ${parsed.name}`);
                if (parsed.phone) changeDetails.push(`телефон: ${parsed.phone}`);
                if (parsed.city) changeDetails.push(`місто: ${parsed.city}`);
                if (parsed.postOffice) changeDetails.push(`відділення пошти: ${parsed.postOffice}`);
                
                const notificationText = `✏️ Менеджер оновив інформацію у вашому замовленні ${parsed.orderId}:\n${changeDetails.map(d => `• ${d}`).join('\n')}`;
                
                if (!messageQueues[clientId]) messageQueues[clientId] = [];
                messageQueues[clientId].push({
                    sender: 'support',
                    senderName: 'Жуйка Бот 🤖',
                    senderAvatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=150&h=150&fit=crop',
                    text: notificationText,
                    timestamp: new Date().toISOString()
                });
                
                // Reply to confirm edit in Telegram
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: msg.chat.id,
                        reply_to_message_id: msg.message_id,
                        text: `✅ Дані замовлення ${parsed.orderId} успішно оновлено на сайті!`
                    })
                }).catch(err => console.error(err));
            } else {
                // Otherwise, standard support chat message
                console.log(`Support reply to client ${clientId}: ${text}`);
                if (!messageQueues[clientId]) messageQueues[clientId] = [];
                
                let managerName = 'Підтримка';
                let managerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
                
                const tgSender = msg.from.first_name || '';
                const lowerSender = tgSender.toLowerCase();
                
                if (lowerSender.includes('нат') || lowerSender.includes('nat')) {
                    managerName = 'Наташа';
                    managerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
                } else if (lowerSender.includes('дм') || lowerSender.includes('dm') || lowerSender.includes('дн') || lowerSender.includes('dmi')) {
                    managerName = 'Дмитро';
                    managerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
                } else {
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

                const newTgMessageId = msg.message_id;
                tgMap[newTgMessageId] = clientId;
                saveMap();
            }
        }
    }
    
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
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        let response = await fetch(decryptedUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://choco-yummy.com.ua/'
            }
        });
        clearTimeout(timeoutId);
        
        // Smart fallback logic if the high-quality image returns 404
        if (!response.ok && response.status === 404) {
            let fallbackUrl = decryptedUrl;
            if (decryptedUrl.includes('-197x495')) {
                fallbackUrl = decryptedUrl.replace('-197x495', '-200x200');
            } else if (decryptedUrl.includes('-495x495')) {
                fallbackUrl = decryptedUrl.replace('-495x495', '-200x200');
            }
            
            if (fallbackUrl !== decryptedUrl) {
                const fallbackResponse = await fetch(fallbackUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                        'Referer': 'https://choco-yummy.com.ua/'
                    }
                });
                if (fallbackResponse.ok) {
                    response = fallbackResponse;
                }
            }
        }
        
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
