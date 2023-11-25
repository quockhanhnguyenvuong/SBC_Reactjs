import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../containers/HomePage/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../services/userService";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor.";
import Map from "../Map/Map";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let infor = this.state.detailDoctor;
    console.log("check data:", infor);
    let { detailDoctor } = this.state;
    let nameVi = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }
    return (
      <>
        <HomeHeader />
        <div className="doctor-detail-container container">
          <div className="row">
            <div className="intro-doctor col-12 mt-4 ">
              <div
                className="content-left"
                style={{
                  backgroundImage: `url(${
                    detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                  })`,
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="content-right">
                <div className="up">{nameVi}</div>
                <div className="down">
                  {detailDoctor &&
                    detailDoctor.Markdown &&
                    detailDoctor.Markdown.description && (
                      <span>{detailDoctor.Markdown.description}</span>
                    )}
                </div>
              </div>
            </div>
            <div className="schedule-doctor col-9">
              <div className="content-left">
                <DoctorSchedule
                  doctorIdFromParent={detailDoctor.id}
                  userInfo={this.props.userInfo}
                />
              </div>
              <div className="content-right">
                <DoctorExtraInfor
                  doctorIdFromParent={this.state.currentDoctorId}
                  userInfo={this.state.detailDoctor}
                />
              </div>
            </div>
            <div className="col-3">
              <Map
                address={
                  detailDoctor &&
                  detailDoctor.Doctor_Infor &&
                  detailDoctor.Doctor_Infor.Clinic.address
                    ? detailDoctor.Doctor_Infor.Clinic.address
                    : ""
                }
              />
            </div>
            <div className="detail-info-doctor col-12">
              {detailDoctor &&
                detailDoctor.Markdown &&
                detailDoctor.Markdown.contentHTML && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detailDoctor.Markdown.contentHTML,
                    }}
                  ></div>
                )}
            </div>
            <div className="comment-doctor col-12"></div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return { userInfo: state.user.userInfo };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
