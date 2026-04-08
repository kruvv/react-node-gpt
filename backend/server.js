import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';


const app = express();
const PORT = Number(process.env.PORT) || 8000;
const MODEL = process.env.MODEL_CHAT
app.use(bodyParser.json());
app.use(cors());


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Эта ручка — простой “health check” эндпоинт. Быстрая проверка, что процесс сервера жив и принимает HTTP-запросы.
app.get('/healthz', (_req, res) => { res.sendStatus(204); });


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

            const completion = await openai.chat.completions.create({
                model: MODEL,
                messages,
                // temperature: 0.7,
            });

            const reply = completion?.choices?.[0]?.message?.content?.trim();
            if (!reply) {
                return res.status(502).json({ error: 'Model returned empty response' });
            }

        // Frontend expects an object with role/content in data.output
            res.json({
                output: { role: 'assistant', content: reply },
            });
        } catch (error) {
            console.error('OpenAI chat error:', error);
            const status = error?.status ?? 500;
            res.status(status).json({ error: 'Failed to generate response' });
        }
    });


    app.listen(PORT, () =>  console.log(`listening on port ${PORT}`));



