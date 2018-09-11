import React from 'react';
import { render, cleanup } from 'react-testing-library';

import DataTableHead from './DataTableHead';

afterEach(cleanup);

const props = {
  cols: [
    {
      id: 'no',
      label: 'no'
    }
  ]
};

test('render table head successfully', () => {
  const { getByTestId } = render(<DataTableHead {...props} />);
  expect(getByTestId('tableHead')).not.toBeNull();
});
