require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const OpenAIApi = require('openai');
const multer = require('multer');
const fs = require('fs'); 


const OpenAIApiKey = process.env.OpenAIApiKey;


const openai = new OpenAIApi({
  apiKey: OpenAIApiKey
});
const upload = multer({ dest: 'uploads/'});


const app = express();

app.use(cors());
app.use(bodyParser.json());


app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {

    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OpenAIApiKey}`
      };
  
    const payload = {
      "model": "gpt-4-turbo",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Given the ingredients in this picture, provide some recipes I can make."
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      "max_tokens": 300
    }


    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error processing the image.');
  }
});

app.post('/chat', async (req, res) => {

  const { message } = req.body;

  const completion = await openai.chat.completions.create({messages: [
    {role: "system", content: "You are a helpful assistant."},
    {role: "user", content: message},
  ], 
    model : "gpt-3.5-turbo",
    max_tokens: 512,
    temperature: 0,});

  res.send(completion);
});


const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));