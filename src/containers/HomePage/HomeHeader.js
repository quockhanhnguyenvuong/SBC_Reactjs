import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";

// import logo from "../../assets/logo.svg.svg";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { processLogout, userInfo } = this.props;
    console.log(userInfo);
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              {/* <i className="fa-solid fa-bars"></i>
              <img className="header-logo" src={logo} /> */}
              <span>Smart Booking Care</span>
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
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
              <div className="child-content">
                <div>
                  <b>Bác sĩ</b>
                </div>
                <div className="subs-title">Chọn bác sĩ giỏi</div>
              </div>
              {/* <div className="child-content">
                <div>
                  <b>Gói khám</b>
                </div>
                <div className="subs-title">Khám sức khỏe tổng quát</div>
              </div> */}
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fa-solid fa-circle-question"></i> Hỗ trợ
              </div>
              <div className="register">
                {userInfo ? (
                  <div className="btn btn-logout" onClick={processLogout}>
                    <i className="fas fa-sign-out-alt mx-2"></i>Đăng xuất
                  </div>
                ) : (
                  <div>
                    <a href="/login" className="btn btn-register">
                      <i className="fas fa-sign-in-alt mx-2 "></i>Đăng nhập
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true &&
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">Nền tảng y tế</div>
              <div className="title2">Chăm sóc sức khỏe toàn diện</div>
              <div className="search">
                <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Tìm chuyên khoa khám bệnh" />
              </div>
            </div>
          </div>
        }

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
