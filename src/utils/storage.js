// Recipe storage
export const saveRecipe = (recipe) => {
  const recipes = getRecipes();
  recipes.push({ ...recipe, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem('recipes', JSON.stringify(recipes));
};

export const getRecipes = () => {
  const recipes = localStorage.getItem('recipes');
  return recipes ? JSON.parse(recipes) : [];
};

export const deleteRecipe = (recipeId) => {
  const recipes = getRecipes();
  const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
  localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
};

// Inventory storage
export const saveInventory = (items) => {
  localStorage.setItem('inventory', JSON.stringify(items));
};

export const getInventory = () => {
  const inventory = localStorage.getItem('inventory');
  return inventory ? JSON.parse(inventory) : [];
};

// Settings storage
export const getApiKey = () => {
  return localStorage.getItem('openai_api_key') || '';
};

export const isDarkMode = () => {
  return localStorage.getItem('dark_mode') === 'true';
}; 