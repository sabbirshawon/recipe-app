import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import AuthContext from './contexts/auth-context';
import RecipesPage from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import AddRecipePage from './pages/AddRecipe';
import UserPage from './pages/UserPage';
import './App.scss';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import NoMatch from './pages/NoMatch';
import EditRecipe from './pages/EditRecipe';

const Navbar = lazy(() => import('./components/navigations/Navbar'));

const NavbarFallback = () => {
  return <div className="main-navigation"></div>;
};

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userInfoToken = JSON.parse(
      localStorage.getItem('userInfo')
    );
    const userIdLocal = JSON.parse(localStorage.getItem('userId'));
    if (userInfoToken && userIdLocal) {
      setToken(userInfoToken);
      setUserId(userIdLocal);
    }
  }, []);

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{
          token,
          userId,
          login,
          logout,
        }}
      >
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/login" to="/" />}
            {token && <Redirect from="/registration" to="/" />}
            {!token && <Route path="/login" component={Login} />}
            {!token && (
              <Route path="/registration" component={SignUp} />
            )}
            <Route path="/" exact component={RecipesPage} />
            <Route path="/add-recipe" component={AddRecipePage} />
            <Route
              path="/recipes/:recipeId"
              exact
              component={RecipeDetails}
            />
            <Route
              path="/recipes/edit/:recipeId"
              component={EditRecipe}
            />
            <Route path="/users/:username" component={UserPage} />
            <Route
              path="/forget-password"
              component={ForgetPassword}
            />
            <Route path="/reset/:token" component={ResetPassword} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
