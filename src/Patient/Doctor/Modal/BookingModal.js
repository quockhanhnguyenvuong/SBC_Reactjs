import React, { Component } from "react";
import "./BookingModal.scss";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import * as actions from "../../../store/actions";
import { postPatientBookAppointment } from "../../../services/userService";
import Select from "react-select";
import { toast } from "react-toastify";
import { getAllCodeService } from "../../../services/userService";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      gender: "",
      genderArr: [],
      timeType: "",
    };
  }

  async componentDidMount() {
    await this.getGenderFormReact();

    let genderArr = this.state.genderArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].key : "",
    });
  }

  getGenderFormReact = async () => {
    let response = await getAllCodeService("gender");
    if (response && response.errCode === 0) {
      this.setState({
        genderArr: response.data,
      });
    }
  };

  buildDataGender = (data) => {
    let result = [];

    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = item.valueVi;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        console.log("check datetime: ", this.props.dataTime);
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state }; //3 dấu ... là copy lại tên biến cần copy
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  // handleChangeSelect = (selectedOption) =>{
  //     this.setState({selectedGender: selectedOption });
  // }
  onChangInput = (event) => {
    let copyState = { ...this.state };
    copyState = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleConfirmBooking = async () => {
    // validate input
    // data.email || !data.doctorId || !data.timeTypeData || !data.date
    let date = new Date(this.state.birthday).getTime();
    let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      // genders: this.state.genders,
    });

    if (res && res.errCode === 0) {
      toast.success("Booking a new appointment succeed!");
      this.props.closeBookingClose();
    } else {
      toast.error("Booking a new appointment error!");
    }
  };

  render() {
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    let genders = this.state.genderArr;
    console.log("genders: ", genders);
    let doctorId = " ";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }

    return (
      <Modal
        isOpen={isOpenModal}
        className="'booking-modal-container"
        size="lg"
        centered
        // backdrop={true}
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">Thông tin đặt lịch khám bệnh</span>
            <span className="right" onClick={closeBookingClose}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            {/* {JSON.stringify(dataTime)} */}
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
              />
            </div>
            <div className="row">
              <div className="col-6 form-group">
                <label>Họ và tên</label>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "fullName")
                  }
                />
              </div>
              <div className="col-6 form-group">
                <label>Số điện thoại</label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "phoneNumber")
                  }
                />
              </div>
              <div className="col-6 form-group">
                <label>Địa chỉ Email</label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => this.handleOnchangeInput(event, "email")}
                />
              </div>
              <div className="col-6 form-group">
                <label>Địa chỉ liên hệ</label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "address")
                  }
                />
              </div>

              <div className="col-12 form-group">
                <label>Lý do khám</label>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "reason")
                  }
                />
              </div>

              <div className="col-6 form-group">
                <label>Ngày sinh</label>
                <DatePicker
                  onChange={this.handleOnchangeDatePicker}
                  className="form-control"
                  value={this.state.birthday}
                />
              </div>
              <div className="col-6 form-group">
                <label>Giới tính </label>
                <Select
                  className="form"
                  value={genders}
                  options={genders}
                  onChange={(event) => {
                    this.onChangInput(event, "genders");
                  }}
                >
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option selected key={index} value={item.key}>
                          {item.valueVI}
                        </option>
                      );
                    })}
                </Select>
              </div>
            </div>
          </div>

          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              Xác nhận
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingClose}>
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // gender: state.admin.gender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getGender: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
