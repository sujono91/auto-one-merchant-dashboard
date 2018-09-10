import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Paper
} from '@material-ui/core';

import DataTablePagination from './DataTablePagination';
import DataTableHead from './DataTableHead';
import CONSTANT from '../../constant';
import './styles.css';

class DataTable extends PureComponent {
  handleChangePage = (event, page) => {
    event.preventDefault();
    const { handleChangePage } = this.props;
    handleChangePage(page);
  };

  handleChangeRowsPerPage = event => {
    event.preventDefault();
    const { handleChangeRowsPerPage } = this.props;
    handleChangeRowsPerPage(event.target.value);
  };

  render() {
    const {
      rows,
      cols,
      isLoading,
      rowsPerPage,
      page,
      count,
      hasPagination
    } = this.props;

    return (
      <Paper style={{ width: '100%' }}>
        <div style={{ overflowX: 'auto' }}>
          <Table aria-labelledby="tableTitle">
            <DataTableHead cols={cols} />
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={cols.length + 1}
                    style={{ textAlign: 'center' }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                rows.length > 0 &&
                rows.map((row, index) => {
                  const rowNumber = page * rowsPerPage + index + 1;
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell className="rowNumber">{rowNumber}</TableCell>
                      {cols.map(col => {
                        return (
                          <TableCell key={col.id}>{row[col.id]}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {hasPagination && (
            <DataTablePagination
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={this.handleChangePage}
              handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          )}
        </div>
      </Paper>
    );
  }
}

DataTable.propTypes = {
  rows: PropTypes.array,
  cols: PropTypes.array,
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  isLoading: PropTypes.bool,
  hasPagination: PropTypes.bool,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func
};

DataTable.defaultProps = {
  rows: [],
  cols: [],
  count: 0,
  page: 0,
  rowsPerPage: CONSTANT.ROWS_PER_PAGE,
  isLoading: false,
  hasPagination: true,
  handleChangePage: () => {},
  handleChangeRowsPerPage: () => {}
};

export default DataTable;
