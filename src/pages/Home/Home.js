import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Tooltip,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@material-ui/icons';

import DataTable from '../../components/DataTable';
import { formatRef, get, remove, ENDPOINT } from '../../api';
import AppContext from '../../context';
import Profile from '../../components/Profile';
import CONSTANT from '../../constant';
import '../../App.css';
import './styles.css';

const MOBILE_FIELDS = ['profile', 'actions'];
const DESKTOP_FIELDS = ['profile', 'email', 'phone', 'hasPremium', 'actions'];
const INITIAL_STATE = {
  COLS: [
    {
      id: 'profile',
      label: 'Profile'
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'phone',
      label: 'Phone No'
    },
    {
      id: 'hasPremium',
      label: 'Premium'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ]
};

class BaseHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isDesktop: this.props.isDesktop,
      home: this.props.home,
      data: [],
      rows: [],
      count: 0,
      cols: this.mappingCols(this.props.isDesktop)
    };

    this.props.setHasBackActionState(false);
    this.props.setTitleState(CONSTANT.TITLES.MERCHANTS);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.isDesktop !== prevState.isDesktop &&
      prevState.rows.length > 0
    ) {
      return {
        isDesktop: nextProps.isDesktop
      };
    }

    if (nextProps.home !== prevState.home && prevState.rows.length > 0) {
      return {
        home: nextProps.home
      };
    }

    return null;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isDesktop !== this.state.isDesktop) {
      this.setState({
        rows: this.mappingRows(this.state.data),
        cols: this.mappingCols(this.state.isDesktop),
        isDesktop: this.state.isDesktop
      });
    }

    if (prevState.home !== this.state.home) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { page, rowsPerPage } = this.state.home;
    const endpoint = formatRef(ENDPOINT.MERCHANTS);

    this.setState({
      isLoading: true
    });

    return get(endpoint, {
      _page: page + 1,
      _limit: rowsPerPage
    }).then(result => {
      this.setState({
        data: result.data,
        rows: this.mappingRows(result.data),
        cols: this.mappingCols(this.state.isDesktop),
        count: result.count,
        isLoading: false
      });
    });
  };

  mappingRows = rows => {
    return rows.map(row => {
      const mappedItem = {
        id: row.id,
        profile: (
          <div className="profile">
            <Profile url={row.avatarUrl} />{' '}
            <span className="profileName">
              {row.firstname} {row.lastname}
            </span>
          </div>
        ),
        email: <span>{row.email}</span>,
        phone: <span>{row.phone}</span>,
        hasPremium: <span>{row.hasPremium ? 'Yes' : 'No'}</span>,
        actions: (
          <span>
            <Tooltip title="View Merchant">
              <VisibilityIcon
                className="icon"
                onClick={() => this.viewMerchant(row)}
              />
            </Tooltip>
            <Tooltip title="Edit Merchant">
              <EditIcon
                className="icon"
                onClick={() => this.editMerchant(row)}
              />
            </Tooltip>
            <Tooltip title="Delete Merchant">
              <DeleteIcon
                className="icon"
                onClick={() => this.deleteMerchant(row)}
              />
            </Tooltip>
          </span>
        )
      };

      let result = {
        id: row.id
      };

      const fields = this.state.isDesktop ? DESKTOP_FIELDS : MOBILE_FIELDS;
      fields.forEach(field => {
        result[field] = mappedItem[field];
      });

      return result;
    });
  };

  mappingCols = isDesktop => {
    const fields = isDesktop ? DESKTOP_FIELDS : MOBILE_FIELDS;
    const result = fields.map(field => {
      return {
        id: field,
        label: INITIAL_STATE.COLS.find(col => col.id === field).label
      };
    });

    return result;
  };

  handleChangePage = page => {
    const { setHomeState } = this.state.home;

    return setHomeState({
      ...this.props.home,
      page
    });
  };

  handleChangeRowsPerPage = rowsPerPage => {
    const { setHomeState } = this.state.home;

    return setHomeState({
      ...this.props.home,
      rowsPerPage
    });
  };

  submitDeleteMerchant = row => {
    const { setIsOpenModalState, setNotificationState } = this.props;
    const endpoint = formatRef(ENDPOINT.MERCHANTS, row.id);

    return remove(endpoint).then(() => {
      setIsOpenModalState(false);
      setNotificationState({
        isOpen: true,
        message: 'Successfully delete merchant'
      });
      return this.fetchData();
    });
  };

  deleteMerchant = row => {
    const { setModalState, setIsOpenModalState } = this.props;

    setModalState({
      title: 'Delete Merchant',
      content: (
        <Fragment>
          <DialogContent>
            Are you sure you want to delete this merchant?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpenModalState(false)} color="primary">
              No
            </Button>
            <Button
              onClick={() => this.submitDeleteMerchant(row)}
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

  viewMerchant = row => {
    const { history, setSelectedMerchantState } = this.props;

    setSelectedMerchantState(row);
    return history.push(`/detail/${row.id}`);
  };

  editMerchant = row => {
    const { history, setSelectedMerchantState } = this.props;

    setSelectedMerchantState(row);
    return history.push(`/edit/${row.id}`);
  };

  addMerchant = () => {
    const { history } = this.props;

    return history.push('/add');
  };

  render() {
    const { home } = this.state;

    return (
      <Fragment>
        <DataTable
          {...this.state}
          {...home}
          handleChangePage={this.handleChangePage}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Tooltip title="Add Merchant">
          <Button
            variant="fab"
            color="primary"
            className="submitButton"
            onClick={this.addMerchant}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </Fragment>
    );
  }
}

export default props => {
  const { Consumer } = AppContext;

  return <Consumer>{state => <BaseHome {...props} {...state} />}</Consumer>;
};
