import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = ({foodRecipes}) => {

    const navigate = useNavigate()

    return (
        <div className="recipes">
            <h1>Recipes</h1>
            <div className="recipesCheck">
                {foodRecipes && foodRecipes.length > 0?
                <div className="recipesList">
                    {foodRecipes.map((recipe, index) => {
                        return (
                            <div key={index} className="recipe">
                                <h2>{recipe.title}</h2>
                                <p>{recipe.description}</p>
                                <p>{recipe.nutrition}</p>
                            </div>
                        )
                    })}
                </div>
                :<p>No recipes yet. Wait until we prepare them...</p>}
            </div>
            <button onClick={() => {navigate("/")}}>Go back</button>

        </div>
    );
}
 
export default Recipes;