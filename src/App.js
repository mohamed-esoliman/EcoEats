import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GenerateRecipePage from './pages/GenerateRecipePage';
import RecipesPage from './pages/RecipesPage';
import InventoryPage from './pages/InventoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-secondary-900">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GenerateRecipePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;