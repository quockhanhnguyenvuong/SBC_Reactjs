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
    };
  }
  async componentDidMount() {
    await this.getGenderFormReact();
    let genderArr = this.state.genderArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : "",
    });
  }

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
        if (arrInput[i] === "email") alert("Vui lòng nhập : email đăng nhập");
        if (arrInput[i] === "password") alert("Vui lòng nhập : mật khẩu");
        if (arrInput[i] === "firstName") alert("Vui lòng nhập : tên");
        if (arrInput[i] === "lastName") alert("Vui lòng nhập : họ");
        // if (arrInput[i] === "apartmentNumber")
        //   alert("Vui lòng nhập : số nhà, tên đường");
        // if (arrInput[i] === "wards") alert("Vui lòng nhập : phường");
        // if (arrInput[i] === "district") alert("Vui lòng nhập : quận");
        // if (arrInput[i] === "city") alert("Vui lòng nhập : thành phố");
        if (arrInput[i] === "phonenumber")
          alert("Vui lòng nhập : số điện thoại");
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
                type="password"
                onChange={(event) => {
                  this.handleChangeInput(event, "password");
                }}
                value={this.state.password}
              />
            </div>
            <div className="input-container ">
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

            {/* <div className="input-container">
              <label>Số nhà, tên đường</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "apartmentNumber");
                }}
                value={this.state.apartmentNumber}
              />
            </div>
            <div className="input-container">
              <label>Phường</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "wards");
                }}
                value={this.state.wards}
              />
            </div>
            <div className="input-container">
              <label>Quận</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "district");
                }}
                value={this.state.district}
              />
            </div>
            <div className="input-container">
              <label>Thành phố</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "city");
                }}
                value={this.state.city}
              />
            </div> */}
            <div className="input-container">
              <label>Số điện thoại</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleChangeInput(event, "phonenumber");
                }}
                value={this.state.phonenumber}
              />
            </div>

            <div className="input-container">
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
