import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Recipes from "./components/Recipes"; 
import axios from "axios";

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
      console.log(data);
      setRecipes([data.choices[0].message.content]);
      console.log("recipes:", recipes); 
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
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      console.log(data);
      handleResponseChange(data.choices[0].message.content[0].content.text);
      setRecipes([data.choices[0].message.content]);
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
      <Routes>
        <Route path="/" element={<Home prompt={prompt} changePrompt={handlePromptChange} response={response} changeResponse={handleResponseChange} form1Submit = {handleImageSubmit} form2Submit={handleChatSubmit} displayImage = {image} updateImage = {handleImageChange}/>} />
        <Route path="/recipes" element={<Recipes foodRecipes={recipes} updateRecipes={handleRecipesChange}/>} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
