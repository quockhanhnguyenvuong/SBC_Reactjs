import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/Admin/UserManage";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import DoctorManage from "../containers/System/Admin/ManageDoctor";
import ManageSpecialty from "../containers/System/Specialty/ManageSpecialty";
import Header from "../containers/Header/Header";
import ManageClinic from "../containers/System/Clinic/ManageClinic";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    return (
      <div className="system-container">
        {isLoggedIn && <Header />}
        <div className="system-list">
          <Switch>
            <Route path="/system/user-manage" component={UserManage} />
            <Route path="/doctor/manage-doctor" component={DoctorManage} />
            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
            <Route
              path="/system/manage-specialty"
              component={ManageSpecialty}
            />
            <Route path="/system/manage-clinic" component={ManageClinic} />
            <Route
              component={() => {
                return <Redirect to={systemMenuPath} />;
              }}
            />
          </Switch>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(System);
