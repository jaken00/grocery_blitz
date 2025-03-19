import os
import requests
from routes.recipes import RecipeDetails, Ingredient

# NEED TO REFACTORM THIS CLASS SO THAT INGREDIATNS IS NOT IN THE CLASS DEF AND IS IN THE FUNCTION DEF

class RecipeCall:   
    def __init__(self):
        self.key = os.getenv('RECIPE_API_KEY')
        if not self.key:
            raise ValueError("RECIPE_API_KEY not found in env variables")
        

    def get_recipes(self, ingredients):
        ingredients_str = ",+".join(ingredients)
        url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredients_str}&apiKey={self.key}"
        response = requests.get(url)  

        if response.status_code != 200:
            raise Exception(f"API request failed with status {response.status_code}: {response.text}") 
        
        
        raw_recipes = response.json()
        
        parsed_recipies = [
            {
            "title": recipe["title"],
            "id": recipe["id"],
            "used_ingredients": [ing["name"] for ing in recipe["usedIngredients"]],
            "missed_ingredients": [ing["name"] for ing in recipe["missedIngredients"]]  
            }
            for recipe in raw_recipes
        ]
        return parsed_recipies
    
    def get_recipe_by_id(self, id):
        recipe_information_url = f'https://api.spoonacular.com/recipes/{id}/information?apiKey={self.key}'
        recipe_response = requests.get(recipe_information_url)
        
        if recipe_response.status_code != 200:
            raise Exception(f"API request failed with status {recipe_response.status_code}: {recipe_response.text}") 
        
        recipe_data = recipe_response.json()
        
        recipe_details = RecipeDetails(
            title=recipe_data["title"],
            id=recipe_data["id"],
            image=recipe_data["image"],
            cooking_minutes=recipe_data["cookingMinutes"],
            source_url=recipe_data["sourceUrl"],
            ingrediants=[Ingredient(
                name=ingredient["name"],
                amount=ingredient.get("amount", 0),
                unit=ingredient.get("unit", ""),
                image=ingredient.get("image")
            ) for ingredient in recipe_data.get("extendedIngredients", [])]
        )
        
        return recipe_details
    


