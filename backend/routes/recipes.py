from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from calls.recipecall import RecipeCall

router = APIRouter()

# Request model for POST
class RecipeSearchRequest(BaseModel):
    ingredients: List[str]

# Recipe model for response (matches parsed output)
class Recipe(BaseModel):
    title: str
    id: int
    used_ingredients: List[str]
    missed_ingredients: List[str]
    
# Response model for POST
class RecipeSearchResponse(BaseModel):
    message: str
    received_ingredients: List[str]
    recipes: List[Recipe]

class RecipeIDSearchRequest(BaseModel):
    id: int

class Ingredient(BaseModel):
    name: str
    amount: float
    unit: str
    image: Optional[str] = None

class RecipeDetails(BaseModel):
    title: str
    id: int
    image: str
    cooking_minutes: int
    source_url: str
    ingrediants: List[Ingredient]

class RecipeDetailsResponse(BaseModel):
    message:str
    recipe_details: RecipeDetails

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

@router.post("/search_id/", response_model=RecipeSearchResponse)
async def search_by_id(request: RecipeIDSearchRequest):
    if not request.id:
        raise HTTPException(status_code=400, detail="ID Cannot be empty!")
    try:
        recipe_call = RecipeCall()
        recipe_details = recipe_call.get_recipe_by_id(request.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recipe detials!: {str(e)}")

    return {
        "message": "Recipe Information recieved correctly!",
        "id": request.id,
        "recipe_details": recipe_details
    }