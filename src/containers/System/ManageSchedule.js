import React, { Component } from "react";
import { connect } from "react-redux";
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="text-center">Manage schedule</div>;
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
