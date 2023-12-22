import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialtyAll.scss";
import { withRouter } from "react-router";

class SpecialtyItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  handleViewDetailSpecialty = (id) => {
    if (this.props.history) {
      this.props.history.push(`/home/detail-specialty/${id}`);
    }
  };

  render() {
    // console.log("check props:", this.props);
    let data = this.props.data;
    return (
      <div className="detail-specialty-all">
        <div
          className="detail-specialty-all-container"
          onClick={() => this.handleViewDetailSpecialty(data.id)}
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
  connect(mapStateToProps, mapDispatchToProps)(SpecialtyItem),
);
