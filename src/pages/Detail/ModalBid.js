import React, { Fragment, PureComponent } from 'react';
import Schema from 'validate';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Button,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import uniqid from 'uniqid';

import CONSTANT from '../../constant';
import { formatRef, ENDPOINT, edit, add } from '../../api';
import './styles.css';

const testAmount = amount => {
  if (isNaN(amount) || amount < 1) {
    return false;
  }

  return true;
};

const bidValidation = new Schema({
  carTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    use: {
      testAmount
    }
  }
});

class ModalBid extends PureComponent {
  constructor(props) {
    super(props);

    const { carTitle, amount, id, merchantId, created } = this.props;
    this.state = {
      id,
      merchantId,
      carTitle,
      amount,
      created,
      isSubmit: false,
      errors: []
    };
  }

  handleChangeInput = (event, type) => {
    event.preventDefault();
    this.setState({
      [type]: event.target.value
    });
  };

  handleSubmit = () => {
    this.setState({
      isSubmit: true
    });

    const errors = this.checkErrors();

    this.setState({
      errors
    });

    if (errors.length === 0) {
      if (this.props.isEdit) {
        return this.editBid();
      }

      return this.addBid();
    }
  };

  checkErrors = () => {
    const { carTitle, amount } = this.state;

    const checkObj = {
      carTitle,
      amount: parseInt(amount, 10)
    };

    return bidValidation.validate(checkObj);
  };

  checkValidity = key => {
    const { isSubmit } = this.state;
    const errors = this.checkErrors();
    const isError = isSubmit && errors.find(error => error.path === key);

    return !!isError;
  };

  editBid = () => {
    const { id, merchantId, carTitle, amount, created } = this.state;
    const endpoint = formatRef(ENDPOINT.BIDS, id);
    const bid = {
      id,
      merchantId,
      carTitle,
      amount: parseInt(amount, 10),
      created
    };

    return edit(endpoint, bid).then(() => {
      const { setBid, setIsOpenModalState } = this.props;

      setIsOpenModalState(false);
      return setBid(bid, CONSTANT.MODE.EDIT);
    });
  };

  addBid = () => {
    const { merchantId, carTitle, amount } = this.state;
    const endpoint = formatRef(ENDPOINT.BIDS);
    const bid = {
      id: uniqid(),
      merchantId,
      carTitle,
      amount: parseInt(amount, 10),
      created: new Date().toUTCString()
    };

    return add(endpoint, bid).then(() => {
      const { setBid, setIsOpenModalState } = this.props;

      setIsOpenModalState(false);
      return setBid(bid, CONSTANT.MODE.ADD);
    });
  };

  render() {
    const { carTitle, amount } = this.state;
    const { setIsOpenModalState } = this.props;

    const validity = {
      carTitle: this.checkValidity('carTitle'),
      amount: this.checkValidity('amount')
    };

    return (
      <Fragment>
        <DialogContent>
          <div className="inputField">
            <FormControl error={validity.carTitle} className="formControl">
              <InputLabel htmlFor="carTitle">Car</InputLabel>
              <Input
                className="input"
                id="carTitle"
                value={carTitle}
                onChange={event => this.handleChangeInput(event, 'carTitle')}
              />
              {validity.carTitle && (
                <FormHelperText>Car is required</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="inputField">
            <FormControl error={validity.amount} className="formControl">
              <InputLabel htmlFor="amount">Amount ($)</InputLabel>
              <Input
                type="number"
                className="input"
                id="amount"
                value={amount}
                onChange={event => this.handleChangeInput(event, 'amount')}
              />
              {validity.amount && (
                <FormHelperText>Invalid amount value</FormHelperText>
              )}
            </FormControl>
          </div>
          <DialogActions>
            <Button onClick={() => setIsOpenModalState(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.handleSubmit()}
              color="primary"
              autoFocus
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Fragment>
    );
  }
}

export default ModalBid;
