import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinicAll.scss";
import { withRouter } from "react-router";

class DetailClinicItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  handleViewDetailClinic = (id) => {
    if (this.props.history) {
      this.props.history.push(`/home/detail-clinic/${id}`);
    }
  };

  render() {
    // console.log("check props:", this.props);
    let data = this.props.data;
    return (
      <div className="detail-clinic-all">
        <div
          className="detail-clinic-all-container"
          onClick={() => this.handleViewDetailClinic(data.id)}
        >
          <div className="img-container">
            <div
              className="images"
              style={{
                backgroundImage: `url(${data.image})`,
              }}
            ></div>
          </div>
          <div className="contents">
            <span>{data.name}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailClinicItem),
);
