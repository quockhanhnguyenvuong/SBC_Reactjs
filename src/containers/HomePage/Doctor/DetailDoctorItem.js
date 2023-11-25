import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailDoctorAll.scss";
import { withRouter } from "react-router";

class DetailDoctorItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  handleViewDetailDoctor = (id) => {
    if (this.props.history) {
      this.props.history.push(`/home/detail-doctor/${id}`);
    }
  };

  render() {
    let data = this.props.data;
    // let nameSpecialty = data.Doctor_Infor.Specialty.name;
    console.log("check props:", data);
    return (
      <div>
        <div className="detail-doctor-all">
          <div
            className="detail-doctor-all-container"
            onClick={() => this.handleViewDetailDoctor(data.id)}
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
              <p>
                {data.positionID === "P1"
                  ? "Bác sĩ"
                  : data.positionID === "P2"
                  ? "Thạc sĩ"
                  : data.positionID === "P3"
                  ? "Tiến sĩ"
                  : data.positionID === "P4"
                  ? "Phó giáo sư"
                  : "Giáo sư"}
                {", "}
                {data.lastName} {data.firstName}
              </p>
              <p>
                {data.Doctor_Infor && data.Doctor_Infor.Specialty
                  ? data.Doctor_Infor.Specialty.name
                  : " "}
              </p>
            </div>
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
  connect(mapStateToProps, mapDispatchToProps)(DetailDoctorItem),
);
