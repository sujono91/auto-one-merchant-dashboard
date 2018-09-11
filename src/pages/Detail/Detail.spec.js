import React from 'react';
import {
  render,
  waitForElement,
  cleanup,
  fireEvent
} from 'react-testing-library';

import Detail from './Detail';
import CONSTANT from '../../constant';

afterEach(cleanup);

const setSelectedMerchantStateSpy = jest.fn();
const pushSpy = jest.fn();
const setModalStateSpy = jest.fn();
const setIsOpenModalStateSpy = jest.fn();
const setHomeStateSpy = jest.fn();

const props = {
  isDesktop: true,
  setHasBackActionState: () => {},
  setNavigateState: () => {},
  setTitleState: () => {},
  setModalState: setModalStateSpy,
  setIsOpenModalState: setIsOpenModalStateSpy,
  setSelectedMerchantState: setSelectedMerchantStateSpy,
  history: {
    push: pushSpy
  },
  home: {
    page: 0,
    rowsPerPage: CONSTANT.ROWS_PER_PAGE,
    setHomeState: setHomeStateSpy
  },
  location: {
    pathname: `/${CONSTANT.MODE.EDIT}`
  },
  selectedMerchant: {
    id: 2,
    firstname: 'Ron',
    lastname: 'Travolta',
    avatarUrl: 'http://placehold.it/32x32',
    email: 'rosalesmoon@enervate.com',
    phone: '+19705162559',
    hasPremium: true,
    bids: '/merchants/2/bids'
  }
};

const mockChangePageFn = jest.fn(props);
const mockChangeRowsPerPageFn = jest.fn(props);

mockChangePageFn.mockImplementation(props => {
  return props.handleChangePage(0);
});

mockChangeRowsPerPageFn.mockImplementation(props => {
  return props.handleChangeRowsPerPage(10);
});

jest.mock('../../components/DataTable', () => {
  return props => (
    <div>
      {props.rows.map(row => (
        <div key={row.id}>{row.actions}</div>
      ))}
      <span data-testid="colsLength">{props.cols.length}</span>
      <button onClick={() => mockChangePageFn(props)}>Change Page</button>
      <button onClick={() => mockChangeRowsPerPageFn(props)}>
        Change Rows Per Page
      </button>
    </div>
  );
});

jest.mock('../../api', () => {
  const getFn = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve([
        {
          id: 2,
          merchantId: 2,
          carTitle: 'Toyota',
          amount: 20000,
          created: '2014-11-29T05:23:56'
        },
        {
          id: 3,
          merchantId: 2,
          carTitle: 'Toyota',
          amount: 20000,
          created: '2014-10-29T05:23:56'
        }
      ]);
    });
  });

  global.mockGetFn = getFn;

  return {
    formatRef: () => {},
    get: mockGetFn,
    add: () => {},
    edit: () => {},
    remove: () => {},
    ENDPOINT: {}
  };
});

test('should render Detail component successfully', async () => {
  require('./index');
  const { getByTestId } = render(<Detail {...props} />);
  await waitForElement(() => getByTestId('detailMerchant'));
  expect(getByTestId('detailMerchant')).not.toBeNull();
});

test('should change first name successfully', async () => {
  const { getByPlaceholderText, getByValue, getByTestId } = render(
    <Detail {...props} />
  );
  await waitForElement(() => getByTestId('detailMerchant'));
  const carTitleInput = getByPlaceholderText('First Name');
  fireEvent.change(carTitleInput, {
    target: { value: 'John' }
  });
  await waitForElement(() => getByValue('John'));
});

test('should change last name successfully', async () => {
  const { getByPlaceholderText, getByValue, getByTestId } = render(
    <Detail {...props} />
  );
  await waitForElement(() => getByTestId('detailMerchant'));
  const carTitleInput = getByPlaceholderText('Last Name');
  fireEvent.change(carTitleInput, {
    target: { value: 'Doe' }
  });
  await waitForElement(() => getByValue('Doe'));
});

test('should change email successfully', async () => {
  const { getByPlaceholderText, getByValue, getByTestId } = render(
    <Detail {...props} />
  );
  await waitForElement(() => getByTestId('detailMerchant'));
  const carTitleInput = getByPlaceholderText('Email');
  fireEvent.change(carTitleInput, {
    target: { value: 'johndoe@gmail.com' }
  });
  await waitForElement(() => getByValue('johndoe@gmail.com'));
});

afterEach(() => jest.resetModules());
