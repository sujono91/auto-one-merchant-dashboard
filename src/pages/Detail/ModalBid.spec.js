import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from 'react-testing-library';

import ModalBid from './ModalBid';

const setIsOpenModalStateSpy = jest.fn();
const setBidSpy = jest.fn();
const props = {
  carTitle: null,
  amount: null,
  id: null,
  merchantId: null,
  created: null,
  isEdit: false,
  setBid: setBidSpy,
  setIsOpenModalState: setIsOpenModalStateSpy
};

jest.mock('../../api', () => {
  const editFn = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve({
        isEdit: true
      });
    });
  });
  const addFn = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve({
        isAdd: true
      });
    });
  });

  global.mockEditFn = editFn;
  global.mockAddFn = addFn;

  return {
    formatRef: () => {},
    edit: mockEditFn,
    add: mockAddFn,
    ENDPOINT: {}
  };
});

afterEach(cleanup);

test('should render Modal Bid component successfully', () => {
  require('./index');
  const { getByTestId } = render(<ModalBid {...props} />);
  expect(getByTestId('dialogContent')).not.toBeNull();
});

test('should change car title successfully', async () => {
  const { getByPlaceholderText, getByValue } = render(<ModalBid {...props} />);
  const carTitleInput = getByPlaceholderText('Car Title');
  fireEvent.change(carTitleInput, {
    target: { value: 'Audi' }
  });
  await waitForElement(() => getByValue('Audi'));
});

test('should change amount successfully', async () => {
  const { getByPlaceholderText, getByValue } = render(<ModalBid {...props} />);
  const amountInput = getByPlaceholderText('0');
  fireEvent.change(amountInput, {
    target: { value: '50000' }
  });
  await waitForElement(() => getByValue('50000'));
});

test('should click cancel button correctly', async () => {
  const { getByText } = render(<ModalBid {...props} />);
  const cancelButton = getByText('Cancel');
  fireEvent.click(cancelButton);
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
});

test('should click cancel button correctly', async () => {
  const { getByText } = render(<ModalBid {...props} />);
  const cancelButton = getByText('Cancel');
  fireEvent.click(cancelButton);
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
});

test('should add bid successfully', async () => {
  const { getByText, getByPlaceholderText, getByValue } = render(
    <ModalBid {...props} />
  );
  const carTitleInput = getByPlaceholderText('Car Title');
  fireEvent.change(carTitleInput, {
    target: { value: 'Audi' }
  });
  await waitForElement(() => getByValue('Audi'));
  const amountInput = getByPlaceholderText('0');
  fireEvent.change(amountInput, {
    target: { value: '50000' }
  });
  await waitForElement(() => getByValue('50000'));
  const submitButton = getByText('Submit');
  fireEvent.click(submitButton);
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
  expect(setBidSpy).toHaveBeenCalled();
});

test('should add bid successfully with existing merchant', async () => {
  const modifiedProps = {
    ...props,
    merchantId: '123'
  };
  const { getByText, getByPlaceholderText, getByValue } = render(
    <ModalBid {...modifiedProps} />
  );
  const carTitleInput = getByPlaceholderText('Car Title');
  fireEvent.change(carTitleInput, {
    target: { value: 'Audi' }
  });
  await waitForElement(() => getByValue('Audi'));
  const amountInput = getByPlaceholderText('0');
  fireEvent.change(amountInput, {
    target: { value: '50000' }
  });
  await waitForElement(() => getByValue('50000'));
  const submitButton = getByText('Submit');
  fireEvent.click(submitButton);
  expect(global.mockAddFn).toHaveBeenCalled();
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
  expect(setBidSpy).toHaveBeenCalled();
});

test('should edit bid successfully', async () => {
  const modifiedProps = {
    ...props,
    isEdit: true
  };

  const { getByText, getByPlaceholderText, getByValue } = render(
    <ModalBid {...modifiedProps} />
  );
  const carTitleInput = getByPlaceholderText('Car Title');
  fireEvent.change(carTitleInput, {
    target: { value: 'Audi' }
  });
  await waitForElement(() => getByValue('Audi'));
  const amountInput = getByPlaceholderText('0');
  fireEvent.change(amountInput, {
    target: { value: '50000' }
  });
  await waitForElement(() => getByValue('50000'));
  const submitButton = getByText('Submit');
  fireEvent.click(submitButton);
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
  expect(setBidSpy).toHaveBeenCalled();
});

test('should edit bid successfully with existing merchant', async () => {
  const modifiedProps = {
    ...props,
    isEdit: true,
    merchantId: '123'
  };

  const { getByText, getByPlaceholderText, getByValue } = render(
    <ModalBid {...modifiedProps} />
  );
  const carTitleInput = getByPlaceholderText('Car Title');
  fireEvent.change(carTitleInput, {
    target: { value: 'Audi' }
  });
  await waitForElement(() => getByValue('Audi'));
  const amountInput = getByPlaceholderText('0');
  fireEvent.change(amountInput, {
    target: { value: '50000' }
  });
  await waitForElement(() => getByValue('50000'));
  const submitButton = getByText('Submit');
  fireEvent.click(submitButton);
  expect(global.mockEditFn).toHaveBeenCalled();
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(false);
  expect(setBidSpy).toHaveBeenCalled();
});

afterEach(() => jest.resetModules());
