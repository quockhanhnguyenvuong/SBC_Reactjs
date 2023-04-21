import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import Select from "react-select";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import { dateFormat } from "../../../utils";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
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
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];
    if (!currentDate) {
      toast.error("invalid date!");
      return;
    }
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("invalid selected doctor!");
      return;
    }
    // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    let formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule, index) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });

    console.log("check result bulk schedule doctor: ", res.arrSchedule);
    console.log("check result schedule doctor: ", result);
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
  };

  handleChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  render() {
    let { rangeTime } = this.state;

    return (
      <div className="container manage-schedule-container">
        <div className="row">
          <div className=" title text-center col-12 mt-4">
            Quản lý lịch khám bệnh
          </div>
          ;
          <div className="col-6 mt-4 ">
            <label>Chọn bác sĩ:</label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
            />
          </div>
          <div className="col-5 mt-4">
            <label>Chọn thời gian :</label>
            <br />
            <DatePicker
              onChange={this.handleChangeDatePicker}
              className="form-group datePicker mx-3"
              value={this.state.currentDate}
              minDate={new Date()}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
