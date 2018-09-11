import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';

import Home from './Home';
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
      return resolve({
        data: [
          {
            id: 1,
            email: 'a@b.c'
          }
        ],
        count: 1
      });
    });
  });

  global.mockGetFn = getFn;

  return {
    formatRef: () => {},
    get: mockGetFn,
    remove: () => {},
    ENDPOINT: {}
  };
});

test('should render Home component successfully', () => {
  require('./index');
  const { getByTestId } = render(<Home {...props} />);
  expect(getByTestId('home')).not.toBeNull();
});

test('should refetch data successfully', () => {
  const modifiedProps = {
    ...props,
    home: {
      page: 1,
      rowsPerPage: 10,
      setHomeState: () => {}
    }
  };
  const { rerender } = render(<Home {...props} />);
  rerender(<Home {...modifiedProps} />);
  expect(global.mockGetFn).toHaveBeenCalled();
});

test('should map rows and cols successfully if isDesktop props is changed', async () => {
  const modifiedProps = {
    ...props,
    isDesktop: false
  };
  const { rerender, getByTestId } = await render(<Home {...props} />);
  rerender(<Home {...modifiedProps} />);
  expect(getByTestId('colsLength').textContent).toEqual('2');
});

test('should go to view merchant page successfully', async () => {
  const { getByTestId } = await render(<Home {...props} />);
  const viewMerchantButton = getByTestId('viewMerchant');
  fireEvent.click(viewMerchantButton);

  expect(setSelectedMerchantStateSpy).toHaveBeenCalledWith({
    id: 1,
    email: 'a@b.c'
  });
  expect(pushSpy).toHaveBeenCalledWith('/detail/1');
});

test('should go to edit merchant page successfully', async () => {
  const { getByTestId } = await render(<Home {...props} />);
  const editMerchantButton = getByTestId('editMerchant');
  fireEvent.click(editMerchantButton);

  expect(setSelectedMerchantStateSpy).toHaveBeenCalledWith({
    id: 1,
    email: 'a@b.c'
  });
  expect(pushSpy).toHaveBeenCalledWith('/edit/1');
});

test('should delete the merchant successfully', async () => {
  const { getByTestId } = await render(<Home {...props} />);
  const deleteMerchantButton = getByTestId('deleteMerchant');
  fireEvent.click(deleteMerchantButton);

  expect(setModalStateSpy).toHaveBeenCalled();
  expect(setIsOpenModalStateSpy).toHaveBeenCalledWith(true);
});

test('should go to add merchant page successfully', async () => {
  const { getByTestId } = await render(<Home {...props} />);
  const addMerchantButton = getByTestId('addMerchant');
  fireEvent.click(addMerchantButton);

  expect(pushSpy).toHaveBeenCalledWith('/add');
});

test('should change the page correctly', async () => {
  const { getByText } = await render(<Home {...props} />);
  const changePageButton = getByText('Change Page');
  fireEvent.click(changePageButton);

  expect(setHomeStateSpy).toHaveBeenCalled();
});

test('should change rows per page correctly', async () => {
  const { getByText } = await render(<Home {...props} />);
  const changeRowsPerPageButton = getByText('Change Rows Per Page');
  fireEvent.click(changeRowsPerPageButton);

  expect(setHomeStateSpy).toHaveBeenCalled();
});

afterEach(() => jest.resetModules());
