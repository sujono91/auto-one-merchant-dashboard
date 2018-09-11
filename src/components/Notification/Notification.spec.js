import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';

import Notification from './Notification';

afterEach(cleanup);

const props = {
  message: 'Successfully Add Item',
  isOpen: true,
  handleClose: () => {}
};

jest.spyOn(props, 'handleClose');

test('render notification component successfully', () => {
  const { getByText } = render(<Notification {...props} />);
  expect(getByText(props.message)).not.toBeNull();
});

test('should close notification component correctly', () => {
  const { getByTestId } = render(<Notification {...props} />);
  const closeButtonComponent = getByTestId('closeButton');
  fireEvent.click(closeButtonComponent);
  expect(props.handleClose).toHaveBeenCalled();
});

afterEach(() => jest.resetModules());
