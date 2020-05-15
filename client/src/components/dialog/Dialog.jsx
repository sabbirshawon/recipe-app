import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import './Dialog.scss';

const SimpleDialog = (props) => {
  const { onClose, selectedValue, open, title } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby={title} open={open}>
      {props.children}
    </Dialog>
  );
};

export default memo(SimpleDialog);
