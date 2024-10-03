require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const OpenAI = require('openai');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OpenAIApiKey
});

// Image upload and processing endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Given the ingredients in this picture, provide some recipes I can make. Please provide recipes in the following JSON format: {'title': 'Recipe Title','description': 'Detailed description of the recipe.', 'nutrition': 'Calories: xyz, Carbs: xyz g, Protein: xyz g, Fat: xyz g'} Don't add any additional text or to allow easy parsing. Never send cut off JSON string. If you are going to run out of tokens, close the needed brackets to avoid problems."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1024,
    };

    const response = await openai.chat.completions.create(payload);
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing the image.' });
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 512,
      temperature: 0,
    });
    res.json(completion);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing the chat request.' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));