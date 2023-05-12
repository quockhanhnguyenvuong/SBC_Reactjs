import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctor: this.props.topDoctorsRedux,
      });
    }
  }

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/home/detail-doctor/${doctor.id}`);
    }
  };

  componentDidMount() {
    this.props.loadTopDoctors();
  }
  render() {
    console.log("Check data bác sĩ nổi bật", this.props.topDoctorsRedux);
    let arrDoctor = this.state.arrDoctor;
    // arrDoctor = arrDoctor.concat(arrDoctor).concat(arrDoctor);
    console.log("Check data bac sĩ nổi bật tuần qua:", arrDoctor);
    return (
      <div className="section-share section-outstandingdoctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctor &&
                arrDoctor.length > 0 &&
                arrDoctor.map((item, index) => {
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base").toString(
                      "binary",
                    );
                  }

                  let nameVi = `, ${item.lastName} ${item.firstName}`;
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstandingdoctor"
                            style={{ backgroundImage: `url(${imageBase64})` }}
                          ></div>
                        </div>

                        <div className="position">
                          <span>
                            {item.positionID === "P0"
                              ? "Bác sĩ"
                              : item.positionID === "P1"
                              ? "Thạc sĩ"
                              : item.positionID === "P2"
                              ? "Tiến sĩ"
                              : item.positionID === "P3"
                              ? "Phó giáo sư"
                              : "Giáo sư"}
                          </span>
                          <span>{nameVi}</span>
                          <div>Cơ xương khớp</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctors()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor),
);