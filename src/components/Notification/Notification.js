import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';

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
