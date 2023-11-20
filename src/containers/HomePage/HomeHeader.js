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
import { getAllUsers } from "../../services/userService";

import logo from "../../assets/images/logo7.png";
// import logo from "../../assets/images/nursing home.png";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      arrUser: {},
      userId: "",
    };
  }

  async componentDidMount() {
    const { userInfo } = this.props;
    if (userInfo) await this.getAllUserFromReact();
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  getAllUserFromReact = async () => {
    let response = await getAllUsers(this.props.userInfo.id);
    if (response && response.errCode === 0) {
      this.setState({
        arrUser: response.users,
      });
    }
  };

  render() {
    const { processLogout, userInfo } = this.props;
    // console.log("check user data:", this.state.arrUser);
    // console.log("check userInfo:", userInfo);
    return (
      <React.Fragment>
        <div className="home-header-container container-fluid">
          <div className="home-header-content row">
            <div className="left-content col-3">
              <a href="/">
                <img
                  className="header-logo"
                  src={logo}
                  style={{
                    width: "160px",
                    position: "absolute",
                    top: "-40px",
                    left: "75px",
                    zIndex: "1",
                    cursor: "pointer",
                  }}
                />
                <p style={{ paddingTop: "12px" }}>BookingDoctor</p>
              </a>
            </div>
            <div className="center-content col-7">
              <div className="child-content">
                <div>
                  <b>Bác sĩ</b>
                </div>
                <div className="subs-title">Danh sách bác sĩ</div>
              </div>
              <a href="/detail-specialty-all">
                <div className="child-content">
                  <div>
                    <b>Chuyên khoa</b>
                  </div>
                  <div className="subs-title">Chuyên khoa phổ biến</div>
                </div>
              </a>
              <div className="child-content">
                <div>
                  <b>Cơ sở y tế</b>
                </div>
                <div className="subs-title">Cơ sở y tế nổi bật</div>
              </div>
              <div className="child-content" style={{ margin: "0" }}>
                <div className="search">
                  <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                  <input type="text" placeholder="Tìm chuyên khoa" />
                </div>
              </div>
            </div>
            <div className="right-content col-2">
              <div className="register">
                {userInfo ? (
                  <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggle}
                  >
                    <DropdownToggle
                      caret
                      color="none"
                      onFocus={true}
                      className="name d-flex align-items-center"
                      style={{ marginBottom: "2px" }}
                    >
                      {/* avatar */}
                      <div
                        className="avatar"
                        style={{
                          backgroundImage: `url(${userInfo.image})`,
                          backgroundSize: "contain",
                        }}
                      ></div>
                      {/*  */}
                      {/* <div className="avatar">
                        <i className="fas fa-user-tie"></i>
                      </div> */}
                      {userInfo.firstName}
                    </DropdownToggle>
                    {userInfo.roleId === USER_ROLE.PATIENT ? (
                      <DropdownMenu>
                        <DropdownItem>
                          <a href="/home/detail-user/">Tài khoản của tôi</a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href="/home/history-user/">Lịch sử của tôi</a>
                        </DropdownItem>
                        <DropdownItem>
                          <a href="/home/change-password/">Đổi mật khẩu</a>
                        </DropdownItem>
                        <DropdownItem>
                          <div
                            className="btn btn-logout"
                            onClick={processLogout}
                          >
                            <i className="fas fa-sign-out-alt "></i> Đăng xuất
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
                            <i className="fas fa-sign-out-alt "></i> Đăng xuất
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
                            <i className="fas fa-sign-out-alt "></i> Đăng xuất
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
