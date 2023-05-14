import React, { Component } from "react";
import "./RemedyModal.scss";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import { CommonUtils } from "../../../utils";


class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        imgBase64:'',
    };
  }

  async componentDidMount() {
    if(this.props.dataModal){
        this.setState({
            email: this.props.dataModal.email,
        })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.dataModal !== this.props.dataModal){
        this.setState({
            email: this.props.dataModal.email,
        })
    }
  }

  handleOnchangeEmail = (event) =>{
    this.setState({
        email: event.target.value,
    })
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imgBase64: base64,
      });
    }
  };

  handleSendRemedy = () =>{
    this.props.sendRemedy(this.state)
  }

  render() {
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy} = this.props;
    return (
      <Modal
        isOpen={isOpenModal}
        className="'booking-modal-container"
        size="md"
        centered
        // backdrop={true}
      >
        <div className="modal-header">
            <h5 className="modal-title">Bạn có chắc chắn xác nhận lịch hẹn này?</h5>
            <button type="button" className="close" aria-label="Close" onClick={closeRemedyModal}>
                <span><i class="fa-sharp fa-regular fa-circle-xmark"></i></span>
            </button>
        </div>
          <ModalBody>
            <div className="row">
                <div className="col-6 form-group">
                        <label>Tên Của bệnh nhân:</label>
                        <p> FullName</p>
                </div>
                <div className="col-6 form-group">
                        <label>Thời gian hẹn:</label>
                        <p>time</p>
                </div>
            </div>
            <div className="row">
                <div className="col-12 form-group mail">
                        <label>Email bệnh nhân:</label>
                        <input className="form-control" type="email" value={this.state.email} 
                            onChange={(event) => this.handleOnchangeEmail(event)}
                        />
                </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="btn_modalFooter" onClick={this.handleSendRemedy}>Send</Button>{' '}
            <Button color="warning" className="btn_modalFooter" onClick={closeRemedyModal}>Cancel</Button>
          </ModalFooter>
      </Modal>

      
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
{/* <div className="row">
                <div className="col-6 form-group">
                        <label>Email bệnh nhân:</label>
                        <input className="form-control" type="email" value={this.state.email} 
                            onChange={(event) => this.handleOnchangeEmail(event)}
                        />
                </div>
                <div className="col-6 form-group">
                        <label>Chọn file hóa đơn:</label>
                        <input className="form-control-file" type="file" 
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                </div>
            </div> */}