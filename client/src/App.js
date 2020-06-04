import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import NoMatch from './pages/NoMatch';
import UserPage from './pages/UserPage';
import RecipesPage from './pages/Recipes';
import EditRecipe from './pages/EditRecipe';
import AddRecipePage from './pages/AddRecipe';
import ResetPassword from './pages/ResetPassword';
import AuthContext from './contexts/auth-context';
import RecipeDetails from './pages/RecipeDetails';
import ForgetPassword from './pages/ForgetPassword';
import NavbarFallback from './components/fallbacks/Navbar';
import { GlobalStyle } from './globalStyles';
import './App.scss';

const Navbar = lazy(() => import('./components/navigations/Navbar'));

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState('');
  const [theme, setTheme] = useState({ mode: 'light' });

  useEffect(() => {
    const userInfoToken = JSON.parse(
      localStorage.getItem('userInfo')
    );
    const userIdLocal = JSON.parse(localStorage.getItem('userId'));
    const tokenExp = JSON.parse(
      localStorage.getItem('tokenExpiration')
    );
    if (userInfoToken && userIdLocal && tokenExp) {
      setToken(userInfoToken);
      setUserId(userIdLocal);
      setTokenExpiration(tokenExp);
    }
    const theme = JSON.parse(
      localStorage.getItem('theme')
    );
    if(theme) {
      setTheme(theme);
    } else {
      setTheme({ mode: 'light' })
    }
  }, []);

  const login = (token, userId, tokenExpiratopn) => {
    setToken(token);
    setUserId(userId);
    setTokenExpiration(tokenExpiratopn);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
  };

  const handleTheme = () => {
    setTheme(theme.mode === 'dark' ? { mode: 'light' } : { mode: 'dark' });
    localStorage.setItem(
      'theme',
      JSON.stringify(theme.mode === 'dark' ? { mode: 'light' } : { mode: 'dark' })
    );
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider
          value={{
            token,
            userId,
            login,
            logout,
            tokenExpiration,
          }}
        >
          <Suspense fallback={<NavbarFallback />}>
            <Navbar handleTheme={handleTheme} />
          </Suspense>
          <GlobalStyle />
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
      </ThemeProvider>
    </Router>
  );
}

export default App;
