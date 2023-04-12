import React, { Component } from "react";
// import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import "./ModalUser.scss";
import _ from "lodash";

class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
    };
  }
  componentDidMount() {
    let user = this.props.currentUser;
    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phonenumber: user.phonenumber,
      });
    }
  }

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
    let arrInput = ["email", "firstName", "lastName", "address", "phonenumber"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValue = false;
        alert("Missing parameter : " + arrInput[i]);
        break;
      }
    }
    return true;
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      // call api edit user modal
      this.props.editUser(this.state);
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
        <ModalHeader toggle={this.toggle}>Edit a new user</ModalHeader>
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
                disabled
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              this.handleSaveUser();
            }}
            className="btn"
          >
            Save Changes
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
