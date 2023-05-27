import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";
import { handleLoginGmail } from '../../services/userService';
import GoogleLogin from 'react-google-login';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
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

      console.log("smart booking care", e.response);
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

  responseGoogle = async(da) => {
    let data = await handleLoginGmail(this.state.username, this.state.password);
    this.props.userLoginSuccess(data.user);
    console.log("login succeeds");
    // try {
    //   let data = await handleLoginGmail(this.state.username, this.state.password);
    //   if (data && data.errCode !== 0) {
    //     this.setState({
    //       errMessage: data.message,
    //     });
    //   }
    //   if (data && data.errCode === 0) {
    //     this.props.userLoginSuccess(data.user);
    //     console.log("login succeeds");
    //   }
    // } catch (e) {
    //   if (e.response) {
    //     if (e.response.data) {
    //       this.setState({
    //         errMessage: e.response.data.message,
    //       });
    //     }
    //   }
    // }
}
  handleForgotPassword = () =>{
    window.location = "http://localhost:3000/forget-password"
  }

  render() {
    return (
      <div className="login-backgroud">
        <div className="login-container">
          <div className="login-content">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group">
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={(event) => this.handleOnChangeUsername(event)}
              />
            </div>
            <div className="col-12 form-group">
              <label>Password:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            <div className="col-12" style={{ color: "red" }}>
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Log In
              </button>
            </div>
            <div className="col-12">
              <button className='forget-password'
                  onClick={() => this.handleForgotPassword()}>Forgot your password?
              </button>
            </div>
            <div className="col-12 text-center mt-3">
              <span className="text-other-login">Or Login With:</span>
            </div>
            <div className="col-12 social-login">
              <GoogleLogin
                  className="GoogleLogin" 
                  clientId="677626076955-qfb1rsbrm6ijlue1cgd3cut5sav6426d.apps.googleusercontent.com"
                  buttonText="Google"
                  icon={true}
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
  };
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
