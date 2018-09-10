import React from 'react';
import PropTypes from 'prop-types';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

const NavBar = ({ title, hasBackAction, navigate, backURL }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {hasBackAction && (
          <IconButton
            color="inherit"
            onClick={() => {
              if (navigate) {
                navigate.push(backURL);
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="title" color="inherit">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  hasBackAction: PropTypes.bool,
  navigate: PropTypes.object,
  backURL: PropTypes.string
};

NavBar.defaultProps = {
  hasBackAction: false,
  navigate: null,
  backURL: ''
};

export default NavBar;
