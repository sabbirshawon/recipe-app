import React, {
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import { useParams, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AuthContext from '../contexts/auth-context';
import { Button } from '@material-ui/core';
import axios from 'axios';

const EditRecipe = (props) => {
  const { recipeId } = useParams();
  const [file, setFile] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([
    { key: '', value: '' },
  ]);
  const [calorie, setCalorie] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [fat, setFat] = useState('');
  const context = useContext(AuthContext);

  useEffect(() => {
    fetch(`/recipes/${recipeId}`)
      .then((res) => res.json())
      .then((res) => {
        setTitle(res.recipe.title);
        setDescription(res.recipe.description);
        setCalorie(res.recipe.calorie);
        setCholesterol(res.recipe.cholesterol);
        setIngredients([...res.recipe.ingredients]);
        setProtein(res.recipe.protein);
        setFat(res.recipe.fat);
        setFiber(res.recipe.fiber);
        setFile(res.recipe.recipeImage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [recipeId]);

  const updateIngredients = () => {
    setIngredients((prevArray) => [
      ...prevArray,
      { key: '', value: '' },
    ]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const updateFieldChanged = (index, type) => (e) => {
    let newIng = [...ingredients];
    newIng[index][type] = e.target.value;
    setIngredients(newIng);
  };

  const handleEditRecipe = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('calorie', calorie);
    formData.append('cholesterol', cholesterol);
    formData.append('protein', protein);
    formData.append('fiber', fiber);
    formData.append('fat', fat);
    formData.append('ingredients', JSON.stringify(ingredients));

    axios
      .put(`/recipes/saveRecipe/${recipeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + context.token,
        },
      })
      .then((res) => {
        if (res.data.successMsg) {
          props.history.push('/');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="add_recipe_wrap">
      {context.token ? (
        <>
          <h1>Edit your recipe</h1>
          <div className="form-fields">
            <form
              autoComplete="off"
              onSubmit={handleEditRecipe}
              encType="multipart/form-data"
            >
              <TextField
                id="standard-basic"
                label="Title"
                value={title}
                variant="outlined"
                margin="normal"
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                id="standard-multiline-static"
                label="Description"
                value={description}
                fullWidth
                multiline
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
              <div className="input_file_wrapper">
                <input
                  type="file"
                  accept="image/*"
                  id="recipeImage"
                  onChange={handleFileChange}
                />
              </div>
              <div className="ingredients_wrapper">
                <h2>Ingredients</h2>
                <Grid container spacing={2}>
                  {ingredients &&
                    ingredients.map((ing, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Grid item xs={6} sm={6}>
                            <TextField
                              label="Key"
                              variant="outlined"
                              margin="normal"
                              value={ing.key}
                              onChange={updateFieldChanged(
                                index,
                                'key'
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <TextField
                              label="Value"
                              variant="outlined"
                              margin="normal"
                              value={ing.value}
                              onChange={updateFieldChanged(
                                index,
                                'value'
                              )}
                            />
                          </Grid>
                        </React.Fragment>
                      );
                    })}
                </Grid>
                <Button onClick={updateIngredients}>
                  Add More Ingredients
                </Button>
              </div>
              <div className="nutritions_wrapper">
                <h2>Nutritions</h2>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="standard-basic"
                      value={calorie}
                      onChange={(e) => setCalorie(e.target.value)}
                      label="Calorie"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="standard-basic"
                      value={cholesterol}
                      onChange={(e) => setCholesterol(e.target.value)}
                      label="Cholesterol"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="protein"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      label="Protein"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="fiber"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                      label="Fiber"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="fat"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      label="Fat"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Save Recipe
                </Button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <h1>Please login to view this page</h1>
      )}
    </div>
  );
};

export default withRouter(EditRecipe);
