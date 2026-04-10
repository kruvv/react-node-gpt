import { Ollama } from 'ollama';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const MODEL = process.env.OLLAMA_MODEL_CLOUD_120;
app.use(bodyParser.json());
app.use(cors());

const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
});

// console.log('port:', PORT)
// console.log('model:', MODEL)
// console.log('ollama: ', ollama)


app.post('/', async (req, res) => {
    try {
        const { chats } = req.body ?? {};

        if (!Array.isArray(chats)) {
            return res.status(400).json({ error: 'Body must include array "chats"' });
        }

        const messages = chats
            .filter(m => m && typeof m.content === 'string' && m.content.trim().length > 0)
            .map(m => ({
                role: ['user', 'assistant', 'system'].includes(m.role) ? m.role : 'user',
                content: m.content,
            }));

        if (messages.length === 0) {
            return res.status(400).json({ error: 'No valid messages provided' });
        }

        // console.log('ollama+: ', ollama)
        // console.log('messages: ', messages)

        const completion = await ollama.chat({
            model: MODEL,
            messages,
            // stream: false,
            // temperature: 0.7,
        });
        // for await (const part of completion) {
        //     console.log(part)
        //     // process.stdout.write(part.message.content)
        //
        // }
        // console.log('completion: ', completion)

        const reply = completion?.message?.content?.trim();

        if (!reply) {
            return res.status(502).json({ error: 'Model returned empty response' });
        }

        // Frontend expects an object with role/content in data.output
        res.json({
            output: {
                role: completion?.message?.role?.trim(),
                content: reply,
                thinking: completion?.message?.thinking?.trim()
            },
        });
    } catch (error) {
        console.error('Ollama chat error:', error);
        const status = error?.status ?? 500;
        res.status(status).json({ error: 'Failed to generate response' });
    }
});


app.listen(PORT, () =>  console.log(`listening on port ${PORT}`));