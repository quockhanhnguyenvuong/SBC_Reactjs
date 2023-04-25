import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../../containers/HomePage/HomeHeader";
import "./BookingHistory.scss";

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="banner-container">
        <HomeHeader />
        <div className="container">
          <div className="row">
            <div className="col-12 title mb-4">Lịch sử đặt lịch</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingHistory);
