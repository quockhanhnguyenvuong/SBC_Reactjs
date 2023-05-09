import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../HomeHeader";
import DoctorSchedule from "../../../Patient/Doctor/DoctorSchedule";
import DoctorExtraInfor from "../../../Patient/Doctor/DoctorExtraInfor.";
import ProfileDoctor from "../../../Patient/Doctor/ProfileDoctor";
class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorID: [22],
    };

    // async componentDidMount() {

    // }
  }
  render() {
    let { arrDoctorID } = this.state;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">

    
        <div className="description-specialty"></div>
        {arrDoctorID &&
          arrDoctorID.length > 0 &&
          arrDoctorID.map((item, index) => {
            return (
              <div className="each-doctor" key={index}>
                <div className="dt-content-left">
                  <div className="profile-doctor">
                  <ProfileDoctor
                  doctorId={item}
                  isShowDescriptionDoctor={true}
                  // dataTime={dataTime}
                />
                  </div>
                </div>
                <div className="dt-content-right">
                  <div className="doctor-schdule">
                    <DoctorSchedule doctorIdFromParent={item} />
                  </div>
                  <div className="doctor-extra-infor">
                    <DoctorExtraInfor doctorIdFromParent={item} />
                  </div>
                </div>
              </div>
            );
          })}
              </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
