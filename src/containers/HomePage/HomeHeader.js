import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";
import { withRouter } from "react-router";
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
    console.log(userInfo);
    return (
      <React.Fragment>
        <div className="home-header-container container-fluid">
          <div className="home-header-content row">
            <div className="left-content col-3">
              {/* <i className="fa-solid fa-bars"></i>
              <img className="header-logo" src={logo} /> */}
              <a href="/">Smart Booking Care</a>
              <div className="header-logo"></div>
            </div>
            <div className="center-content col-6">
              <div className="container">
                <div className="row">
                  {/* <div className="child-content col-4">
                    <div>
                      <b> Chuyên khoa</b>
                    </div>
                    <div className="subs-title">
                      Tìm kiếm bác sĩ theo chuyên khoa
                    </div>
                  </div>
                  <div className="child-content col-4">
                    <div>
                      <b>Cơ sở y tế</b>
                    </div>
                    <div className="subs-title">Chọn phòng khám/cơ sở y tế</div>
                  </div>
                  <div className="child-content col-4">
                    <div>
                      <b>Bác sĩ</b>
                    </div>
                    <div className="subs-title">Chọn bác sĩ giỏi</div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="right-content col-3">
              <div className="container-fluid">
                <div className="row">
                  <div className="support col-6">
                    <i className="fa-solid fa-circle-question"></i> Hỗ trợ
                  </div>
                  <div className="register col-6">
                    {userInfo ? (
                      <Dropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={this.toggle}
                        // direction={direction}
                      >
                        <DropdownToggle caret color="none" className="avatar">
                          {/* <img src="avatar.png" alt="Avatar" class="avatar" /> */}
                          <i className="fas fa-user-tie mx-3 avatar"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          {/* <DropdownItem header>Header</DropdownItem> */}
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
                      </Dropdown>
                    ) : (
                      <div>
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
