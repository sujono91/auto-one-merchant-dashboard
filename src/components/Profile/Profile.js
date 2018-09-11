import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';

const Profile = ({ url }) => {
  return <Avatar data-testid="profile" alt="Profile" src={url} />;
};

Profile.propTypes = {
  url: PropTypes.string
};

Profile.defaultProps = {
  url: ''
};

export default Profile;
