from fastapi import APIRouter, HTTPException
from models.models import (  # ✅ Import models from models.py instead of redefining them
    RecipeSearchRequest,
    Recipe,
    RecipeSearchResponse,
    RecipeIDSearchRequest,
    Ingredient,
    RecipeDetails,
    RecipeDetailsResponse
)
from calls.recipecall import RecipeCall

router = APIRouter()

# POST endpoint to receive ingredients and return recipes
@router.post("/search_recipe/", response_model=RecipeSearchResponse)
async def search_recipe(request: RecipeSearchRequest):
    if not request.ingredients:
        raise HTTPException(status_code=400, detail="Ingredient list cannot be empty")

    try:
        # Fetch and parse recipes using RecipeCall
        recipe_call = RecipeCall()
        recipes = recipe_call.get_recipes(request.ingredients)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")

    # Return the response
    return {
        "message": "Recipes retrieved successfully",
        "received_ingredients": request.ingredients,
        "recipes": recipes
    }

@router.post("/search_id/", response_model=RecipeDetailsResponse)  # ✅ Fix response model
async def search_by_id(request: RecipeIDSearchRequest):
    if not request.id:
        raise HTTPException(status_code=400, detail="ID Cannot be empty!")
    try:
        recipe_call = RecipeCall()
        recipe_details = recipe_call.get_recipe_by_id(request.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recipe details from the backend!: {str(e)}")

    return {
        "message": "Recipe Information received correctly!",
        "recipe_details": recipe_details  
    }
