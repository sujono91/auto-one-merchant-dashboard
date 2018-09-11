import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';

import ModalBid from './ModalBid';
import CONSTANT from '../../constant';

const props = {
  carTitle: null,
  amount: null,
  id: null,
  merchantId: null,
  created: null,
  isEdit: false,
  setBid: () => {},
  setIsOpenModalState: () => {}
};

afterEach(cleanup);

test('should render Modal Bid component successfully', () => {
  require('./index');
  const { getByTestId } = render(<ModalBid {...props} />);
  expect(getByTestId('dialogContent')).not.toBeNull();
});
