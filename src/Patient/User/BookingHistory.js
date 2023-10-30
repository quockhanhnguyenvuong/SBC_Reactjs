import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../containers/HomePage/HomeHeader";
import "./BookingHistory.scss";
import { getAllUsers } from "../../services/userService";
import { CommonUtils } from "../../utils";
import Lightbox from "react-image-lightbox";

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      previewImgURL: "",
      isOpenImage: false,
    };
  }

  componentDidMount() {}
  // open preview image
  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpenImage: true,
    });
  };
  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        image: base64,
      });
    }
  };
  getAllUserFromReact = async () => {
    let response = await getAllUsers(this.props.userInfo.id);
    if (response && response.errCode === 0) {
      this.setState({
        arrUser: response.users,
      });
    }
  };
  getUserInfor = () => {
    this.setState({
      // userId: this.state.arrUser.id,
      // email: this.state.arrUser.email,
      firstName: this.state.arrUser.firstName,
      lastName: this.state.arrUser.lastName,
      // phonenumber: this.state.arrUser.phonenumber,
      // address: this.state.arrUser.address,
      // gender: this.state.arrUser.gender,
      image: this.state.arrUser.image,
    });
  };
  render() {
    console.log("check user infor", this.props.userInfo);
    let { firstName, lastName, image } = this.state;
    return (
      <div className="banner-container">
        <HomeHeader />
        {this.state.isOpenImage === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpenImage: false })}
          />
        )}
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 title mb-4">Lịch sử của tôi</div>
            {/* left banner */}
            {/* <div className="left-banner col-3 mt-5 ">
              <div
                className="avata"
                style={{
                  backgroundImage: `url(${image ? image : "1"})`,
                }}
              ></div>
              <div>
                <span className="name mx-4">
                  {this.props.userInfo.firstName} {this.props.userInfo.lastName}
                </span>
              </div>
            </div> */}
            {/* right banner */}
            {/* <div className="center-banner col-8"></div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingHistory);
