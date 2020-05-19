import React, {
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import { withRouter } from 'react-router-dom';
import AuthContext from '../contexts/auth-context';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import './AddRecipe.scss';
import { Button } from '@material-ui/core';

const AddRecipe = (props) => {
  const [file, setFile] = useState('');
  const [ingredients, setIngredients] = useState([
    {
      key: '',
      value: '',
    },
  ]);
  const title = useRef();
  const description = useRef();
  const calorie = useRef();
  const cholesterol = useRef();
  const protein = useRef();
  const fiber = useRef();
  const fat = useRef();

  const context = useContext(AuthContext);

  useEffect(() => {
    if (context.tokenExpiration) {
      fetch('/users/check-token-validity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.token,
        },
        body: JSON.stringify({ accessToken: context.token }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            context.logout();
            props.history.push('/login');
          }
        });
    }
  }, [context, props]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.current.value);
    formData.append('description', description.current.value);
    formData.append('calorie', calorie.current.value);
    formData.append('cholesterol', cholesterol.current.value);
    formData.append('protein', protein.current.value);
    formData.append('fiber', fiber.current.value);
    formData.append('fat', fat.current.value);
    formData.append('ingredients', JSON.stringify(ingredients));

    axios
      .post('/recipes/addRecipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + context.token,
        },
      })
      .then((res) => {
        props.history.push('/');
      })
      .catch((err) => console.log(err));
  };

  const updateIngredients = () => {
    setIngredients((prevArray) => [
      ...prevArray,
      { key: '', value: '' },
    ]);
  };

  const updateFieldChanged = (index, type) => (e) => {
    let newIng = [...ingredients];
    newIng[index][type] = e.target.value;
    setIngredients(newIng);
  };

  return (
    <div className="add_recipe_wrap">
      {context.token ? (
        <>
          <h1>Add your recipe</h1>
          <div className="form-fields">
            <form
              autoComplete="off"
              onSubmit={handleOnSubmit}
              encType="multipart/form-data"
            >
              <TextField
                id="standard-basic"
                label="Title"
                inputRef={title}
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="standard-multiline-static"
                label="Description"
                inputRef={description}
                fullWidth
                multiline
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
                  {ingredients.map((ing, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Key"
                            variant="outlined"
                            margin="normal"
                            value={ing.key || ''}
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
                      inputRef={calorie}
                      label="Calorie"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="standard-basic"
                      inputRef={cholesterol}
                      label="Cholesterol"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="protein"
                      inputRef={protein}
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
                      inputRef={fiber}
                      label="Fiber"
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      id="fat"
                      inputRef={fat}
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
                  Add Recipe
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

export default withRouter(AddRecipe);
