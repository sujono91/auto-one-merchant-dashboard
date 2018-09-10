import React from 'react';
import PropTypes from 'prop-types';

import { Snackbar, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const Notification = ({ message, isOpen, handleClose }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={isOpen}
      onClose={() => handleClose()}
      autoHideDuration={3000}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          data-testid="closeButton"
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

Notification.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string
};

Notification.defaultProps = {
  isOpen: false,
  message: ''
};

export default Notification;
