import React, { useContext, useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Loader from '../components/loader/Loader';
import Recipe from '../components/recipe/Recipe';
import AuthContext from '../contexts/auth-context';
import './UserPage.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const UserPage = (props) => {
  const context = useContext(AuthContext);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    fetchRecipeByUser(username);
  }, [context, username]);

  const fetchRecipeByUser = (username) => {
    fetch(`/users/${username}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          setRecipes(res.recipes);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(true);
      });
  };

  const handleRecipe = (recipeId) => {
    props.history.push('/recipes/' + recipeId);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          fetchRecipeByUser(username);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="user_page_wrap">
      {loading &&
      Object.keys(user).length === 0 &&
      user.constructor === Object ? (
        <div className="loader_wrap">
          <Loader width={120} height={120} />
        </div>
      ) : (
        <React.Fragment>
          <div className="user">
            <div className="user_thumbnail">
              <img
                src={process.env.PUBLIC_URL + '/user.png'}
                alt={user.name}
              />
            </div>
            <div className="user_details">
              <h1>{user.name}</h1>
              <div className={classes.root}>
                <AppBar
                  position="static"
                  className="user_recipes_tab_header"
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="Created Recipes" {...a11yProps(0)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <div className="recipes">
                    {!loading && recipes.length === 0 && (
                      <h2>You have no items</h2>
                    )}
                    {loading && recipes && recipes.length === 0 && (
                      <Loader width={120} height={120} />
                    )}
                    {recipes.map((recipe) => {
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
                </TabPanel>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default withRouter(UserPage);
