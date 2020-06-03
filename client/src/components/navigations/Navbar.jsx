import React, { useContext, useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Drawer from '@material-ui/core/Drawer';
import AuthContext from '../../contexts/auth-context';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import './Navbar.css';

const Navbar = (props) => {
  const context = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [left, setLeft] = useState(false);

  useEffect(() => {
    if (context.userId) {
      fetch('/users/getUserName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: context.userId,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setUsername(res.username);
        });
    }
  }, [context.userId]);

  const handleLogout = () => {
    context.logout();
    setLeft(false);
    props.history.push('/login');
  };

  const toggleDrawer = () => {
    setLeft(!left);
  };
  return (
    <header className="main-navigation">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => toggleDrawer()}
        edge="start"
        className="drawer_menu_icon"
      >
        <MenuIcon />
      </IconButton>
      <div className="main-navigation__logo">
        <h1 className="main-navigation__heading">Recipe App</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink exact={true} to="/">
              Home
            </NavLink>
          </li>
          {!context.token && (
            <li>
              <NavLink exact={true} to="/login">
                Login
              </NavLink>
            </li>
          )}
          {context.userId && (
            <li>
              <NavLink exact={true} to={`/users/${username}`}>
                Profile
              </NavLink>
            </li>
          )}
          {context.token && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
          <div className="theme_btn_wrap" onClick={props.handleTheme}>
            <span>
              <Brightness2Icon />
            </span>
          </div>
        </ul>
      </nav>
      <Drawer
        anchor={'left'}
        open={left}
        onClose={() => toggleDrawer()}
      >
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <NavLink exact={true} to="/">
              Home
            </NavLink>
          </ListItem>
          {context.userId && (
            <ListItem button>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <NavLink exact={true} to={`/users/${username}`}>
                Profile
              </NavLink>
            </ListItem>
          )}
          {context.token && (
            <ListItem button>
              <ListItemIcon>
                <ExitToAppIcon color="primary" />
              </ListItemIcon>
              <button onClick={handleLogout} className="logout_btn">
                Logout
              </button>
            </ListItem>
          )}
          {!context.token && (
            <ListItem button>
              <ListItemIcon>
                <ExitToAppIcon color="primary" />
              </ListItemIcon>
              <NavLink to="/login">Login</NavLink>
            </ListItem>
          )}
        </List>
      </Drawer>
    </header>
  );
};

export default withRouter(Navbar);
