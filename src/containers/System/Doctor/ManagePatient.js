import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendRemedy, postSendRefuse } from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import RefuseModal from "./RefuseModal";
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentDate: moment(new Date()).startOf("day").valueOf(),
        dataPatient: {},
        isOpenRemedyModal: true,
        isOpenRefuseModal: true,
        dataModal: {},
        isShowLoading: false,
    };
  }

  async componentDidMount() {
    console.log('>>> check state: ', this.state);
    this.getDataPatient();
    // console.log('>>> check res: ', res);
  }

  getDataPatient = async () =>{
    let {user} = this.props;
    let {currentDate} = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    })
    if(res && res.errCode == 0){
      this.setState({
        dataPatient: res.data
      })
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  handleChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    },async () => {
      await this.getDataPatient();
    });
  };

  handleBtnConfirm = (item) =>{
    console.log('>>> Check item: ', item)
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    }
    this.state({
      isOpenRemedyModal: false,
      dataModal: data,
    })
    console.log('>>> Check data: ', data)
  }

  handleBtnRefuse = (item) =>{
    console.log('>>> Check item: ', item)
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    }
    this.state({
      isOpenRefuseModal: true,
      dataModal: data,
    })
    console.log('>>> Check data: ', data)
  }

  closeRemedyModal = () =>{
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {}
    })
  }

  sendRemedy = async (dataChild) =>{
    let {dataModal} = this.state;
    this.setState({
      isShowLoading: true,
    })
    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      patientName: dataModal.patientName,
    });
    
    if(res && res.errCode === 0){
      this.setState({
        isShowLoading: false,
      })
      toast.success('Send Remedy success: ');
      this.closeRemedyModal();
      await this.getDataPatient();
    }else{
      this.setState({
        isShowLoading: false,
      })
      toast.error('Something wrong.....!!!');
      console.log('error send remedy: ',res);
    }
  }

  closeRefuseModal = () =>{
    this.setState({
      isOpenRefuseModal: false,
      dataModal: {}
    })
  }

  sendRefuse = async (dataChild) =>{
    let {dataModal} = this.state;
    this.setState({
      isShowLoading: true,
    })
    let res = await postSendRefuse({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      patientName: dataModal.patientName,
    });
    
    if(res && res.errCode === 0){
      this.setState({
        isShowLoading: false,
      })
      toast.success('Send email success: ');
      this.closeRefuseModal();
      await this.getDataPatient();
    }else{
      this.setState({
        isShowLoading: false,
      })
      toast.error('Something wrong.....!!!');
      console.log('error send email: ',res);
    }
  }

  render() {
    console.log('>>> props: ', this.state)
    let {dataPatient, isOpenRemedyModal, isOpenRefuseModal, dataModal} = this.state;
    return(
      <>
        <LoadingOverlay
            active={this.state.isShowLoading}
            spinner
            text='Loading...'
            >
         
          <div className="manage-patient-container">
              {/* m-p : là viết tắt của manage-patient */}
              <div className="m-p-title" >
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
                  <div className="col-12 table-m-p" >
                      <table style={{width:'100%'}}>
                        <tbody>
                          <tr>
                                <th>STT</th>
                                <th>Thời gian</th>
                                <th>Họ và tên</th>
                                <th>Địa chỉ</th>
                                <th>Giới tính</th>
                                <th>Actions</th>
                            </tr>
                            {dataPatient && dataPatient.length > 0 ? dataPatient.map((item, index) =>{
                              return(
                                <tr key={index}>
                                  <td>{index+1}</td>
                                  <td>{item.timeTypeDataPatient.valueVi}</td>
                                  <td>{item.patientData.firstName}</td>
                                  <td>{item.patientData.address}</td>
                                  <td>{item.patientData.genderData.valueVi}</td>
                                  <td>
                                    <button className="mp-btn-confirm" 
                                      onClick={() => this.handleBtnConfirm(item)}>Xác nhận</button>
                                    <button className="mp-btn-refuse"
                                      onClick={() => this.handleBtnRefuse(item)}>Hủy bỏ</button>
                                  </td>
                                </tr>
                              )
                              })
                              : 
                              <tr>
                                <td colspan='6' className="no-data" >Ngày hôm ni không có lịch đặt hẹn nào</td>
                              </tr>
                            }
                            
                        </tbody>
                      </table>
                  </div>
              </div>
          </div>
          <RemedyModal 
            isOpenModal= {isOpenRemedyModal}
            dataModal= {dataModal}
            closeRemedyModal= {this.closeRemedyModal}
            sendRemedy = {this.sendRemedy}
          />
          <RefuseModal
            isOpenModal= {isOpenRefuseModal}
            dataModal= {dataModal}
            closeRefuseModal= {this.closeRefuseModal}
            sendRefuse = {this.sendRefuse}
          />
        </LoadingOverlay>
      </>
    );
  }
}
const mapStateToProps = state =>{
  return{
    user: state.user.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps,mapDispatchToProps)(ManagePatient);
