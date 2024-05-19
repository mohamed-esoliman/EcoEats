import { useState } from 'react';
import { getApiKey, saveRecipe } from '../utils/storage';

function GenerateRecipePage() {
  const [image, setImage] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('Please set your OpenAI API key in settings');
      setIsLoading(false);
      return;
    }

    if (!image && !textInput.trim()) {
      setError('Please either upload an image or enter ingredients');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      if (textInput.trim()) {
        formData.append('ingredients', textInput.trim());
      }
      formData.append('apiKey', apiKey);

      console.log('Sending request with:', {
        hasImage: !!image,
        imageName: image?.name,
        hasIngredients: !!textInput.trim(),
        hasApiKey: !!apiKey
      });

      const response = await fetch('http://localhost:8080/api/generate-recipe', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate recipe');
      }

      if (result.status === 'success') {
        setRecipe(result.data);
        saveRecipe(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate recipe');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white text-center mb-8">
          Generate Recipe
        </h2>

        <div className="bg-white dark:bg-secondary-800 shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Upload Image of Ingredients
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 dark:border-secondary-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-secondary-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-secondary-600 dark:text-secondary-400">
                    <label
                      htmlFor="file-upload"
                      className={`relative cursor-pointer bg-white dark:bg-secondary-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${textInput.trim() ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={!!textInput.trim()}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  {/* Show message if text is entered and image upload is disabled */}
                  {textInput.trim() && (
                    <p className="mt-2 text-xs text-red-600">Clear the text to upload an image.</p>
                  )}
                  {/* Show selected image filename and preview */}
                  {image && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Selected file: <span className="font-medium">{image.name}</span>
                      </p>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected preview"
                        className="mt-2 mx-auto h-24 object-contain rounded"
                        style={{ maxWidth: '100%' }}
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-red-300 text-sm rounded text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Text Input Section */}
            <div>
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
              >
                Or Enter Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                rows={4}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white rounded-md"
                placeholder="Enter your ingredients, separated by commas..."
                value={textInput}
                onChange={handleTextChange}
                disabled={!!image}
              />
              {/* Show message if image is selected and text area is disabled */}
              {image && (
                <p className="mt-2 text-xs text-red-600">Remove the image to enter ingredients as text.</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || (!image && !textInput)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate Recipe'}
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {recipe && (
              <div className="mt-8 bg-secondary-50 dark:bg-secondary-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
                  {recipe.title}
                </h3>
                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                  {recipe.description}
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                      Ingredients
                    </h4>
                    <ul className="list-disc list-inside text-secondary-700 dark:text-secondary-300">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                      Instructions
                    </h4>
                    <ol className="list-decimal list-inside text-secondary-700 dark:text-secondary-300">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                      Nutrition Facts
                    </h4>
                    <p className="text-secondary-700 dark:text-secondary-300">
                      {recipe.nutrition}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateRecipePage; 