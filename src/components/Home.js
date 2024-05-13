import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = ({prompt, response, changePrompt, changeResponse, form1Submit, form2Submit, displayImage = null, updateImage}) => {

    const navigate = useNavigate()


    return (
        <div className="home">
            <div className="image">
                <form className="form1" onSubmit={(e) => {form1Submit(e, () => {navigate('/Recipes')})}}>
                    <input type="file" name="image" onChange={(e) => {updateImage(e)}} multiple />
                    <button type="submit">Submit</button>
                </form>
                <div className="img">
                    {displayImage?<img src={URL.createObjectURL(displayImage)} alt="image" />:<p>Upload an image to start...</p>}
                </div>
            </div>
            <div className="chat">
                <form className="form2" onSubmit={(e) => form2Submit(e, navigate('/Recipes'))}>
                    <p>Or enter your ingredients manually:</p>
                    <input type="text" name="message" value={prompt} onChange={(e) => {changePrompt(e)}}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
 
export default Home;