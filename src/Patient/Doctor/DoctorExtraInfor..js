import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorById } from "../../../src/services/userService";
import BookingModal from "./Modal/BookingModal";

class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      extraInfor: {},
      isOpenModalBooking: false,
    };
  }
  async componentDidMount() {
    let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
    if (res && res.errCode === 0) {
      this.setState({
        extraInfor: res.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }

  showHideDetailInfor = (status) => {
    this.setState({
      isShowDetailInfor: status,
    });
  };

  handleClickBooking = () => {
    this.setState({
      isOpenModalBooking: true,
    });
  };

  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  render() {
    let { isShowDetailInfor, extraInfor } = this.state;
    // console.log("check data:", extraInfor);
    // console.log("doctor id:", this.props.doctorIdFromParent);
    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="text-address">
            Đặt khám tại nhà <i className="far fa-hand-point-right"></i>{" "}
            <button
              className="btn btn-booking-at-home"
              onClick={() => this.handleClickBooking()}
            >
              Tại đây{" "}
            </button>
          </div>
          <div className="name-clinic">
            {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
          </div>
          <div className="detail-address">
            {extraInfor && extraInfor.addressClinic
              ? extraInfor.addressClinic
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfor === false && (
            <div className="short-infor">
              <div className="title-price">Giá khám:</div>
              <span onClick={() => this.showHideDetailInfor(true)}>
                Xem chi tiết
              </span>
            </div>
          )}

          {isShowDetailInfor === true && (
            <>
              <div className="detail-infor">
                {/* price online */}
                <div className="price">
                  <span className="left">Giá khám trực tuyến: </span>
                  <span className="right">
                    {extraInfor && extraInfor.priceOnId
                      ? extraInfor.priceOnId
                      : ""}
                  </span>
                </div>
                <div className="note">
                  {extraInfor && extraInfor.note ? extraInfor.note : ""}
                </div>
                {/* price at home */}
                <div className="price">
                  <span className="left">Giá khám tại nhà: </span>
                  <span className="right">
                    {extraInfor && extraInfor.priceOffId
                      ? extraInfor.priceOffId
                      : ""}
                  </span>
                </div>
                <div className="note">
                  {extraInfor && extraInfor.note ? extraInfor.note : ""}
                </div>
              </div>
              <div className="payment">
                {extraInfor && extraInfor.paymentTypeData
                  ? extraInfor.paymentTypeData.valueVI
                  : ""}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfor(false)}>
                  Ẩn bảng giá
                </span>
              </div>
            </>
          )}
        </div>
        <BookingModal
          isOpenModal={this.state.isOpenModalBooking}
          closeBookingClose={this.closeBookingClose}
          doctorIdFromParent={this.props.doctorIdFromParent}
          type={"ATHOME"}
          title={"Thông tin đặt lịch khám bệnh tại nhà"}
        />
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
export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
