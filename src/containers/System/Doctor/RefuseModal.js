import React, { Component } from "react";
import "./RefuseModal.scss";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
// import { CommonUtils } from "../../../utils";

class RefuseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
      reason: "",
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnchangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  // handleOnChangeImage = async (event) => {
  //   let data = event.target.files;
  //   let file = data[0];
  //   if (file) {
  //     let base64 = await CommonUtils.getBase64(file);
  //     this.setState({
  //       imgBase64: base64,
  //     });
  //   }
  // };

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state }; //3 dấu ... là copy lại tên biến cần copy
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
    console.log("ssss: ", stateCopy);
  };

  handleSendRefuse = () => {
    this.props.sendRefuse(this.state);
    console.log("what: ", this.state);
  };

  render() {
    let { isOpenModal, closeRefuseModal, dataModal, sendRefuse } = this.props;
    return (
      <Modal
        isOpen={isOpenModal}
        className="'booking-modal-container"
        size="md"
        centered
        // backdrop={true}
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Bạn có chắc chắn từ chối lịch hẹn này?
          </h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeRefuseModal}
          >
            <span>
              <i class="fa-sharp fa-regular fa-circle-xmark"></i>
            </span>
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
            <div className="col-6 form-group mail">
              <label>Email bệnh nhân:</label>
              <input
                className="form-control"
                type="email"
                value={this.state.email}
                onChange={(event) => this.handleOnchangeEmail(event)}
              />
            </div>
            <div className="col-6 form-group">
              <label>Lý do từ chối:</label>
              <input
                className="form-control"
                onChange={(event) => this.handleOnchangeInput(event, "reason")}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn_modalFooter"
            onClick={this.handleSendRefuse}
          >
            Send
          </Button>{" "}
          <Button
            color="warning"
            className="btn_modalFooter"
            onClick={closeRefuseModal}
          >
            Cancel
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(RefuseModal);
