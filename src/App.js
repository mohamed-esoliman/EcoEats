import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import Footer from "./components/Footer";
import Inventory from "./components/Inventory";

function App() {
  const [image, setImage] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handlePromptChange = (e) => setPrompt(e.target.value);
  const handleResponseChange = (response) => setResponse(response);

  const handleImageSubmit = async (e, navigate) => {
    e.preventDefault();
    if (!image) {
      setError('No file uploaded.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      const validJson = responseText.replace(/'/g, '"').replace(/}\s*{/g, '},{');
      const newRecipes = JSON.parse(`[${validJson}]`); 
      
      setRecipes(newRecipes);
      if (navigate) navigate('/recipes');
    } catch (error) {
      console.error('Error:', error);
      setError('Error processing the image. Please try again.');
    }
  };

  const handleChatSubmit = async (e, navigate) => {
    e.preventDefault();
    if (!prompt) {
      setError('No message entered.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `Given these ingredients: ${prompt}, provide some recipes I can make.
            Please provide recipes in the following JSON format:
            {'title': 'Recipe Title','description': 'Detailed description of the recipe.', 'nutrition': 'Calories: xyz, Carbs: xyz g, Protein: xyz g, Fat: xyz g'}
            Don't add any additional text or to allow easy parsing. Never send cut off JSON string. If you are going to run out of tokens, close the needed brackets to avoid problems.`
        }),
      });
      
      const data = await response.json();
      console.log(data);
      const responseText = data.choices[0].message.content;
      
      const validJson = responseText.replace(/'/g, '"').replace(/}\s*{/g, '},{');
      const newRecipes = JSON.parse(`[${validJson}]`); 

      setRecipes(newRecipes);
      if (navigate) navigate('/recipes');
    } catch (error) {
      console.error('Error:', error);
      setError('Error processing your request. Please try again.');
    }
  };

  function AppContent() {
    const navigate = useNavigate();
    
    return (
      <div className="content">
        {error && <div className="error-message">{error}</div>}
        <Routes>
          <Route path="/" element={
            <Home 
              prompt={prompt} 
              changePrompt={handlePromptChange} 
              response={response} 
              changeResponse={handleResponseChange} 
              form1Submit={(e) => handleImageSubmit(e, navigate)} 
              form2Submit={(e) => handleChatSubmit(e, navigate)} 
              displayImage={image} 
              updateImage={handleImageChange}
            />
          } />
          <Route path="/recipes" element={<Recipes foodRecipes={recipes} updateRecipes={setRecipes} />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <AppContent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;