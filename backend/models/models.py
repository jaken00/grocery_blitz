from pydantic import BaseModel
from typing import List, Optional



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
    cooking_minutes: Optional[int] = None
    source_url: str
    ingredients: List[Ingredient]

class RecipeDetailsResponse(BaseModel):
    message:str
    recipe_details: RecipeDetails