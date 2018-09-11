import React from 'react';
import { render, cleanup } from 'react-testing-library';

import Loading from './Loading';

afterEach(cleanup);

test('render loading component successfully', () => {
  const { getByTestId } = render(<Loading />);
  const loadingComponent = getByTestId('loading');
  expect(loadingComponent).not.toBeNull();
});
