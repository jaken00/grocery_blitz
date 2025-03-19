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
            setcacheRecipes(response.data.recipe || []);
            setResponseMessage(response.data.message || "Recipes found");

            console.log("Response from backend:", response.data);
            
        } catch (error) {
            console.error("Error:", error.response?.data?.detail || "Unknown error");
            setError(error.response?.data?.detail || "Something went wrong");
        } finally {
            setLoading(false)
        }
    };

    function sendID(id) {
        setRecipeDetails(null)
        setrecipeDetailsResponseMesssage("")
        setDetailsError(null)

        try {
            const response = axios.post("http://127.0.0.1:8000/search_id/", {
                id: id
            });

            setRecipeDetails(response.data.recipe_details || [])
            setrecipeDetailsResponseMesssage(response.message)

            console.log("ID Backend data -> ". response.data)
        } catch (error) {
            console.error("Error:", error.response?.data?.detail || "Unknown error"); 
            setDetailsError(error.response?.data?.detail || "Something went wrong");
        }
        setrecipeID(id)
        //MAY NOT NEED THE SET_RECIPE
        

        // NEED SEND TO BACKEND TO THEN GET RESULTS OF THE RECIPE AND GO TO NEXT PAGE -> RECIPE_DETAILS
    }

    return (
        <div>
            <h2>Enter Ingredients You Have on Hand!</h2>
            <input
                type="text"
                value={ingredient}
                onChange={handleChange}
                placeholder="Enter Ingredient"
            />
            <button onClick={handleSubmit}>Add</button>

            <h3>Your Ingredients:</h3>
            <ul>
                {ingredientsList.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h4>Ready to Search? Hit Submit!</h4>
            <button onClick={searchRecipe} disabled={loading}>
                {loading ? "Searching...." : "Search Recipe"}
            </button>

            {responseMessage && <p>{responseMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {recipes && recipes.length > 0 && (
                <div>
                    <h3>Recipes Found:</h3>
                    <ul>
                        {recipes.map((recipe) => (
                            <li key={recipe.id}>
                                <strong>{recipe.title}</strong>
                                <p><strong>Used Ingredients:</strong> {recipe.used_ingredients.join(", ")}</p>
                                <p><strong>Missed Ingredients:</strong> {recipe.missed_ingredients.join(", ")}</p>
                                <button onClick={() => sendID(recipe.id)}>Select Recipe</button>

                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

export default RecipeSearch;
