import React, { Component } from "react";
import "./DoctorSchedule.scss";
import { connect } from "react-redux";
import moment from "moment";
// import localization from "moment/locale/vi";
import { getscheduleDoctorByDate } from "../../services/userService";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      allDays: [],
      allAvalableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async componentDidMount() {
    this.getArrDays();
    // if(this.props.doctorIdFromParent){
    //   let res = await getscheduleDoctorByDate(
    //     this.props.doctorIdFromParent,
    //     this.state.allDays[0].value,
    //   );
    //   this.setState({
    //     allAvalableTime: res.data ? res.data : [],
    //   });
    // }
    // this.setState({
    //   allDays: allDays,
    // })
   
  }

  getArrDays = () => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};

      let labelVi = moment(new Date()).add(i, "days").format("dddd - DD/MM");
      object.label = this.capitalizeFirstLetter(labelVi);
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      allDays.push(object);
    }
    // return allDays;
    this.setState({
      allDays: allDays,
    });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getscheduleDoctorByDate(
        this.props.doctorIdFromParent,
        this.state.allDays[0].value,
      );
      this.setState({
        allAvalableTime: res.data ? res.data : [],
      });
    }
  }

  //bấm select thay đổi
  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      // check lại có chạy thành công kh
      let res = await getscheduleDoctorByDate(doctorId, date);
      if (res && res.errCode === 0) {
        this.setState({
          allAvalableTime: res.data ? res.data : [],
        });
      }
      // console.log("check res schedule from react: ", res);
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let {
      allDays,
      allAvalableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;

    // console.log("check allAvalableTime", dataScheduleTimeModal);
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i class="fas fa-calendar-alt">
                <span>Lịch khám</span>
              </i>
            </div>
            <div className="time-content">
              {allAvalableTime && allAvalableTime.length > 0 ? (
                <React.Fragment>
                  <div className="time-content-btns">
                    {allAvalableTime.map((item, index) => {
                      let timeDisplay = item.timeTypeData.valueVI;
                      // let timeDisplay = language = LANGUAGES.VI ?
                      //     item.timeTypeData.valueVI : item.timeTypeData.valueEn;
                      return (
                        <button
                          key={index}
                          /*className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}*/
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>

                  <div className="book-free">
                    <span>
                      Chọn <i className="far fa-hand-point-up"></i> và đặt (miễn
                      phí)
                    </span>
                  </div>
                </React.Fragment>
              ) : (
                <div>
                  Hiện tại bác sĩ không có lịch hẹn trong thời gian này, vui
                  lòng chọn thời gian khác!
                </div>
              )}
            </div>
          </div>
        </div>

        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingClose={this.closeBookingClose}
          dataTime={dataScheduleTimeModal}
          type={"Schedule"}
          title={"Thông tin đặt lịch khám bệnh trực tuyến "}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapDispatchToProps)(DoctorSchedule);