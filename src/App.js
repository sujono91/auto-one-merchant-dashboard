import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Notification from './components/Notification';
import CONSTANT from './constant';
import Modal from './components/Modal';
import Loading from './components/Loading';
import AppContext from './context';
import './App.css';

const INITIAL_STATE = {
  notification: {
    isOpen: false,
    message: ''
  },
  modal: {
    title: '',
    content: ''
  },
  isOpenModal: false
};

const LoadableDetail = Loadable({
  loader: () => import('./pages/Detail'),
  loading: Loading
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notification: INITIAL_STATE.notification,
      setNotificationState: notification =>
        this.setNotificationState(notification),
      home: {
        page: 0,
        rowsPerPage: CONSTANT.ROWS_PER_PAGE,
        setHomeState: home => this.setState({ home })
      },
      modal: INITIAL_STATE.modal,
      isOpenModal: INITIAL_STATE.isOpenModal,
      setModalState: modal => this.setState({ modal }),
      setIsOpenModalState: isOpenModal => this.setState({ isOpenModal }),
      title: '',
      setTitleState: title => this.setState({ title }),
      isDesktop: window.innerWidth >= CONSTANT.SCREEN_WIDTH.DESKTOP,
      selectedMerchant: null,
      setSelectedMerchantState: selectedMerchant =>
        this.setState({ selectedMerchant }),
      hasBackAction: false,
      backURL: '/',
      navigate: null,
      setHasBackActionState: hasBackAction => this.setState({ hasBackAction }),
      setNavigateState: navigate => this.setState({ navigate })
    };
  }

  componentDidCatch() {
    this.setNotificationState({
      isOpen: true,
      message: 'Error occured. Please try again later'
    });
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        isDesktop: window.innerWidth >= CONSTANT.SCREEN_WIDTH.DESKTOP
      });
    });
  }

  handleClose = () => {
    this.setNotificationState(INITIAL_STATE.notification);
  };

  setNotificationState = notification => {
    this.setState({ notification });
  };

  render() {
    const {
      notification,
      title,
      modal,
      isOpenModal,
      hasBackAction,
      backURL,
      navigate
    } = this.state;
    const { Provider } = AppContext;

    return (
      <Provider value={this.state}>
        <div className="App">
          <NavBar
            title={title}
            hasBackAction={hasBackAction}
            backUrl={backURL}
            navigate={navigate}
          />
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/add" component={LoadableDetail} />
              <Route path="/detail/:rowId" component={LoadableDetail} />
              <Route path="/edit/:rowId" component={LoadableDetail} />
            </div>
          </Router>
          <Notification {...notification} handleClose={this.handleClose} />
          <Modal {...modal} isOpenModal={isOpenModal} />
        </div>
      </Provider>
    );
  }
}

export default App;
