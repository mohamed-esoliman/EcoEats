import { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../utils/storage';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    const savedRecipes = getRecipes();
    setRecipes(savedRecipes);
  }, []);

  const handleDelete = (recipeId) => {
    deleteRecipe(recipeId);
    setRecipes(getRecipes());
  };

  const toggleExpand = (recipeId) => {
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white text-center mb-8">
          My Recipes
        </h2>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-700 dark:text-secondary-300">
              No recipes saved yet. Generate some recipes to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`bg-white dark:bg-secondary-800 shadow rounded-lg overflow-hidden transition-all duration-300 ${
                  expandedRecipeId === recipe.id ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpand(recipe.id)}
                        className="text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {expandedRecipeId === recipe.id ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="text-secondary-400 hover:text-red-500 dark:text-secondary-500 dark:hover:text-red-400"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {expandedRecipeId === recipe.id ? (
                    <>
                      <p className="mt-2 text-secondary-700 dark:text-secondary-300">
                        {recipe.description}
                      </p>
                      <div className="mt-4 space-y-4">
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
                    </>
                  ) : (
                    <div className="mt-2">
                      <p className="text-secondary-700 dark:text-secondary-300 line-clamp-2">
                        {recipe.description}
                      </p>
                      <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-secondary-500 dark:text-secondary-400">
                    Created on {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipesPage; 