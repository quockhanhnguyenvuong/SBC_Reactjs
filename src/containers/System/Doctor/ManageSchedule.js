import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import Select from "react-select";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
// import { dateFormat } from "../../../utils";
// import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";
import { USER_ROLE } from "../../../utils";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
      dataDoctor: {},
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    let { userInfo } = this.props;
    let name = userInfo.lastName + " " + userInfo.firstName;
    // console.log(name);
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      dataSelect.map((item, index) => {
        // console.log("item", item.label);
        if (item.label === name) {
          this.setState({
            dataDoctor: item,
          });
        }
      });
      this.setState({
        listDoctors: dataSelect,
      });
      // console.log("dataselect", dataSelect);
    }
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }

  handleClickButtonTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate, dataDoctor } = this.state;
    let result = [];
    if (!currentDate) {
      toast.warn("Vui lòng chọn thòi gian!");
      return;
    }
    // if (selectedDoctor && _.isEmpty(selectedDoctor)) {
    //   toast.warn("Vui lòng chọn bác sĩ!");
    //   return;
    // }
    // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    let formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule, index) => {
          let object = {};
          // object.doctorId = selectedDoctor.value;
          object.doctorId = dataDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.warn("Vui lòng chọn mốc thời gian!");
        return;
      }
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: dataDoctor.value,
      formatedDate: formatedDate,
    });

    // console.log("check result bulk schedule doctor: ", res.arrSchedule);
    // console.log("check result schedule doctor: ", result);
    if (res && res.errCode === 0) {
      toast.success("Lưu thành công!");
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.log("error  saveBulkScheduleDoctor res:", res);
    }
  };

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = `${item.lastName} ${item.firstName}`;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleChangeSelect = async (selectOption) => {
    this.setState({ selectedDoctor: selectOption });
    console.log("check doctor", selectOption);
  };

  handleChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  render() {
    let { rangeTime } = this.state;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    console.log("check data doctor", this.state.dataDoctor);
    return (
      <div className="container manage-schedule-container">
        <div className="row">
          <div className=" title text-center col-12 mt-4">
            Quản lý lịch khám bệnh
          </div>
          {/* <div className="col-5 mt-4">
            <label>Chọn bác sĩ:</label>
            <Select
              value={this.state.selectDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder="Chọn bác sĩ..."
            />
          </div> */}

          <div className="col-4 mt-4">
            <label>Tên của tôi:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.dataDoctor.label}
              disabled
            />
          </div>

          <div className="col-6 mt-4">
            <label>Chọn thời gian :</label>
            <br />
            <DatePicker
              onChange={this.handleChangeDatePicker}
              className="form-control datePicker mx-3"
              value={this.state.currentDate}
              // minDate={new Date()}
              minDate={yesterday}
            />
          </div>
          <div className="col-12 pick-hour-container mt-4">
            {rangeTime &&
              rangeTime.length > 0 &&
              rangeTime.map((item, index) => {
                return (
                  <button
                    key={index}
                    className={
                      item.isSelected === true
                        ? "btn btn-schedule active mt-4"
                        : "btn btn-primary btn-save-schedule mt-4"
                    }
                    onClick={() => this.handleClickButtonTime(item)}
                  >
                    {item.valueVI}
                  </button>
                );
              })}
          </div>
          <div className="col-12 mt-4">
            <button
              className="btn btn-primary btn-save-schedule"
              onClick={() => this.handleSaveSchedule()}
            >
              Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
