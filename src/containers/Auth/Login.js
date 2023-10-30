import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";
import ModalRegister from "./ModalRegister";
import ModalForgotPassword from "./ModalForgotPassword";
import { GoogleLogin } from "react-google-login";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",

      isOpenModalRegister: false,
      isOpenModalForgotPassword: false,
    };
  }

  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
    // console.log(event.target.value)
  };

  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
    // console.log(event.target.value)
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });

    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
        console.log("login succeeds");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.data) {
          this.setState({
            errMessage: e.response.data.message,
          });
        }
      }

      console.log("System Booking A Medical Appointment", e.response);
    }
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.handleLogin();
    }
  };

  //modal đăng kí
  handleAddNewUser = () => {
    this.setState({
      isOpenModalRegister: true,
    });
  };
  handleForgotPasswor = () => {
    this.setState({
      isOpenModalForgotPassword: true,
    });
  };

  toggleModal = () => {
    this.setState({
      isOpenModalRegister: !this.state.isOpenModalRegister,
    });
  };
  toggleModalForgotPassword = () => {
    this.setState({
      isOpenModalForgotPassword: !this.state.isOpenModalForgotPassword,
    });
  };

  render() {
    return (
      <div className="login-backgroud">
        <ModalRegister
          isOpen={this.state.isOpenModalRegister}
          toggleFromParent={this.toggleModal}
        />
        <ModalForgotPassword
          isOpen={this.state.isOpenModalForgotPassword}
          toggleFromParent={this.toggleModalForgotPassword}
        />
        <div className="login-container">
          <div className="btn ">
            <a href="/" className="btn-home">
              <i class="fas fa-home"></i>
            </a>
          </div>
          <div className="login-content">
            <div className=" text-login">Đăng nhập</div>
            <div className=" form-group">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhâp tên đăng nhập"
                value={this.state.username}
                onChange={(event) => this.handleOnChangeUsername(event)}
              />
            </div>
            <div className=" form-group">
              <label>Mật khẩu:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  onChange={(event) => {
                    this.handleOnChangePassword(event);
                  }}
                  onKeyDown={(event) => {
                    this.handleKeyDown(event);
                  }}
                />
                <span
                  className="eye"
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
            </div>
            <div style={{ color: "red" }}>{this.state.errMessage}</div>
            <div className="">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Đăng nhập
              </button>
            </div>
            <div className="d-flex justify-content-between">
              {/* <span onClick={() => this.handleForgotPasswor()}>
                Quên mật khẩu?
              </span> */}
              <span>Quên mật khẩu?</span>
              <span onClick={() => this.handleAddNewUser()}>
                Đăng ký miến phí?
              </span>
            </div>

            <div className="text-center mt-3">
              <span className="text-other-login">hoặc:</span>
            </div>
            {/* <div className=" social-login">
              <i className="fab fa-google-plus-g google"></i>
            </div> */}
            <div className="col-12 social-login">
              <GoogleLogin
                className="GoogleLogin"
                clientId="677626076955-qfb1rsbrm6ijlue1cgd3cut5sav6426d.apps.googleusercontent.com"
                buttonText="Google"
                icon={true}
                // onSuccess={this.responseGoogle}
                // onFailure={this.responseGoogle}
                // cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
