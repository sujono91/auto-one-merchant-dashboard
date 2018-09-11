import React from 'react';
import { render, cleanup } from 'react-testing-library';

import DataTablePagination from './DataTablePagination';

afterEach(cleanup);

const props = {
  count: 10,
  rowsPerPage: 5,
  page: 0,
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {}
};

test('render pagination successfully', () => {
  const { getByTestId } = render(<DataTablePagination {...props} />);
  expect(getByTestId('pagination')).not.toBeNull();
});
