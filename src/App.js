import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import Footer from "./components/Footer";
import Inventory  from "./components/Inventory";

function App() {

  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const [recipes, setRecipes] = useState([])

  const handleRecipesChange = (recipes) => {
    setRecipes([recipes])
  }

  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleResponseChange = (response) => {
    setResponse(response)
  }

  // Back end

  const handleImageSubmit = async (e, navigation = false) => {
    e.preventDefault();
    if (!image) {
      alert('No file uploaded.');
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
      const responseText = data.choices[0].message.content
      
      const validJson = responseText.replace(/'/g, '"').replace(/}\s*{/g, '},{');
      const newRecipes = JSON.parse(`[${validJson}]`); 
      
      setRecipes(newRecipes);
    } 
    catch (error) {
      console.error('Error:', error);
    }

    if (navigation) {
      navigation();
    }
  };

  const handleChatSubmit = async (e, navigation=false) => {
    e.preventDefault();
    if (!prompt) {
      alert('No message entered.');
      return;
    }

    try{
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `Given these ingredients: ${prompt}, provide some recipes I can make.\nPlease provide recipes in the following JSON format:\n{'title': 'Recipe Title','description': 'Detailed description of the recipe.', 'nutrition': 'Calories: xyz, Carbs: xyz g, Protein: xyz g, Fat: xyz g'}\n Don't add any additional text or to allow easy parsing. Never send cut off JSON string. If you are going to run out of tokens, close the needed brackets to avoid problems.`}),
      });
      
      const data = await response.json();
      const responseText = data.choices[0].message.content
      
      const validJson = responseText.replace(/'/g, '"').replace(/}\s*{/g, '},{');
      const newRecipes = JSON.parse(`[${validJson}]`); 


      setRecipes(newRecipes);
    }
    catch (error) {
      console.error('Error:', error);
    }

    // axios
    //   .post('http://localhost:8080/chat', { message: prompt })
    //   .then((response) => {
    //     handleResponseChange(response.data);
    //     console.log('Response:', response);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //     console.error('Error details:', error.response?.status, error.response?.data);
    //   });

      if (navigation) {
        navigation();
      }

  }


  return (
    <Router>
      <div className="App">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home prompt={prompt} changePrompt={handlePromptChange} response={response} changeResponse={handleResponseChange} form1Submit = {handleImageSubmit} form2Submit={handleChatSubmit} displayImage = {image} updateImage = {handleImageChange}/>} />
          <Route path="/recipes" element={<Recipes foodRecipes={recipes} updateRecipes={handleRecipesChange}/>} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
