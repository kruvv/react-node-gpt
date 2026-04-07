// import { Configuration, OpenAIApi } from 'openai';
import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

// const config = new Configuration({
//     // organization: process.env.ORGANIZATION_NAME,
//     apiKey: process.env.OPEN_AI_API_KEY
// });

// console.log('apiKey: ', process.env.OPENAI_API_KEY)
// console.log('PORT: ', process.env.PORT)

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/', async(req, res) => {
    // const {chats} = req.body;

    const response = await openai.responses.create({
        model: process.env.MODEL_CHAT,
        input: 'write a haiku about ai on russian',
        store: true
        // messages: [{
        //     role: 'system',
        //     content: 'You are a EbereGPT. You can help with program tasks'
        // }, ...chats]
    });

    console.log('response: ', response)

    if (response.error) throw new Error(response.error)

    res.json({
        // role: response.
        output: response.output_text
    })


    // console.log(response.output_text)
})

