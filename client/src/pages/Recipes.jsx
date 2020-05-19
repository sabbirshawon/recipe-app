import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import AddRecipeBtn from '../components/button/AddRecipe';
import Recipe from '../components/recipe/Recipe';
import AuthContext from '../contexts/auth-context';
import './Recipes.scss';

const RecipesPage = (props) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    fetch('/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: context && context.userId ? context.userId : '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setRecipes(res.recipes);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(true);
      });
    return () => {
      // eslint-disable-next-line
      isMounted = false;
    };
  }, [context]);

  const handleRecipe = (recipeId) => {
    props.history.push('/recipes/' + recipeId);
  };

  const handleDeleteRecipe = (recipeId) => {
    fetch('/recipes/delete-recipe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.successMsg) {
          fetch('/recipes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: context && context.userId ? context.userId : '',
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              setRecipes(res.recipes);
              setLoading(false);
            })
            .catch((err) => {
              setLoading(true);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="recipes_wrapper">
      <div className="recipe_add_action">
        <AddRecipeBtn />
      </div>
      <div className="recipes" data-testid="recipes">
        {loading && recipes && recipes.length === 0 && (
          <Loader width={120} height={120} />
        )}
        {!loading && recipes && recipes.length === 0 && (
          <h2>No, items found</h2>
        )}
        {recipes &&
          recipes.map((recipe) => {
            return (
              <Recipe
                recipe={recipe}
                handleRecipe={handleRecipe}
                key={recipe._id}
                deleteRecipe={handleDeleteRecipe}
              />
            );
          })}
      </div>
    </div>
  );
};

export default withRouter(RecipesPage);
