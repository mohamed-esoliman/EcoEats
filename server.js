require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (
    err.name === 'OpenAIError' ||
    (err.status === 401) ||
    (err.message && err.message.toLowerCase().includes('api key'))
  ) {
    return res.status(401).json({
      status: 'error',
      error: 'Invalid API key. Please check your API key in settings.'
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    error: 'An unexpected error occurred. Please try again.'
  });
};

app.post('/api/generate-recipe', upload.single('image'), async (req, res, next) => {
  let imagePath = null;
  
  try {
    const apiKey = req.body.apiKey;
    if (!apiKey) {
      throw { 
        status: 401, 
        message: 'API key is required. Please set your OpenAI API key in settings.' 
      };
    }

    const openai = new OpenAI({ apiKey });

    try {
      await openai.models.list();
    } catch (error) {
      if (error.name === 'OpenAIError') {
        throw { 
          status: 401, 
          message: 'Invalid API key. Please check your API key in settings.' 
        };
      }
      throw error;
    }

    let prompt = '';
    let messages = [];

    if (req.file) {
      imagePath = req.file.path;
      const mimeType = req.file.mimetype; // dynamically get MIME type
      const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
      
      prompt = `Given the ingredients in this picture, create a detailed recipe. Include:
1. A creative title
2. A brief description
3. A list of ingredients with quantities
4. Step-by-step instructions
5. Basic nutrition information (calories, protein, carbs, fat)

Format the response as a valid JSON object with the following structure:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "nutrition": "Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg"
}`;

      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ];
    } else if (req.body.ingredients) {
      prompt = `Given these ingredients: ${req.body.ingredients}, create a detailed recipe. Include:
1. A creative title
2. A brief description
3. A list of ingredients with quantities
4. Step-by-step instructions
5. Basic nutrition information (calories, protein, carbs, fat)

Format the response as a valid JSON object with the following structure:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "nutrition": "Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg"
}`;

      messages = [
        {
          role: "system",
          content: "You are a professional chef and nutritionist who creates detailed, accurate, and delicious recipes."
        },
        {
          role: "user",
          content: prompt
        }
      ];
    } else {
      throw { status: 400, message: 'Either an image or ingredients list is required' };
    }

    const response = await openai.chat.completions.create({
      model: req.file ? "gpt-4o" : "gpt-4",
      messages: messages,
      max_tokens: 2048,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const recipeData = JSON.parse(response.choices[0].message.content);

    res.json({
      status: 'success',
      data: recipeData
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      error = {
        status: 500,
        message: 'Failed to parse recipe data. Please try again.'
      };
    }
    next(error);
  } finally {
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});