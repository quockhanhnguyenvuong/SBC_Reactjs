import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
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
  componentDidMount() {
    this.props.loadTopDoctors();
  }
  render() {
    // console.log("Check data:", this.props.topDoctorsRedux);
    let arrDoctor = this.state.arrDoctor;
    // arrDoctor = arrDoctor.concat(arrDoctor).concat(arrDoctor);
    console.log("Check data:", arrDoctor);
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
                  let nameVi = `${item.positionID}, ${item.lastName} ${item.firstName}`;
                  return (
                    <div className="section-customize" key={index}>
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstandingdoctor"
                            style={{ backgroundImage: `url(${imageBase64})` }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <div>{nameVi}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
