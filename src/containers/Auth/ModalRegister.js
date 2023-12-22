import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import "./ModalRegister.scss";
import {
  getAllCodeService,
  createNewUserService,
} from "../../services/userService";
import { toast } from "react-toastify";

class ModalRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      gender: "",
      genderArr: [],
      apartmentNumber: "",
      wards: "",
      district: "",
      city: "",
      isShowPassword: false,
    };
  }
  async componentDidMount() {
    await this.getGenderFormReact();
    let genderArr = this.state.genderArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : "",
    });
  }

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  // load gender
  getGenderFormReact = async () => {
    let response = await getAllCodeService("gender");
    if (response && response.errCode === 0) {
      this.setState({
        genderArr: response.data,
      });
    }
  };

  // create user
  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      console.log("create user: ", data);
      if (response && response.errCode !== 0) {
        if (response && response.errCode === 1) {
          toast.error("Email đã được sử dụng, vui lòng nhập email khác !!!");
        }
      } else {
        toast.success("Tạo người dùng mới thành công !!!");
        this.toggle();
      }
    } catch (e) {
      console.log(e);
    }

    console.log("check data from child :", data);
  };

  //handle button save
  handleSaveUser = async () => {
    // console.log(this.state);
    let isValid = this.checkValidateInput();
    if (isValid === false) return;
    // call api create modal
    await this.createNewUser({
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phonenumber: this.state.phonenumber,
      gender: this.state.gender,
      roleID: "R3",
      positionID: "P0",
      // image: this.state.image,
    });
  };

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
  checkEmailIsValid = (email) => {
    let check =
      /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/i;
    return check.test(String(email).toLowerCase());
  };
  checkPhoneNumberIsValid = (phonenumber) => {
    let check = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return check.test(phonenumber);
  };
  checkValidateInput = () => {
    let isValue = true;
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      // "apartmentNumber",
      // "wards",
      // "district",
      // "city",
      "phonenumber",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValue = false;
        if (arrInput[i] === "email")
          toast.warn("Vui lòng nhập : email đăng nhập");
        if (arrInput[i] === "password") toast.warn("Vui lòng nhập : mật khẩu");
        if (arrInput[i] === "firstName") toast.warn("Vui lòng nhập : tên");
        if (arrInput[i] === "lastName") toast.warn("Vui lòng nhập : họ");
        // if (arrInput[i] === "apartmentNumber")
        //   toast.warn("Vui lòng nhập : số nhà, tên đường");
        // if (arrInput[i] === "wards") toast.warn("Vui lòng nhập : phường");
        // if (arrInput[i] === "district") toast.warn("Vui lòng nhập : quận");
        // if (arrInput[i] === "city") toast.warn("Vui lòng nhập : thành phố");
        if (arrInput[i] === "phonenumber")
          toast.warn("Vui lòng nhập : số điện thoại");
        break;
      }
      if (
        arrInput[i] === "email" &&
        !this.checkEmailIsValid(this.state.email)
      ) {
        isValue = false;
        toast.warn("Vui lòng nhập email đúng định dạng");
        break;
      }

      if (
        arrInput[i] === "phonenumber" &&
        !this.checkPhoneNumberIsValid(this.state.phonenumber)
      ) {
        isValue = false;
        toast.warn("Vui lòng nhập số điện thoại đúng định dạng");
        break;
      }
    }
    return isValue;
  };

  render() {
    let genders = this.state.genderArr;
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className="modal-container"
        size="lg"
        centered
      >
        <ModalHeader toggle={this.toggle}>Đăng kí tài khoản</ModalHeader>
        <ModalBody>
          <div className="modal-body">
            <div className="input-container ">
              <label>Email đăng nhập</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "email");
                }}
                value={this.state.email}
              />
            </div>
            <div className="input-container ">
              <label>Mật khẩu</label>
              <input
                type={this.state.isShowPassword ? "text" : "password"}
                onChange={(event) => {
                  this.handleChangeInput(event, "password");
                }}
                value={this.state.password}
              />
              <span
                style={{ position: "relative", left: "250px", bottom: "25px" }}
                onClick={() => {
                  this.handleShowHidePassword();
                }}
              >
                <i
                  className={
                    this.state.isShowPassword
                      ? "far fa-eye"
                      : "fas fa-eye-slash"
                  }
                ></i>
              </span>
            </div>
            <div className="input-container">
              <label>Tên</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "firstName");
                }}
                value={this.state.firstName}
              />
            </div>
            <div className="input-container ">
              <label>Họ</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "lastName");
                }}
                value={this.state.lastName}
              />
            </div>

            <div className="input-container mt-4">
              <label>Số điện thoại</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "phonenumber");
                }}
                value={this.state.phonenumber}
              />
            </div>

            <div className="input-container mt-4">
              <label>Giới tính </label>
              <select
                className="form "
                value={this.state.gender}
                onChange={(event) => {
                  this.handleChangeInput(event, "gender");
                }}
              >
                {genders &&
                  genders.length > 0 &&
                  genders.map((item, index) => {
                    return (
                      <option selected key={index} value={item.keyMap}>
                        {item.valueVI}
                      </option>
                    );
                  })}
              </select>
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
            Tạo tài khoản
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalRegister);
