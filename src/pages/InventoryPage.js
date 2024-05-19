import { useState, useEffect } from 'react';
import { getInventory, saveInventory } from '../utils/storage';

const UNITS = ['g', 'kg', 'ml', 'L', 'pcs', 'tbsp', 'tsp', 'cup', 'oz', 'lb'];

function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, expiring-soon, expired, good
  const [sortBy, setSortBy] = useState('name'); // name, expiration, quantity
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    expirationDate: '',
    category: '',
    notes: '',
  });

  useEffect(() => {
    const savedIngredients = getInventory();
    setIngredients(savedIngredients);
  }, []);

  const handleEditIngredient = (ingredient) => {
    setIsEditing(true);
    setNewIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedIngredients = ingredients.map((ing) =>
        ing.id === newIngredient.id ? newIngredient : ing
      );
      setIngredients(updatedIngredients);
      saveInventory(updatedIngredients);
    } else {
      const updatedIngredients = [
        ...ingredients,
        { id: Date.now(), ...newIngredient },
      ];
      setIngredients(updatedIngredients);
      saveInventory(updatedIngredients);
    }
    setNewIngredient({
      name: '',
      quantity: '',
      unit: 'g',
      expirationDate: '',
      category: '',
      notes: '',
    });
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleDeleteIngredient = (id) => {
    const updatedIngredients = ingredients.filter((ing) => ing.id !== id);
    setIngredients(updatedIngredients);
    saveInventory(updatedIngredients);
  };

  const handleQuantityChange = (id, change) => {
    const updatedIngredients = ingredients.map((ing) => {
      if (ing.id === id) {
        const newQuantity = Math.max(0, parseFloat(ing.quantity) + change);
        return { ...ing, quantity: newQuantity.toString() };
      }
      return ing;
    });
    setIngredients(updatedIngredients);
    saveInventory(updatedIngredients);
  };

  const handleUnitChange = (id, newUnit) => {
    const updatedIngredients = ingredients.map((ing) => {
      if (ing.id === id) {
        return { ...ing, unit: newUnit };
      }
      return ing;
    });
    setIngredients(updatedIngredients);
    saveInventory(updatedIngredients);
  };

  const getExpirationStatus = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring-soon';
    if (diffDays <= 7) return 'expiring';
    return 'good';
  };

  const filteredIngredients = ingredients
    .filter((ing) => {
      const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || getExpirationStatus(ing.expirationDate) === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'expiration':
          return new Date(a.expirationDate) - new Date(b.expirationDate);
        case 'quantity':
          return parseFloat(a.quantity) - parseFloat(b.quantity);
        default:
          return 0;
      }
    });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setNewIngredient({
      name: '',
      quantity: '',
      unit: 'g',
      expirationDate: '',
      category: '',
      notes: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white">
            Inventory
          </h2>
          <p className="mt-2 text-sm text-secondary-700 dark:text-secondary-300">
            Manage your ingredients and track their expiration dates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add ingredient
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">All Items</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="good">Good</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="expiration">Sort by Expiration</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-secondary-300 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary-900 dark:text-white sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                        Quantity
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                        Expiration Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-white">
                        Category
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-900">
                    {filteredIngredients.map((ingredient) => {
                      const status = getExpirationStatus(ingredient.expirationDate);
                      const statusClasses = {
                        expired: 'text-red-600 dark:text-red-400',
                        'expiring-soon': 'text-orange-600 dark:text-orange-400',
                        expiring: 'text-yellow-600 dark:text-yellow-400',
                        good: 'text-green-600 dark:text-green-400',
                      };

                      return (
                        <tr key={ingredient.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-secondary-900 dark:text-white sm:pl-6">
                            {ingredient.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-700 dark:text-secondary-300">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(ingredient.id, -1)}
                                className="text-secondary-400 hover:text-primary-500"
                              >
                                -
                              </button>
                              <span>{ingredient.quantity}</span>
                              <select
                                value={ingredient.unit}
                                onChange={(e) => handleUnitChange(ingredient.id, e.target.value)}
                                className="block w-20 rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              >
                                {UNITS.map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleQuantityChange(ingredient.id, 1)}
                                className="text-secondary-400 hover:text-primary-500"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={statusClasses[status]}>
                              {new Date(ingredient.expirationDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-700 dark:text-secondary-300">
                            {ingredient.category}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleEditIngredient(ingredient)}
                              className="text-secondary-400 hover:text-primary-500 dark:text-secondary-500 dark:hover:text-primary-400 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                              className="text-secondary-400 hover:text-red-500 dark:text-secondary-500 dark:hover:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-secondary-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddIngredient}>
                <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                        {isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={newIngredient.name}
                            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              required
                              min="0"
                              step="0.1"
                              value={newIngredient.quantity}
                              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              Unit
                            </label>
                            <select
                              name="unit"
                              id="unit"
                              required
                              value={newIngredient.unit}
                              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                              className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            >
                              {UNITS.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="expirationDate" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            name="expirationDate"
                            id="expirationDate"
                            required
                            value={newIngredient.expirationDate}
                            onChange={(e) => setNewIngredient({ ...newIngredient, expirationDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            value={newIngredient.category}
                            onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                            className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="e.g., Dairy, Produce, Pantry"
                          />
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            id="notes"
                            rows={3}
                            value={newIngredient.notes}
                            onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                            className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Any additional notes about this ingredient"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Save Changes' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 dark:border-secondary-600 shadow-sm px-4 py-2 bg-white dark:bg-secondary-800 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage; 