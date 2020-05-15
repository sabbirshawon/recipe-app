import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AuthContext from '../../contexts/auth-context';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '../dialog/Dialog';
import './Recipe.scss';

const Recipe = (props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const context = useContext(AuthContext);

  const useStyles = makeStyles({
    root: {
      maxWidth: 310,
      marginBottom: 10,
    },
    media: {
      height: 140,
    },
  });

  useEffect(() => {
    fetch(`/users/check-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          setShowDeleteBtn(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context]);

  const handleClickOpen = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleEditRecipe = (recipeId) => {
    fetch(`/recipes/${recipeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
      body: JSON.stringify({
        recipeId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          props.history.push(`/recipes/edit/${res.recipeId}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <CardActionArea
          onClick={() => props.handleRecipe(props.recipe._id)}
        >
          <CardMedia
            className={classes.media}
            image={
              process.env.PUBLIC_URL +
              '/uploads/' +
              props.recipe.recipeImage
            }
            title={props.recipe.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.recipe.title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {props.recipe.description.substring(0, 50)}...
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {props.recipe.creator === context.userId && showDeleteBtn && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={() => handleEditRecipe(props.recipe._id)}
              >
                Edit
              </Button>
            </>
          )}
          <Button
            size="small"
            color="primary"
            onClick={() => props.handleRecipe(props.recipe._id)}
          >
            See Details
          </Button>
        </CardActions>
      </Card>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        title="Are you sure you want to delete?"
      >
        <DialogTitle id="simple-dialog-title">
          Are you sure you want to delete?
        </DialogTitle>
        <div className="dialog_actions">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => props.deleteRecipe(props.recipe._id)}
          >
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </Dialog>
    </>
  );
};

export default withRouter(Recipe);
