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

import logo from "../../assets/images/logo4.png";

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
            <div className="left-content col-3 mt-3">
              <img
                className="header-logo"
                src={logo}
                style={{
                  width: "150px",
                  height: "160px",
                  position: "absolute",
                  left: "10px",
                }}
              />
              {/* <i class="fas fa-laptop-medical"></i> */}
              <a href="/">Booking Doctor</a>
            </div>
            <div className="center-content col-7">
              <div className="child-content">
                <div>
                  <b>Bác sĩ</b>
                </div>
                <div className="subs-title">Chọn bác sĩ giỏi</div>
              </div>
              <div className="child-content">
                <div>
                  <b> Chuyên khoa</b>
                </div>
                <div className="subs-title">
                  Tìm kiếm bác sĩ theo chuyên khoa
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>Cơ sở y tế</b>
                </div>
                <div className="subs-title">Chọn phòng khám/cơ sở y tế</div>
              </div>
            </div>
            <div className="right-content col-2">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-4"></div>
                  <div className="register col-8">
                    {userInfo ? (
                      <Dropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={this.toggle}
                      >
                        <DropdownToggle caret color="none" className="name">
                          {/* <i className="fas fa-user-tie mx-3 avatar"></i> */}
                          {this.props.userInfo.firstName}
                        </DropdownToggle>
                        {userInfo.roleId === USER_ROLE.PATIENT ? (
                          <DropdownMenu>
                            {/* <DropdownItem header>Header</DropdownItem> */}
                            <DropdownItem>
                              <a href="/home/detail-user/">Tài khoản của tôi</a>
                            </DropdownItem>
                            <DropdownItem>
                              {/* <a href="/home/history-user/">Lịch sử của tôi</a> */}
                              <a href="">Lịch sử của tôi</a>
                            </DropdownItem>
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
                        ) : userInfo.roleId === USER_ROLE.DOCTOR ? (
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
                        ) : (
                          <DropdownMenu>
                            <DropdownItem>
                              <a href="/doctor/">Quản lý hệ thống</a>
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
                        )}
                      </Dropdown>
                    ) : (
                      <div className="login">
                        <a href="/login" className="btn btn-register">
                          <i className="fas fa-sign-in-alt"></i> Đăng nhập
                        </a>
                      </div>
                    )}
                  </div>
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
