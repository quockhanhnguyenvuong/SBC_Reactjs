import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";
import { USER_ROLE } from "../../utils";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "../../assets/images/logo9.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// import { withRouter } from "react-router";
// import logo from "../../assets/images/nursing home.png";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      image: "",
    };
  }

  async componentDidMount() {}

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    const { processLogout, userInfo } = this.props;

    console.log("check userInfo:", userInfo);
    return (
      <React.Fragment>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="/">
              <img
                className="header-logo"
                src={logo}
                style={{
                  width: "90px",
                }}
              />
              <p style={{ paddingTop: "13px" }}>BookingDoctor</p>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link href="/home/detail-doctor-all">
                  <div className="child-content">
                    <div>
                      <b>Bác sĩ</b>
                    </div>
                    <div className="subs-title">Chọn bác sĩ giỏi</div>
                  </div>
                </Nav.Link>
                <Nav.Link href="/home/detail-specialty-all">
                  <div className="child-content">
                    <div>
                      <b>Chuyên khoa</b>
                    </div>
                    <div className="subs-title">
                      Tìm bác sĩ theo chuyên khoa
                    </div>
                  </div>
                </Nav.Link>
                <Nav.Link href="/home/detail-clinic-all">
                  <div className="child-content">
                    <div>
                      <b>Cơ sở y tế</b>
                    </div>
                    <div className="subs-title">Chọn phòng khám/cơ sở y tế</div>
                  </div>
                </Nav.Link>

                {userInfo ? (
                  <div className="register">
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
                            backgroundSize: "cover",
                          }}
                        ></div>
                        {userInfo.firstName}
                      </DropdownToggle>
                      {userInfo.roleId === USER_ROLE.PATIENT ? (
                        <DropdownMenu>
                          <DropdownItem>
                            <a href="/home/detail-user/">Tài khoản của tôi</a>
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
                  </div>
                ) : (
                  <Nav.Link href="/login">
                    <div className="child-content">
                      <div className="login">
                        <i className="fas fa-sign-in-alt"></i> Đăng nhập
                      </div>
                    </div>
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
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
