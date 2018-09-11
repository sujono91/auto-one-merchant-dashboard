import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';

import DataTable from './DataTable';
import CONSTANT from '../../constant';

afterEach(cleanup);

const props = {
  rows: [
    {
      id: 1,
      firstname: 'abc'
    }
  ],
  cols: [
    {
      id: 'firstname',
      label: 'firstname'
    }
  ],
  count: 1,
  page: 0,
  rowsPerPage: CONSTANT.ROWS_PER_PAGE,
  isLoading: true,
  hasPagination: true,
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {}
};

jest.spyOn(props, 'handleChangePage');
jest.spyOn(props, 'handleChangeRowsPerPage');
const mockChangePageFn = jest.fn(props);
const mockChangeRowsPerPageFn = jest.fn(props);
const changePagePreventDefaultSpy = jest.fn();
const changeRowsPerPagePreventDefaultSpy = jest.fn();

mockChangePageFn.mockImplementation(props => {
  return props.handleChangePage(
    {
      preventDefault: changePagePreventDefaultSpy
    },
    0
  );
});

mockChangeRowsPerPageFn.mockImplementation(props => {
  return props.handleChangeRowsPerPage({
    preventDefault: changeRowsPerPagePreventDefaultSpy,
    target: {
      value: 10
    }
  });
});

jest.mock('./DataTablePagination', () => {
  return props => (
    <div>
      <button onClick={() => mockChangePageFn(props)}>Change Page</button>
      <button onClick={() => mockChangeRowsPerPageFn(props)}>
        Change Rows Per Page
      </button>
    </div>
  );
});

test('render table with circular progress successfully', () => {
  require('./index');
  const { getByTestId } = render(<DataTable {...props} />);
  expect(getByTestId('table')).not.toBeNull();
  expect(getByTestId('loading')).not.toBeNull();
});

test('render table with data successfully', () => {
  const modifiedProps = {
    ...props,
    isLoading: false
  };
  const { getByTestId, getAllByTestId } = render(
    <DataTable {...modifiedProps} />
  );
  expect(getByTestId('table')).not.toBeNull();
  expect(getAllByTestId('row').length).toEqual(1);
});

test('should change page correctly', () => {
  const { getByText } = render(<DataTable {...props} />);
  const changePageButton = getByText('Change Page');
  fireEvent.click(changePageButton);

  expect(changePagePreventDefaultSpy).toHaveBeenCalled();
  expect(props.handleChangePage).toHaveBeenCalledWith(0);
});

test('should change page correctly without prevent default', () => {
  mockChangePageFn.mockImplementation(props => {
    return props.handleChangePage(null, 0);
  });

  const { getByText } = render(<DataTable {...props} />);
  const changePageButton = getByText('Change Page');
  fireEvent.click(changePageButton);

  expect(props.handleChangePage).toHaveBeenCalledWith(0);
});

test('should change rows per page correctly', () => {
  const { getByText } = render(<DataTable {...props} />);
  const changeRowsPerPageButton = getByText('Change Rows Per Page');
  fireEvent.click(changeRowsPerPageButton);

  expect(changeRowsPerPagePreventDefaultSpy).toHaveBeenCalled();
  expect(props.handleChangeRowsPerPage).toHaveBeenCalledWith(10);
});

test('should change rows per page correctly without prevent default', () => {
  mockChangeRowsPerPageFn.mockImplementation(props => {
    return props.handleChangeRowsPerPage(null, 0);
  });

  const { getByText } = render(<DataTable {...props} />);
  const changeRowsPerPageButton = getByText('Change Rows Per Page');
  fireEvent.click(changeRowsPerPageButton);

  expect(props.handleChangeRowsPerPage).toHaveBeenCalledWith(10);
});

afterEach(() => jest.resetModules());
