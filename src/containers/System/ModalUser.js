import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import "./ModalUser.scss";
class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
    };
  }
  componentDidMount() {}

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

  checkValidateInput = () => {
    let isValue = true;
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phonenumber",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValue = false;
        alert("Missing parameter : " + arrInput[i]);
        break;
      }
    }
    return true;
  };

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      // call api create modal
      this.props.createNewUser(this.state);
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className="modal-container"
        size="lg"
        centered
      >
        <ModalHeader toggle={this.toggle}>Create a new user</ModalHeader>
        <ModalBody>
          <div className="modal-body">
            <div className="input-container ">
              <label>Email</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "email");
                }}
                value={this.state.email}
              />
            </div>
            <div className="input-container ">
              <label>Password</label>
              <input
                type="password"
                onChange={(event) => {
                  this.handleChangeInput(event, "password");
                }}
                value={this.state.password}
              />
            </div>
            <div className="input-container ">
              <label>First Name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "firstName");
                }}
                value={this.state.firstName}
              />
            </div>
            <div className="input-container ">
              <label>Last Name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "lastName");
                }}
                value={this.state.lastName}
              />
            </div>
            <div className="input-container input-address">
              <label>Address</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "address");
                }}
                value={this.state.address}
              />
            </div>
            <div className="input-container">
              <label>Phone Number</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "phonenumber");
                }}
                value={this.state.phonenumber}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              this.handleAddNewUser();
            }}
            className="btn"
          >
            Add new
          </Button>{" "}
          <Button color="secondary" onClick={this.toggle} className="btn">
            Close
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
