import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';

import NavBar from './NavBar';

afterEach(cleanup);

const pushFunc = () => {};

const props = {
  title: 'Detail',
  hasBackAction: true,
  navigate: {
    push: () => {}
  },
  backURL: '/'
};

jest.spyOn(props.navigate, 'push');

it('render navbar component successfully', () => {
  const { getByText } = render(<NavBar {...props} />);
  expect(getByText(props.title)).not.toBeNull();
});

it('should not click navigate to previous URL successfully', () => {
  const modifiedProps = {
    ...props,
    navigate: {}
  };
  const { getByTestId } = render(<NavBar {...modifiedProps} />);
  const backButtonComponent = getByTestId('backButton');
  fireEvent.click(backButtonComponent);
  expect(props.navigate.push).not.toHaveBeenCalled();
});

it('should click navigate to previous URL successfully', () => {
  const { getByTestId } = render(<NavBar {...props} />);
  const backButtonComponent = getByTestId('backButton');
  fireEvent.click(backButtonComponent);
  expect(props.navigate.push).toHaveBeenCalledWith(props.backURL);
});

afterEach(() => jest.resetModules());
