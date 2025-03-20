import React, { useState } from "react";
import axios from "axios";

function RecipeSearch() {
    const [ingredient, setIngredient] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [recipes, setRecipes] = useState(null);
    const [cacheRecipes, setcacheRecipes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recipeID, setrecipeID] = useState();
    const [recipeDetails, setRecipeDetails] = useState('')
    const [recipeDetailsResponseMesssage, setrecipeDetailsResponseMesssage] = useState('')
    const [detailsError, setDetailsError] = useState(null)

    const handleChange = (event) => {
        setIngredient(event.target.value);
    };

    const handleSubmit = () => {
        if (ingredient.trim() === "") return;
        setIngredientsList([...ingredientsList, ingredient]);
        setIngredient("");
    };

    const handleDelete = (index) => {
        setIngredientsList(ingredientsList.filter((_, i) => i !== index));
    };

    const handleEdit = (index) => {
        setIngredient(ingredientsList[index]);
        handleDelete(index);
    };

    const searchRecipe = async () => {
        
        if (ingredientsList.length === 0) {
            alert("Please add at least one ingredient!");
            return;
        }
        setLoading(true);
        setError(null)
        setResponseMessage("")
        setRecipes(null)
        try {
            const response = await axios.post("http://127.0.0.1:8000/search_recipe/", {
                ingredients: ingredientsList
            });

            setRecipes(response.data.recipes || []);
            setcacheRecipes(response.data.recipes || []);
            setResponseMessage(response.data.message || "Recipes found");

            console.log("Response from backend:", response.data);
            console.log("Cached Recipes in Search Portion:", cacheRecipes)
            
        } catch (error) {
            console.error("Error:", error.response?.data?.detail || "Unknown error in the Frontend!");
            setError(error.response?.data?.detail || "Something went wrong in the Frontedn!");
        } finally {
            setLoading(false)
        }
    };

    function backToRecipeList(){
        console.log(cacheRecipes)
        
        setRecipeDetails(null);
        setrecipeDetailsResponseMesssage("");
        setDetailsError(null);

        setRecipes(cacheRecipes)

        console.log("Recipes Returned!")
    
    }

    async function sendID(id) {
        setRecipeDetails(null);
        setrecipeDetailsResponseMesssage("");
        setDetailsError(null);
    
        try {
            
            const response = await axios.post("http://127.0.0.1:8000/search_id/", {
                id: id  
            });
    
            
            setRecipeDetails(response.data.recipe_details || []);
            setrecipeDetailsResponseMesssage(response.data.message);
            setRecipes(null); 
    
            // Log the full response for debugging
            console.log("ID Backend data ->", response.data);
        } catch (error) {
            // Improved error handling with more details
            if (error.response) {
                console.error("Error response from backend:", error.response.data);
                setDetailsError(error.response?.data?.detail || "Something went wrong on the backend!");
            } else if (error.request) {
                console.error("No response received:", error.request);
                setDetailsError("No response from the server!");
            } else {
                console.error("Request error:", error.message);
                setDetailsError("An error occurred while sending the request!");
            }
        }
    
        setrecipeID(id);
        
    }
    

    return (
        <div className="container">
            <h2 className="header">Enter Ingredients You Have on Hand!</h2>
            <div className="input-container">
                <input
                    type="text"
                    value={ingredient}
                    onChange={handleChange}
                    placeholder="Enter Ingredient"
                    className="input"
                />
                <button onClick={handleSubmit} className="add-button">Add</button>
            </div>
    
            <h3>Your Ingredients:</h3>
            <ul className="ingredients-list">
                {ingredientsList.map((item, index) => (
                    <li key={index} className="ingredient-item">
                        {item}
                        <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
    
            <h4>Ready to Search? Hit Submit!</h4>
            <button onClick={searchRecipe} disabled={loading} className="search-button">
                {loading ? "Searching...." : "Search Recipe"}
            </button>
    
            {responseMessage && <p className="response-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
    
            {recipes && recipes.length > 0 && (
                <div className="recipes-container">
                    <h3>Recipes Found:</h3>
                    <ul className="recipes-list">
                        {recipes.map((recipe) => (
                            <li key={recipe.id} className="recipe-item">
                                <strong>{recipe.title}</strong>
                                <p><strong>Used Ingredients:</strong> {recipe.used_ingredients.join(", ")}</p>
                                <p><strong>Missed Ingredients:</strong> {recipe.missed_ingredients.join(", ")}</p>
                                <button onClick={() => sendID(recipe.id)} className="select-button">Select Recipe</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
    
            {recipeDetails && (
                <div className="recipe-details">
                    <h3>Recipe Details:</h3>
                    <strong>{recipeDetails.title}</strong>
                    <img src={recipeDetails.image} alt={recipeDetails.title} className="recipe-image" />
                    
                    
                    <h4>Cooking Time: {recipeDetails.cooking_minutes !== null ? recipeDetails.cooking_minutes : "N/A"} minutes</h4>
    
                    <h4>Recipe Details: </h4>
                    <ul>
                        {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 ? (
                            recipeDetails.ingredients.map((ingredient, index) => (
                                <li key={index} className="ingredient-details">
                                    {ingredient.amount} {ingredient.unit} of {ingredient.name}
                                </li>
                            ))
                        ) : (
                            <p>No ingredients available</p>
                        )}
                    </ul>
                    <button onClick={backToRecipeList}>Back to Recipe List</button>
                </div>
            )}
        </div>
    );
    
}

export default RecipeSearch;
