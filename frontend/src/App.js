import React, {useState} from 'react';
import GroceryList from './pages/GroceryList';
import RandomRecipe from './pages/RandomRecipe';
import RecipeSearch from './pages/RecipeSearch';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
 

function App() {
  return (
    <Router>
      <div className='App'>
        <nav>
          <ul>
            {/*ENTER THE LINKS HERE IN  LIs*/}
            <li><Link to="/grocery">Grocery List</Link></li>
            <li><Link to="/random">Random Recipe</Link></li>
            <li><Link to="/search">Recipe Search</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/grocery" element={<GroceryList />}></Route>
          <Route path="/random" element={<RandomRecipe />}></Route>
          <Route path="/search" element={<RecipeSearch />}></Route>
        </Routes>

      </div>
    </Router>

    
)
    
}
export default App;
