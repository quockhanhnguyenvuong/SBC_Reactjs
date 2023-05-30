import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../containers/HomePage/HomeHeader";
import "./ChangePassword.scss";
import {
  handleLoginApi,
  createNewPasswordService,
} from "../../services/userService";
import { toast } from "react-toastify";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword1: false,
      isShowPassword2: false,
      isShowPassword3: false,
      userId: "",
      errMessage: "",
      email: "",
      password: "",
      newPassword: "",
      checkNewPassword: "",
    };
  }

  componentDidMount() {}

  handleShowHidePassword1 = () => {
    this.setState({
      isShowPassword1: !this.state.isShowPassword1,
    });
  };
  handleShowHidePassword2 = () => {
    this.setState({
      isShowPassword2: !this.state.isShowPassword2,
    });
  };
  handleShowHidePassword3 = () => {
    this.setState({
      isShowPassword3: !this.state.isShowPassword3,
    });
  };

  onChangeInput = (event, id) => {
    // console.log(event.target.value);
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = ["email", "password", "newPassword", "checkNewPassword"];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        this.setState({
          errMessage: "Thiếu dữ liệu, vui lòng nhập đủ thông tin !",
        });
        break;
      }
    }
    return isValid;
  };
  // edit user
  createNewPassword = async (user) => {
    try {
      let res = await createNewPasswordService(user);
      if (res && res.errCode === 0) {
        toast.success("Lưu thành công!");
      } else {
        toast.error("Lưu thất bại, vui lòng thử lại!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleChangePassword = async () => {
    try {
      let isValid = this.checkValidateInput();
      if (isValid === false) return;
      let { email, password, newPassword, checkNewPassword } = this.state;
      let data = await handleLoginApi(email, password);
      // console.log(data);
      // check email and password success
      if (data && data.errCode === 0) {
        // check new password success
        if (newPassword === checkNewPassword) {
          await this.createNewPassword({
            email: this.state.email,
            password: this.state.newPassword,
          });
        } else {
          //check new pasword fail
          this.setState({
            errMessage: "Mật khẩu không trùng khớp, vui lòng nhập lại!",
          });
        }
      } else {
        // check email and password fail
        this.setState({
          errMessage: "Tài khoản hoặc mật khẩu không đúng, vui lòng nhập lại!",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    // const { userInfo } = this.props;
    // console.log("check userinfo:", userInfo);
    return (
      <div className="banner-container">
        <HomeHeader />
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 title mb-4">Đổi mật khẩu</div>
            {/* left banner */}
            <div className="left-banner col-2 mt-5 ">
              {/* <div className="avatar mb-4">
                <i class="far fa-user-circle"></i>
              </div>
              <div>
                <span className="name mx-4">
                  {this.props.userInfo.firstName} {this.props.userInfo.lastName}
                </span>
              </div> */}
            </div>
            {/* right banner */}
            <div className="right-banner col-8">
              <div className="right-banner-container">
                <div className=" col-8 mt-4">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control mt-2"
                    placeholder="Nhâp tên email"
                    value={this.state.username}
                    onChange={(event) => this.onChangeInput(event, "email")}
                  />
                </div>

                <div className=" col-8 mt-4">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type={this.state.isShowPassword1 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Nhâp mật khẩu hiện tại"
                    onChange={(event) => this.onChangeInput(event, "password")}
                  />
                  <span
                    className="eye"
                    onClick={() => {
                      this.handleShowHidePassword1();
                    }}
                  >
                    <i
                      className={
                        this.state.isShowPassword1
                          ? "far fa-eye"
                          : "fas fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>
                <div className=" col-8 mt-4">
                  <label>Mật khẩu mới</label>
                  <input
                    type={this.state.isShowPassword2 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Nhập mật khẩu mới"
                    onChange={(event) =>
                      this.onChangeInput(event, "newPassword")
                    }
                  />
                  <span
                    className="eye"
                    onClick={() => {
                      this.handleShowHidePassword2();
                    }}
                  >
                    <i
                      className={
                        this.state.isShowPassword2
                          ? "far fa-eye"
                          : "fas fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>

                <div className=" col-8 mt-4">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    type={this.state.isShowPassword3 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Xác nhận mật khẩu"
                    onChange={(event) =>
                      this.onChangeInput(event, "checkNewPassword")
                    }
                  />
                  <span
                    className="eye"
                    onClick={() => {
                      this.handleShowHidePassword3();
                    }}
                  >
                    <i
                      className={
                        this.state.isShowPassword3
                          ? "far fa-eye"
                          : "fas fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>

                <div style={{ color: "red" }}>{this.state.errMessage}</div>
              </div>
              {/* button confirm */}
              <button
                className="btn btn-success btn-confirm"
                onClick={() => this.handleChangePassword()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
