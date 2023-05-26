import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  postSendRefuse,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import RefuseModal from "./RefuseModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: {},
      isOpenRemedyModal: false,
      isOpenRefuseModal: false,
      dataModal: {},
      isShowLoading: false,
      arrayMap: [],
    };
  }

  async componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    console.log("check res", res);
    if (res && res.errCode == 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  handleChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      },
    );
  };

  handleBtnConfirm = (item) => {
    console.log(">>> Check item: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
    console.log(">>> Check data: ", data);
  };

  handleBtnRefuse = (item) => {
    console.log(">>> Check item: ", item);
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRefuseModal: true,
      dataModal: data,
    });
    console.log(">>> Check data: ", data);
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send Remedy success: ");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Something wrong.....!!!");
      console.log("error send remedy: ", res);
    }
  };

  closeRefuseModal = () => {
    this.setState({
      isOpenRefuseModal: false,
      dataModal: {},
    });
  };

  sendRefuse = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRefuse({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send email success: ");
      this.closeRefuseModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Something wrong.....!!!");
      console.log("error send email: ", res);
    }
  };

  handleChoose = (array) => {
    this.state.arrayMap.push(array);
    console.log("check array map", this.state.arrayMap);
  };

  render() {
    console.log(">>> state: ", this.state.currentDate);
    // console.log(">>> props: ", this.props);
    let { dataPatient, isOpenRemedyModal, isOpenRefuseModal, dataModal } =
      this.state;
    let arrUser1 = {
      timeType: "9:00 - 10:00",
      name: "Trần Văn Hải",
      email: "tranvanhai@gmail.com",
      diachi: "28 phan thanh, đà nẵng",
      gioitinh: "Nam",
      lydo: "Đau mắt",
      hinhthuc: "OFFLINE",
    };
    let arrUser2 = {
      timeType: "9:00 - 10:00",
      name: "Trần Quốc Bi",
      email: "tranquocbi@gmail.com",
      diachi: "59 lý triệt, đà nẵng",
      gioitinh: "Nữ",
      lydo: "Đau mắt",
      hinhthuc: "OFFLINE",
    };
    let arrUser3 = {
      timeType: "9:00 - 10:00",
      name: "Nguyễn Ngọc Thuận",
      email: "nguyenngocthuan@gmail.com",
      diachi: "14 nam cao, đà nẵng",
      gioitinh: "Nam",
      lydo: "Đau mắt",
      hinhthuc: "OFFLINE",
    };
    let array = [];
    array.push(arrUser1, arrUser2, arrUser3);

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            {/* m-p : là viết tắt của manage-patient */}
            <div className="m-p-title">quản lý bệnh nhân khám bệnh</div>
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
              <div className="col-12 table-m-p">
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Giới tính</th>
                      <th>Lý do</th>
                      <th>Hình thức</th>
                      <th>Actions</th>
                    </tr>

                    {array.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.timeType}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.diachi}</td>
                          <td>{item.gioitinh}</td>
                          <td>{item.lydo}</td>
                          <td>{item.hinhthuc}</td>
                          <td>
                            <button
                              className="btn btn-success px-1"
                              onClick={() => this.handleBtnConfirm(item)}
                            >
                              Xác nhận
                            </button>
                            <button
                              className="btn btn-danger px-1"
                              onClick={() => this.handleBtnRefuse(item)}
                            >
                              Hủy bỏ
                            </button>
                            <button
                              className="btn btn-warning px-1"
                              onClick={() => this.handleChoose(item)}
                            >
                              Chọn
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 4}</td>
                            <td>{item.timeTypeDataPatient.valueVI}</td>
                            <td>
                              {item.patientData.firstName +
                                " " +
                                item.patientData.lastName}
                            </td>
                            <td>{item.patientData.email}</td>
                            <td>{item.patientData.address}</td>
                            <td>{item.patientData.genderData.valueVI}</td>
                            <td>{item.reason}</td>
                            <td>{item.bookingType}</td>
                            <td>
                              <button
                                className="btn btn-success px-1"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="btn btn-danger px-1"
                                onClick={() => this.handleBtnRefuse(item)}
                              >
                                Hủy bỏ
                              </button>
                              <button
                                className="btn btn-warning px-1"
                                onClick={() => this.handleChoose(item)}
                              >
                                Chọn
                              </button>
                            </td>
                          </tr>
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
