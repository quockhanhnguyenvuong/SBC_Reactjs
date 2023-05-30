import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";
import { withRouter } from "react-router";
import { USER_ROLE } from "../../utils";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// import logo from "../../assets/logo.svg.svg";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    const { processLogout, userInfo } = this.props;
    console.log("user info:", userInfo);
    return (
      <React.Fragment>
        <div className="home-header-container container-fluid">
          <div className="home-header-content row">
            <div className="left-content col-8">
              {/* <i className="fa-solid fa-bars"></i>
              <img className="header-logo" src={logo} /> */}
              <div className="header-logo"></div>
              <a href="/">Smart Booking Care</a>
            </div>
            <div className="right-content col-4">
              <div className="container-fluid">
                <div className="row">
                  <div className="support col-4">
                    {/* <i className="fa-solid fa-circle-question "></i> Hỗ trợ */}
                  </div>
                  <div className="register col-6">
                    {userInfo ? (
                      userInfo.roleId === USER_ROLE.PATIENT ? (
                        <Dropdown
                          isOpen={this.state.dropdownOpen}
                          toggle={this.toggle}
                          // direction={direction}
                        >
                          <DropdownToggle caret color="none">
                            {/* <i className="fas fa-user-tie mx-3 avatar"></i> */}
                            {this.props.userInfo.firstName}
                          </DropdownToggle>
                          <DropdownMenu>
                            {/* <DropdownItem header>Header</DropdownItem> */}
                            <DropdownItem>
                              <a href="/home/detail-user/">Tài khoản của tôi</a>
                            </DropdownItem>
                            {/* <DropdownItem>
                            <a href="/home/history-user/">Lịch sử của tôi</a>
                          </DropdownItem> */}
                            <DropdownItem>
                              <a href="/home/change-password/">Đổi mật khẩu</a>
                            </DropdownItem>
                            <DropdownItem>
                              <div
                                className="btn btn-logout"
                                onClick={processLogout}
                              >
                                <i className="fas fa-sign-out-alt "></i> Đăng
                                xuất
                              </div>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <Dropdown
                          isOpen={this.state.dropdownOpen}
                          toggle={this.toggle}
                          // direction={direction}
                        >
                          <DropdownToggle caret color="none">
                            {/* <i className="fas fa-user-tie mx-3 avatar"></i> */}
                            {this.props.userInfo.firstName}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>
                              <a href="/doctor/">Quản lý khám bệnh</a>
                            </DropdownItem>
                            <DropdownItem>
                              <div
                                className="btn btn-logout"
                                onClick={processLogout}
                              >
                                <i className="fas fa-sign-out-alt "></i> Đăng
                                xuất
                              </div>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )
                    ) : (
                      <div>
                        <a href="/login" className="btn btn-register">
                          <i className="fas fa-sign-in-alt"></i> Đăng nhập
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="col-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
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
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
