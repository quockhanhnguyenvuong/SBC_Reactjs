import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Auth/Login";
// import Header from "./Header/Header";
import System from "../routes/System";
import HomePage from "./HomePage/HomePage.js";
import CustomScrollbars from "../components/CustomScrollbars.js";
import Doctor from "../routes/Doctor";
import DetailUser from "../Patient/User/DetailUser";
import ChangePassword from "../Patient/User/ChangePassword";
import BookingHistory from "../Patient/User//BookingHistory";
import DetailSpecialty from "./HomePage/Specialty/DetailSpecialty";
import DetailSpecialtyAll from "./HomePage/Specialty/DetailSpecialtyAll";
import DetailDoctor from "../Patient/Doctor/DetailDoctor";
import VerifyEmail from "../Patient/VerifyEmail";
import DetailClinic from "../Patient/Clinic/DetailClinic ";
import DetailClinicAll from "./HomePage/Clinic/DetailClinicAll.js";
import DetailDoctorAll from "./HomePage/Doctor/DetailDoctorAll.js";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            {this.props.isLoggedIn}

            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route
                    path={"/home/detail-user/"}
                    component={userIsAuthenticated(DetailUser)}
                  />
                  <Route
                    path={"/home/change-password/"}
                    component={userIsAuthenticated(ChangePassword)}
                  />
                  <Route
                    path={"/home/history-user/"}
                    component={userIsAuthenticated(BookingHistory)}
                  />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route
                    path={"/home/detail-specialty-all"}
                    component={DetailSpecialtyAll}
                  />
                  <Route
                    path={"/home/detail-clinic-all"}
                    component={DetailClinicAll}
                  />
                  <Route
                    path={"/home/detail-doctor-all"}
                    component={DetailDoctorAll}
                  />

                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={"/home/detail-doctor/:id"}
                    component={DetailDoctor}
                  />

                  <Route path={path.HOMEPAGE} component={HomePage} />
                </Switch>
              </CustomScrollbars>
            </div>

            {/* react-toastify */}
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
