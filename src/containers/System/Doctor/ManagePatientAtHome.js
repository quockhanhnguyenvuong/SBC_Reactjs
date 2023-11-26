import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  postSendRefuse,
  getConfirm,
  getListPatientAtHome,
  getCancel,
  postSendWarning,
  // getBlacklistEmail
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import RefuseModal from "./RefuseModal";
import WarningModal from "./WarningModal.js";
import MapDoctor from "../../../Patient/Map/MapDoctor.js";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class ManagePatientAtHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: {},
      isOpenRemedyModal: false,
      isOpenWarningModal: false,
      isOpenRefuseModal: false,
      dataModal: {},
      isShowLoading: false,
      // arrayPatient: [],
      arrayPatientS3: [],
      addressDoctor: "",
      dataPatientBookAtHome: [],
      date: "",
      isDisable: true,
    };
  }

  async componentDidMount() {
    this.getDataPatient();
    this.getDataPatientS3();
    let { user } = this.props;
    this.setState({
      addressDoctor: user.address,
    });
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let date = moment.unix(+formattedDate / 1000).format("dddd - DD/MM/YYYY");
    // console.log("date", date);
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    let arrTempAtHome = [];
    let arr = res.data;
    console.log("echs", res.data)
    let countAtHome = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].bookingType === "ATHOME")
        if (arr[i].statusId === "S2" || arr[i].statusId === "S3")
          arrTempAtHome[countAtHome++] = arr[i];
    }

    // console.log("check arr ", res.data);
    if (res && res.errCode == 0) {
      this.setState({
        dataPatient: res.data,
        dataPatientBookAtHome: arrTempAtHome,
        date: date,
      });
    }
  };

  getDataPatientS3 = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let date = moment.unix(+formattedDate / 1000).format("dddd - DD/MM/YYYY");
    let res = await getListPatientAtHome({
      doctorId: user.id,
      date: formattedDate
    });
    let arrS3 = [];
    let arr = res.data;
    console.log("check", arr)
    let countS3 = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].bookingType === "ATHOME")
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

  handleBtnConfirmAtHome = (item) => {
    // console.log(">>> Check item: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      time: "",
      patientName: item.patientData.lastName + " " + item.patientData.firstName,
      bookingType: "ATHOME",
      date: this.state.date,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
    // console.log(">>> Check data: ", data);
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
      toast.success("Gửi email cảnh báo thành công: ");
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
  closeWarningModal = () => {
    this.setState({
      isOpenWarningModal: false,
      dataModal: {},
    });
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
      toast.success("Gửi email từ chối thành công: ");
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

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
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
      timeType:
        dataChild.bookingType === "ATHOME"
          ? dataChild.timeTypeDataPatient
          : dataChild.time,
      // timeType: dataChild.time,
      patientName: dataChild.patientName,
      date: this.state.date,
    });
    // console.log("check modal:res", res);
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
        // isDisable: !this.state.isDisable,
      });
      toast.success("Gửi email xác nhận thành công: ");
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
  convertToLetter(index) {
    return String.fromCharCode(66 + index); // 65 là mã Unicode cho chữ 'A'
  }
  render() {
    let {
      isOpenRemedyModal,
      isOpenRefuseModal,
      isOpenWarningModal,
      dataModal,
      dataPatientBookAtHome,
      arrayPatientS3
    } = this.state;
    console.log("arr At home", arrayPatientS3);
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
                <p className="h5 mt-4">
                  Danh sách bệnh nhân đặt lịch khám tại nhà:
                </p>
                <table style={{ width: "100%" }}>
                  <tbody style={{ textOverflow: "ellipsis" }} >
                    <tr >
                      <th>STT</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Giới tính</th>
                      <th>Lý do</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatientBookAtHome &&
                      dataPatientBookAtHome.length > 0 ? (
                      dataPatientBookAtHome.map((item, index) => {
                        return item.bookingType === "ATHOME" ? (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.patientData.lastName +
                                " " +
                                item.patientData.firstName}
                            </td>
                            <td>{item.patientData.email}</td>
                            <td>{item.address}</td>
                            <td>{item.patientData.genderData.valueVI}</td>
                            <td>{item.reason}</td>
                            <td>
                              <button
                                className="btn btn-info px-1 mx-1"
                                onClick={() =>
                                  this.handleBtnConfirmAtHome(item)
                                }
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 mt-4">
                <MapDoctor
                  address={this.state.addressDoctor}
                  arrayPatientS3={this.state.arrayPatientS3}
                  handleConfirm={this.handleConfirm}
                />
              </div>
              <div className="col-6 table-m-p mt-4">
                {/* <div className="col-12  mt-3 " > */}
                <p className="h5" style={{width: "115%", marginLeft: "-120px" }}>
                  Danh sách các lịch hẹn
                </p>
                <table style={{ width: "115%", marginLeft: "-120px", tableLayout: "unset", border: "1px solid black" }}>
                  <tbody style={{border: "1px solid black"}}>
                    <tr>
                      <th>Tọa độ</th>
                      <th style={{ width: "140px" }}>Họ và tên</th>
                      <th style={{ width: "100px" }}>Số điện thoại</th>
                      <th style={{ width: "140px" }}>Địa chỉ</th>
                      {/* <th>Lý do</th> */}
                      <th style={{ width: "150px", textAlign: "center" }}>Actions</th>
                    </tr>
                    {arrayPatientS3 &&
                      arrayPatientS3.length > 0 ? (
                      arrayPatientS3.map((item, index) => {
                        return item.statusId === "S3" ? (
                          <tr key={index}>
                            <td style={{textAlign: "center"}}>{this.convertToLetter(index)}</td>
                           
                            <td>
                              {item.patientData.lastName +
                                " " +
                                item.patientData.firstName}
                            </td>
                            <td>{item.patientData.phonenumber}</td>
                            
                            <td>{item.address}</td>
                            {/* <td>{item.reason}</td> */}
                            <td style={{ paddingBottom: "5px"}}>
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
                        <td colspan="8" className="no-data" style={{ color: "red", fontWeight: "600", textAlign: "center" }}>
                          Lịch sử trống
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* </div> */}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagePatientAtHome);