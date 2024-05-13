import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = ({foodRecipes}) => {

    const navigate = useNavigate()

    return (
        <div className="recipes">
            <h1>Recipes</h1>
            <div className="recipesList">
                {foodRecipes && foodRecipes.length > 0?<ul>
                    {foodRecipes.map((recipe, index) => {
                        return <li key={index}>{recipe}</li>
                    })}
                </ul>:<p>No recipes yet. Wait until we prepare them...</p>}
            </div>
            <button onClick={() => {navigate("/")}}>Go back</button>

        </div>
    );
}
 
export default Recipes;