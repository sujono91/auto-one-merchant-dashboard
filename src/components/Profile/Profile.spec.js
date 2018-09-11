import React from 'react';
import { render, cleanup } from 'react-testing-library';

import Profile from './Profile';

afterEach(cleanup);

const props = {
  url: ''
};

test('render profile component successfully', () => {
  require('./index');
  const { getByTestId } = render(<Profile {...props} />);
  expect(getByTestId('profile')).not.toBeNull();
});

afterEach(() => jest.resetModules());
