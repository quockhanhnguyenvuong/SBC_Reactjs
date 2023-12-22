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
      email: "",
      time: "",
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

  handleSendRemedy = () => {
    console.log("checksendRemedy", this.state.time);
    let { dataModal } = this.props;
    if (dataModal.bookingType === "ATHOME") {
      dataModal.time = this.state.time;
    }
    this.props.sendRemedy(this.props.dataModal);
  };

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
    // console.log("ssss: ", stateCopy);
  };

  render() {
    let { isOpenModal, closeRemedyModal, dataModal } = this.props;
    // console.log("check data modal remedy", dataModal);

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
            Bạn có chắc chắn xác nhận lịch hẹn này?
          </h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeRemedyModal}
          >
            <span>
              <i class="fa-sharp fa-regular fa-circle-xmark"></i>
            </span>
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Tên bệnh nhân:</label>
              <br />
              {dataModal.patientName}
            </div>
            <div className="col-6 form-group">
              <label>Thời gian hẹn:</label>
              <br />
              {dataModal.bookingType === "ONLINE" ? (
                dataModal.timeTypeDataPatient
              ) : (
                <div>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(event) =>
                      this.handleOnchangeInput(event, "time")
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 form-group mail">
              <label>Email bệnh nhân:</label>
              <input
                className="form-control"
                type="email"
                value={this.state.email}
                onChange={(event) => this.handleOnchangeEmail(event)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn_modalFooter"
            onClick={this.handleSendRemedy}
          >
            Xác nhận
          </Button>{" "}
          <Button
            color="warning"
            className="btn_modalFooter"
            onClick={closeRemedyModal}
          >
            Thoát
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
