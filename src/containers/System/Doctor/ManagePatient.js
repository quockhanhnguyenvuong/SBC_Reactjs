import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  postSendRefuse,
  getConfirm,
  getListPatientOnline,
  getCancel,
  postSendWarning
} from "../../../services/userService";
import _ from "lodash";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import WarningModal from "./WarningModal";
import RefuseModal from "./RefuseModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

export class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: {},
      isOpenRemedyModal: false,
      isOpenRefuseModal: false,
      isOpenWarningModal: false,
      dataModal: {},
      isShowLoading: false,
      arrayPatientS3: [],
      dataPatientBookOnline: [],
      date: "",
      isDisable: true,
    };
  }

  async componentDidMount() {
    this.getDataPatient();
    this.getDataPatientS3();
    let { user } = this.props;
    console.log(this.props)

  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let date = moment.unix(+formattedDate / 1000).format("dddd - DD/MM/YYYY");
    console.log("date", date);
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    let arrTempOnline = [];
    let arr = res.data;
    let countOnline = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].bookingType === "ONLINE")
        if (arr[i].statusId === "S2" || arr[i].statusId === "S3")
          arrTempOnline[countOnline++] = arr[i];
    }

    // console.log("check arr ", res.data);
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
        dataPatientBookOnline: arrTempOnline,
        date: date,
      });
    }
  };
  getDataPatientS3 = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let date = moment.unix(+formattedDate / 1000).format("dddd - DD/MM/YYYY");
    let res = await getListPatientOnline({
      doctorId: user.id,
      date: formattedDate
    });
    let arrS3 = [];
    let arr = res.data;
    console.log("echk", arr)
    let countS3 = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].bookingType === "ONLINE")
        if (arr[i].statusId === "S3")
          arrS3[countS3++] = arr[i];
    }

    // console.log("check arr ", res.data);
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
        arrayPatientS3: arrS3,
        date: date
      });
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) { }

  handleChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
        await this.getDataPatientS3();
      },
    );
  };

  handleBtnConfirmOn = (item) => {
    // console.log(">>> Check item: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      timeTypeDataPatient: item.timeTypeDataPatient.valueVI,
      patientName: item.patientData.lastName + " " + item.patientData.firstName,
      bookingType: "ONLINE",
      date: this.state.date,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
    // console.log(">>> Check data: ", data);
  };
  // buildTimeBooking = (dataTime) => {
  //   // console.log("check renderTimeBooking: ", dataTime);
  //   if (dataTime && !_.isEmpty(dataTime)) {
  //     let time = dataTime.timeTypeData.valueVI;

  //     let date = moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY");
  //     return `${time} - ${this.capitalizeFirstLetter(date)}`;
  //   }
  //   return "";
  // };

  buildDoctorName = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let name = `${dataTime.lastName} ${dataTime.firstName}`;
      return name;
    }
    return "";
  };
  //fix
  handleBtnRefuse = (item) => {
    // console.log(">>> Check item: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeTypeDataPatient,
      patientName: item.patientData.firstName + " " + item.patientData.lastName,
      reason: "",
    };
    this.setState({
      isOpenRefuseModal: true,
      dataModal: data,
    });
    // console.log(">>> Check data: ", data);
  };
  handleBtnWarning = (item) => {
    // console.log(">>> Check item: ", item);
    // let doctorName = this.buildDoctorName(this.props.dataTime.doctorData);
    let data = {
      doctorId: item.doctorId,
      doctorName: item.doctorName,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeTypeDataPatient,
      doctorName: item.firstName + item.lastName,
      patientName: item.patientData.firstName + " " + item.patientData.lastName,
      reason: "",
    };
    this.setState({
      isOpenWarningModal: true,
      dataModal: data,
    });
    // console.log(">>> Check data: ", data);
  };

  closeRefuseModal = () => {
    this.setState({
      isOpenRefuseModal: false,
      dataModal: {},
    });
  };

  sendRefuse = async (dataChild) => {
    // console.log("check data child", dataChild);
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRefuse({
      email: dataChild.email,
      doctorId: dataChild.doctorId,
      patientId: dataChild.patientId,
      timeType: dataChild.timeType,
      patientName: dataChild.patientName,
      reason: dataChild.reason,
      date: this.state.date,
    });
    // console.log("check modal:res", res);
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Gửi email từ chối thành công! ");
      this.closeRefuseModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Có lỗi đang xảy ra... !!!");
      console.log("Có lỗi khi gửi email: ", res);
    }
  };
  
  sendWarning = async (dataChild) => {
    // console.log("check data child", dataChild);
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendWarning({
      email: dataChild.email,
      doctorId: dataChild.doctorId,
      patientId: dataChild.patientId,
      timeType: dataChild.timeType,
      patientName: dataChild.patientName,
      doctorName: dataChild.doctorName,
      reason: dataChild.reason,
      date: this.state.date,
    });
    // console.log("check modal:res", res);
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Gửi email cảnh báo thành công!");
      this.closeWarningModal();
      await this.getDataPatientS3();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Có lỗi đang xảy ra... !!!");
      console.log("Có lỗi khi gửi email: ", res);
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  closeWarningModal = () => {
    this.setState({
      isOpenWarningModal: false,
      dataModal: {},
    });
  };

  handleConfirm = async (dataChild) => {
    let textConfirm = "Xác nhận lịch khám đã hoàn thành ?";
    if (window.confirm(textConfirm) === true) {
      this.setState({
        isShowLoading: true,
      });
      console.log(
        "check data handleConfirm",
        dataChild.doctorId,
        dataChild.patientId,
      );
      let res = await getConfirm({
        doctorId: dataChild.doctorId,
        patientId: dataChild.patientId,
      });
      // console.log("check res confirm", res);
      if (res && res.errCode === 0) {
        toast.success("Xác nhận thành công!!! ");
        // await this.getDataPatient();
        await this.getDataPatientS3();
        this.setState({
          isShowLoading: false,
        });
      } else {
        this.setState({
          isShowLoading: false,
        });
        toast.error("Có lỗi đang xảy ra... !!!");
        console.log("Có lỗi khi gửi email: ", res);
      }
    } else {

    }

  };
  handleCancel = async (dataChild) => {
    let textConfirm = "Xác nhận hủy lịch khám ?";
    if (window.confirm(textConfirm) === true) {
      this.setState({
        isShowLoading: true,
      });
      console.log(
        "check data handleConfirm",
        dataChild.doctorId,
        dataChild.patientId,
      );
      let res = await getCancel({
        doctorId: dataChild.doctorId,
        patientId: dataChild.patientId,
      });
      // console.log("check res confirm", res);
      if (res && res.errCode === 0) {
        toast.success(" Hủy thành công!!! ");
        // await this.getDataPatient();
        await this.getDataPatientS3();
        this.setState({
          isShowLoading: false,
        });
      } else {
        this.setState({
          isShowLoading: false,
        });
        toast.error("Có lỗi đang xảy ra... !!!");
        console.log("Có lỗi khi gửi email: ", res);
      }
    } else {

    }

  };

  sendRemedy = async (dataChild) => {
    console.log("check data child", dataChild);
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedy({
      email: dataChild.email,
      doctorId: dataChild.doctorId,
      patientId: dataChild.patientId,
      // timeType:
      //   dataChild.statusId === "S3"
      //     ? dataChild.timeTypeDataPatient
      //     : dataChild.time,
      timeType: dataChild.time,
      patientName: dataChild.patientName,
      date: this.state.date,
    });
    // console.log("check modal:res", res);
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
        // isDisable: !this.state.isDisable,
      });
      toast.success("Gửi email xác nhận thành công! ");
      this.closeRemedyModal();
      await this.getDataPatient();
      await this.getDataPatientS3();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Có lỗi đang xảy ra... !!!");
      console.log("error send remedy: ", res);
    }
  };

  render() {
    let {
      isOpenRemedyModal,
      isOpenRefuseModal,
      isOpenWarningModal,
      dataModal,
      dataPatientBookOnline,
      arrayPatientS3
    } = this.state;
    console.log("arr Online", dataPatientBookOnline);
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            <div className=" title text-center mt-4">
              quản lý bệnh nhân khám bệnh
            </div>
            <div className="m-p-body row">
              <div className="col-4 form-group">
                <label>Chọn ngày khám:</label>
                <br />
                <DatePicker
                  onChange={this.handleChangeDatePicker}
                  className="form-group datePicker"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-m-p mt-3">
                <p className="h5" style={{ color: "black", background: "white", border: "1px solid black" }}>
                  Danh sách bệnh nhân đặt lịch khám trực tuyến:
                </p>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th style={{ width: "120px" }}>Thời gian</th>
                      <th style={{ width: "230px" }}>Họ và tên</th>
                      <th style={{ width: "220px", textAlign: "left" }}>Email</th>
                      <th style={{ width: "260px" }}>Địa chỉ</th>
                      <th style={{ width: "120px" }}>Giới tính</th>
                      <th>Lý do</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatientBookOnline &&
                      dataPatientBookOnline.length > 0 ? (
                      dataPatientBookOnline.map((item, index) => {
                        return item.bookingType === "ONLINE" ? (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.timeTypeDataPatient.valueVI}</td>
                            <td>
                              {item.patientData.lastName +
                                " " +
                                item.patientData.firstName}
                            </td>
                            <td style={{ textAlign: "left" }}>{item.patientData.email}</td>
                            <td>{item.address}</td>
                            <td>{item.patientData.genderData.valueVI}</td>
                            <td>{item.reason}</td>
                            <td>
                              <button
                                className="btn btn-info px-1 mx-1"
                                onClick={() => this.handleBtnConfirmOn(item)}
                                hidden={item.statusId === "S2" ? false : true}
                              >
                                Đồng ý
                              </button>
                              <button
                                className="btn btn-success px-1 mx-1"
                                onClick={() => this.handleConfirm(item)}
                                hidden={item.statusId === "S3" ? false : true}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="btn btn-danger px-1 mx-1"
                                onClick={() => this.handleBtnRefuse(item)}
                              >
                                Từ chối
                              </button>
                            </td>
                          </tr>
                        ) : (
                          ""
                        );
                      })
                    ) : (
                      <tr>
                        <td colspan="8" className="no-data">
                          Ngày hôm nay không có lịch đặt hẹn nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 table-m-p mt-3 " >
            <p className="h5" style={{ marginTop: "50px", marginLeft: "20px", width: "97.5%" }}>
              Danh sách các lịch hẹn
            </p>
            <table style={{ width: "97.5%", marginLeft: "20px", tableLayout: "unset" }}>
              <tbody>
                <tr>
                  <th>STT</th>
                  <th style={{ width: "100px" }}>Khung giờ</th>
                  <th style={{ width: "140px" }}>Họ và tên</th>
                  <th style={{ width: "100px" }}>Số điện thoại</th>
                  <th style={{ width: "140px", textAlign: "left" }}>Email</th>
                  <th>Địa chỉ</th>
                  {/* <th>Lý do</th> */}
                  <th style={{ width: "90px" }}>Actions</th>
                </tr>
                {arrayPatientS3 &&
                  arrayPatientS3.length > 0 ? (
                  arrayPatientS3.map((item, index) => {
                    return item.statusId === "S3" ? (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.timeTypeDataPatient.valueVI}</td>
                        <td>
                          {item.patientData.lastName +
                            " " +
                            item.patientData.firstName}
                        </td>
                        <td>{item.patientData.phonenumber}</td>
                        <td style={{ textAlign: "left" }}>{item.patientData.email}</td>
                        <td>{item.address}</td>
                        {/* <td>{item.reason}</td> */}
                        <td>
                          <button
                            className="btn btn-info px-1 mx-1"
                            onClick={() => this.handleBtnConfirmOn(item)}
                            hidden={item.statusId === "S2" ? false : true}
                          >
                            Đồng ý
                          </button>
                          <button
                            className="btn btn-success px-3 mx-1"
                            onClick={() => this.handleConfirm(item)}
                            hidden={item.statusId === "S3" ? false : true}
                          >
                            <i class="fa-regular fa-circle-check"></i>
                          </button>
                          <button
                            className="btn btn-danger px-3 mx-1"
                            onClick={() => this.handleCancel(item)}
                          >
                            <i class="fa-solid fa-ban"></i>
                          </button>
                          <button
                            style={{ backgroundColor: "black", color: "white" }}
                            className="btn px-3 mx-1"
                            onClick={() => this.handleBtnWarning(item)}
                          // onClick={() => this.handleBtnRefuse(item)}
                          >
                            <i class="fa-solid fa-lock"></i>

                          </button>
                        </td>

                      </tr>
                    ) : (
                      ""
                    );
                  })
                ) : (
                  <tr>
                    <td colspan="8" className="no-data" style={{ color: "red", fontWeight: "600" }}>
                      Lịch sử trống
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
          <RefuseModal
            isOpenModal={isOpenRefuseModal}
            dataModal={dataModal}
            closeRefuseModal={this.closeRefuseModal}
            sendRefuse={this.sendRefuse}
          />
          <WarningModal
            isOpenModal={isOpenWarningModal}
            dataModal={dataModal}
            closeWarningModal={this.closeWarningModal}
            sendWarning={this.sendWarning}
          />
        </LoadingOverlay>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

  
export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);