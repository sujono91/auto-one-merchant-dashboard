import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell } from '@material-ui/core';
import './styles.css';

const DataTableHead = ({ cols }) => {
  return (
    <TableHead data-testid="tableHead">
      <TableRow>
        <TableCell className="rowNumber">#</TableCell>
        {cols.map(col => {
          return <TableCell key={col.id}>{col.label}</TableCell>;
        })}
      </TableRow>
    </TableHead>
  );
};

DataTableHead.propTypes = {
  cols: PropTypes.array.isRequired
};

export default DataTableHead;
