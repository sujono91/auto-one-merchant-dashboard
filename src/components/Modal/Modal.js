import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogTitle } from '@material-ui/core';

const Modal = ({ isOpenModal, title, content }) => {
  return (
    <div>
      <Dialog open={isOpenModal}>
        <DialogTitle>{title}</DialogTitle>
        {content}
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired
};

export default Modal;
