import React from 'react';
import { render, cleanup } from 'react-testing-library';

import App from './App';
jest.mock('./pages/Home', () => {
  return () => <div>Home</div>;
});

afterEach(cleanup);

it('renders without crashing', () => {
  const { getByText } = render(<App />);
  getByText('Home');
});
