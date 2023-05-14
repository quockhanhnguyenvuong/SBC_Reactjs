import React, { Component } from "react";
import { connect } from "react-redux";
import {  Route, Switch } from "react-router-dom";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import DetailDoctor from "../Patient/Doctor/DetailDoctor";
import ManagePatient from "../containers/System/Doctor/ManagePatient";

class Home extends Component {
  render() {
    const { isLoggedIn } = this.props;

    return (
      <React.Fragment>
        {isLoggedIn}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route
                path="/doctor/manage-schedule"
                component={ManageSchedule}
              />
              <Route path="/doctor/manage-patient" component={ManagePatient} />

              <Route
                path="/doctor/detail-doctor"
                component={DetailDoctor}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
