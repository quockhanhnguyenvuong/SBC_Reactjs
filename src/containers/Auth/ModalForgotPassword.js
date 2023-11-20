import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class ModalForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleConfirm = () => {
    this.toggle();
    toast.success("Vui lòng kiểm tra email của bạn!!!");
  };
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className="modal-container"
        size="md"
        centered
      >
        <ModalHeader toggle={this.toggle}>Quên mật khẩu</ModalHeader>
        <ModalBody>
          <div className="modal-body w-100 d-flex justify-content-center ">
            <div className="input-container w-75 ">
              <label>Nhập email của bạn</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "email");
                }}
                value={this.state.email}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn"
            onClick={() => this.handleConfirm()}
          >
            Xác nhận
          </Button>
          <Button color="secondary" onClick={this.toggle} className="btn">
            Đóng
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalForgotPassword);
