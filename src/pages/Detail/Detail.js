import React, { PureComponent, Fragment } from 'react';
import Schema from 'validate';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  DialogContent,
  DialogActions,
  Input,
  InputLabel,
  Switch,
  Paper,
  Button,
  Tooltip
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Send as SendIcon
} from '@material-ui/icons';
import uniqid from 'uniqid';

import Loading from '../../components/Loading';
import DataTable from '../../components/DataTable';
import { formatRef, get, add, edit, remove, ENDPOINT } from '../../api';
import { convertNumberToCurrency, convertUtcToLocalDate } from '../../util';
import CONSTANT from '../../constant';
import ModalBid from './ModalBid';
import AppContext from '../../context';
import './styles.css';
import '../../App.css';

const TITLE = {
  detail: CONSTANT.TITLES.DETAIL,
  edit: CONSTANT.TITLES.EDIT,
  add: CONSTANT.TITLES.ADD
};

const COLS = [
  {
    id: 'carTitle',
    label: 'Car'
  },
  {
    id: 'amount',
    label: 'Amount'
  },
  {
    id: 'created',
    label: 'Created'
  },
  {
    id: 'actions',
    label: 'Actions'
  }
];

const merchantValidation = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/
  },
  phone: {
    type: String,
    required: true,
    match: /^[+]+[0-9]+$/
  }
});

class BaseDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      cols: COLS,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      avatarUrl: '',
      hasPremium: false,
      bids: '',
      bidData: [],
      orderedBidData: [],
      isLoading: false,
      isSubmit: false,
      mode: null,
      errors: []
    };

    const url = this.props.location.pathname.split('/');
    const mode = url[1];
    this.props.setNavigateState(this.props.history);
    this.props.setHasBackActionState(true);
    this.props.setTitleState(TITLE[mode]);
  }

  componentDidMount() {
    const url = this.props.location.pathname.split('/');
    const mode = url[1];

    this.setState({
      mode
    });

    if (mode !== CONSTANT.MODE.ADD) {
      const { selectedMerchant } = this.props;

      this.setState({
        isLoading: true
      });

      if (selectedMerchant) {
        return this.setState(
          {
            ...selectedMerchant
          },
          () => this.fetchBids()
        );
      }

      return this.fetchMerchant();
    }
  }

  fetchMerchant = () => {
    const url = this.props.location.pathname.split('/');
    const id = url[2];
    const endpoint = formatRef(ENDPOINT.MERCHANTS, id);

    return get(endpoint).then(result => {
      this.setState(
        {
          ...result
        },
        () => this.fetchBids()
      );
    });
  };

  fetchBids = () => {
    const endpoint = formatRef(
      ENDPOINT.MERCHANTS,
      this.state.id,
      ENDPOINT.BIDS
    );

    return get(endpoint, {
      _sort: 'created',
      _order: 'desc'
    }).then(result => {
      this.mappingCols();
      this.mappingRows(result);
    });
  };

  mappingCols = () => {
    if (this.state.mode === CONSTANT.MODE.DETAIL) {
      this.setState({
        cols: this.state.cols.filter(col => col.id !== 'actions')
      });
    }
  };

  mappingRows = rows => {
    const mappedRows = rows
      .sort(
        (prevData, nextData) =>
          new Date(nextData.created) - new Date(prevData.created)
      )
      .map(row => {
        const mappedItem = {
          id: row.id,
          merchantId: row.merchantId,
          carTitle: row.carTitle,
          amount: convertNumberToCurrency(row.amount),
          created: convertUtcToLocalDate(row.created)
        };

        if (this.state.mode !== CONSTANT.MODE.DETAIL) {
          mappedItem.actions = (
            <span>
              <EditIcon className="icon" onClick={() => this.editBid(row)} />
              <DeleteIcon
                className="icon"
                onClick={() => this.deleteBid(row)}
              />
            </span>
          );
        }

        return mappedItem;
      });

    this.setState({
      bidData: rows,
      orderedBidData: mappedRows,
      isLoading: false
    });
  };

  editBid = row => {
    const { bidData } = this.state;
    const { setModalState, setIsOpenModalState } = this.props;

    setModalState({
      title: 'Edit Bid',
      content: (
        <ModalBid
          isEdit={true}
          {...bidData.find(bid => bid.id === row.id)}
          setIsOpenModalState={setIsOpenModalState}
          setBid={this.setBid}
        />
      )
    });

    return setIsOpenModalState(true);
  };

  addBid = () => {
    const { id } = this.state;
    const { setModalState, setIsOpenModalState } = this.props;

    setModalState({
      title: 'Add Bid',
      content: (
        <ModalBid
          isEdit={false}
          merchantId={id}
          setIsOpenModalState={setIsOpenModalState}
          setBid={this.setBid}
        />
      )
    });

    return setIsOpenModalState(true);
  };

  deleteBid = row => {
    const { setModalState, setIsOpenModalState } = this.props;

    setModalState({
      title: 'Delete Bid',
      content: (
        <Fragment>
          <DialogContent>
            Are you sure you want to delete this bid?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpenModalState(false)} color="primary">
              No
            </Button>
            <Button
              onClick={() => this.submitDeleteBid(row)}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Fragment>
      )
    });

    return setIsOpenModalState(true);
  };

  submitDeleteBid = row => {
    const { setIsOpenModalState } = this.props;
    const { id } = this.state;

    if (id) {
      const endpoint = formatRef(ENDPOINT.BIDS, row.id);

      return remove(endpoint).then(() => {
        this.setBid(row, CONSTANT.MODE.DELETE);
        return setIsOpenModalState(false);
      });
    }

    this.setBid(row, CONSTANT.MODE.DELETE);
    return setIsOpenModalState(false);
  };

  setBid = (bid, mode) => {
    const { bidData } = this.state;
    const { setNotificationState } = this.props;
    let rows;

    switch (mode) {
      case CONSTANT.MODE.DELETE:
        rows = bidData.filter(data => data.id !== bid.id);
        setNotificationState({
          isOpen: true,
          message: 'Successfully delete bid'
        });
        break;
      case CONSTANT.MODE.ADD:
        rows = [...bidData, bid];
        setNotificationState({
          isOpen: true,
          message: 'Successfully add new bid'
        });
        break;
      default:
        rows = bidData.map(data => {
          if (data.id === bid.id) {
            return bid;
          }

          return data;
        });
        setNotificationState({
          isOpen: true,
          message: 'Successfully edit bid'
        });
        break;
    }

    return this.mappingRows(rows);
  };

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
      const isEdit = this.state.mode === CONSTANT.MODE.EDIT;
      const {
        id,
        lastname,
        email,
        firstname,
        phone,
        hasPremium,
        bids,
        bidData
      } = this.state;

      const newId = uniqid();
      const data = {
        id: isEdit ? id : newId,
        firstname,
        lastname,
        avatarUrl: 'http://placehold.it/32x32',
        email,
        phone,
        hasPremium,
        bids: isEdit ? bids : `/merchants/${newId}/bids`
      };

      const endpoint = isEdit
        ? formatRef(ENDPOINT.MERCHANTS, id)
        : formatRef(ENDPOINT.MERCHANTS);

      let promises = isEdit ? [edit(endpoint, data)] : [add(endpoint, data)];

      if (!isEdit) {
        const bidEndpoint = formatRef(ENDPOINT.BIDS);
        const bidPromises = bidData.map(bid => {
          return add(bidEndpoint, {
            ...bid,
            merchantId: newId
          });
        });

        promises = [...promises, ...bidPromises];
      }

      return Promise.all(promises).then(() => {
        const { setNotificationState, history } = this.props;

        setNotificationState({
          isOpen: true,
          message: `Successfully ${this.state.mode} bid`
        });

        return history.push('/');
      });
    }
  };

  checkErrors = () => {
    const { firstname, lastname, email, phone, bidData } = this.state;

    const checkObj = {
      firstname,
      lastname,
      email,
      phone,
      bids: bidData.map(({ carTitle, amount }) => {
        return {
          carTitle,
          amount
        };
      })
    };

    return merchantValidation.validate(checkObj);
  };

  checkValidity = key => {
    const { isSubmit } = this.state;
    const errors = this.checkErrors();
    const isError = isSubmit && errors.find(error => error.path === key);

    return !!isError;
  };

  render() {
    const {
      firstname,
      lastname,
      email,
      phone,
      hasPremium,
      isLoading,
      orderedBidData,
      mode,
      cols
    } = this.state;

    const validity = {
      firstname: this.checkValidity('firstname'),
      lastname: this.checkValidity('lastname'),
      email: this.checkValidity('email'),
      phone: this.checkValidity('phone')
    };

    return (
      <Fragment>
        {isLoading && <Loading />}
        {!isLoading && (
          <Fragment>
            <div className="clear" />
            <Paper className="inputPaper">
              <br />
              <div className="inputField">
                <FormControl error={validity.firstname} className="formControl">
                  <InputLabel htmlFor="firstname">First Name</InputLabel>
                  <Input
                    className="input"
                    id="firstname"
                    disabled={mode === CONSTANT.MODE.DETAIL}
                    value={firstname}
                    onChange={event =>
                      this.handleChangeInput(event, 'firstname')
                    }
                  />
                  {validity.firstname && (
                    <FormHelperText>First name is required</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputField">
                <FormControl error={validity.lastname} className="formControl">
                  <InputLabel htmlFor="lastname">Last Name</InputLabel>
                  <Input
                    className="input"
                    id="lastname"
                    disabled={mode === CONSTANT.MODE.DETAIL}
                    value={lastname}
                    onChange={event =>
                      this.handleChangeInput(event, 'lastname')
                    }
                  />
                  {validity.lastname && (
                    <FormHelperText>Last name is required</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputField">
                <FormControl error={validity.email} className="formControl">
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    className="input"
                    id="email"
                    disabled={mode === CONSTANT.MODE.DETAIL}
                    value={email}
                    onChange={event => this.handleChangeInput(event, 'email')}
                  />
                  {validity.email && (
                    <FormHelperText>Invalid email value</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputField">
                <FormControl error={validity.phone} className="formControl">
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <Input
                    className="input"
                    id="phone"
                    disabled={mode === CONSTANT.MODE.DETAIL}
                    value={phone}
                    onChange={event => this.handleChangeInput(event, 'phone')}
                  />
                  {validity.phone && (
                    <FormHelperText>Invalid phone value</FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputField" style={{ textAlign: 'left' }}>
                <FormLabel>Premium</FormLabel>
                <Switch
                  checked={hasPremium}
                  disabled={mode === CONSTANT.MODE.DETAIL}
                  onChange={() =>
                    this.setState({ hasPremium: !this.state.hasPremium })
                  }
                />
              </div>
            </Paper>
            <br />
            <div className="bidsContainer">
              {orderedBidData.length > 0 && (
                <DataTable
                  rows={orderedBidData}
                  cols={cols}
                  hasPagination={false}
                />
              )}
              {mode !== CONSTANT.MODE.DETAIL && (
                <Button
                  variant="contained"
                  color="primary"
                  className="addBidButton"
                  onClick={this.addBid}
                >
                  Add Bid
                </Button>
              )}
            </div>
            {mode !== CONSTANT.MODE.DETAIL && (
              <Tooltip title="Submit">
                <Button
                  variant="fab"
                  color="primary"
                  className="submitButton"
                  onClick={this.handleSubmit}
                >
                  <SendIcon />
                </Button>
              </Tooltip>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default props => {
  const { Consumer } = AppContext;

  return <Consumer>{state => <BaseDetail {...props} {...state} />}</Consumer>;
};
