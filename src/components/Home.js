import React from 'react';

const Home = ({ 
  prompt, 
  changePrompt, 
  response, 
  changeResponse, 
  form1Submit, 
  form2Submit, 
  displayImage, 
  updateImage 
}) => {
  return (
    <div className="home">
      <div className="image">
        <form className="form1" onSubmit={form1Submit}>
          <input type="file" name="image" accept="image/*" onChange={updateImage} />
          <button type="submit">Submit</button>
        </form>
        <p>Or capture directly from your camera:</p>
        <form className="form1" onSubmit={form1Submit}>
          <input type="file" accept="image/*" name="image" capture="camera" onChange={updateImage} />
          <button type="submit">Submit</button>
        </form>
        <div className="img">
          {displayImage ? <img src={URL.createObjectURL(displayImage)} alt="uploaded" /> : <p>Upload an image to start...</p>}
        </div>
      </div>
      <div className="chat">
        <form className="form2" onSubmit={form2Submit}>
          <p>Or enter your ingredients manually:</p>
          <input type="text" name="message" value={prompt} onChange={changePrompt} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Home;