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
      email: "",
      password: "",
      newPassword: "",
      checkNewPassword: "",
      hiddenMess: true,
      disButton: true,
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
        toast.error("Thiếu dữ liệu, vui lòng nhập đủ thông tin!");
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
          this.setState({
            email: "",
            password: "",
            newPassword: "",
            checkNewPassword: "",
            hiddenMess: true,
            disButton: true,
          });
        } else {
          //check new pasword fail
          toast.error("Mật khẩu không trùng khớp, vui lòng nhập lại!");
        }
      } else {
        // check email and password fail
        toast.error("Tài khoản hoặc mật khẩu không đúng, vui lòng nhập lại!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  checkEmail = () => {
    if (this.state.email == this.props.userInfo.email)
      this.setState({
        hiddenMess: false,
        disButton: false,
      });
  };
  render() {
    // const { userInfo } = this.props;
    // console.log("check userinfo:", userInfo);
    return (
      <div className="banner-container">
        <HomeHeader />
        <div className="container mt-5">
          <div className="row">
            <div className="center-banner ">
              <div className="center-banner-container">
                <div className="col-12 title mb-4">Đổi mật khẩu</div>
                <div className="col-8 mt-4">
                  <label>Email</label>
                  <input
                    type="email"
                    value={this.state.email}
                    className="form-control mt-2"
                    placeholder="Nhâp tên email"
                    onChange={(event) => this.onChangeInput(event, "email")}
                  />
                </div>
                <button
                  className="btn btn-success mt-3 px-3"
                  onClick={this.checkEmail}
                >
                  Kiểm tra
                </button>
                <span
                  hidden={this.state.hiddenMess}
                  style={{ color: "yellow" }}
                >
                  Email chính xác, vui lòng nhập mật khẩu
                </span>
                <div className=" col-8 mt-4">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    value={this.state.password}
                    type={this.state.isShowPassword1 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Nhâp mật khẩu hiện tại"
                    onChange={(event) => this.onChangeInput(event, "password")}
                    disabled={this.state.disButton}
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
                <div className=" col-8 mt-2">
                  <label>Mật khẩu mới</label>
                  <input
                    value={this.state.newPassword}
                    type={this.state.isShowPassword2 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Nhập mật khẩu mới"
                    onChange={(event) =>
                      this.onChangeInput(event, "newPassword")
                    }
                    disabled={this.state.disButton}
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

                <div className=" col-8 mt-2">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    value={this.state.checkNewPassword}
                    type={this.state.isShowPassword3 ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Xác nhận mật khẩu"
                    onChange={(event) =>
                      this.onChangeInput(event, "checkNewPassword")
                    }
                    disabled={this.state.disButton}
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
