import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth-context';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import './AddRecipe.css';

const AddRecipe = (props) => {
  const context = useContext(AuthContext);
  return (
    <>
      {context.token ? (
        <Link to="/add-recipe">
          <Button
            variant="contained"
            color="secondary"
            className="addRecipeBtn"
          >
            Add your recipe
          </Button>
        </Link>
      ) : (
        <Tooltip title="Login to add you recipe" className="tooltip">
          <Button
            variant="contained"
            color="secondary"
            className="addRecipeBtn"
          >
            Add your recipe
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default AddRecipe;
