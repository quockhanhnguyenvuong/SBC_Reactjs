import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailUser.scss";
import HomeHeader from "../../containers/HomePage/HomeHeader";
import { Container, Row } from "reactstrap";
import { getAllCodeService, editUserService } from "../../services/userService";
import { toast } from "react-toastify";
import { getAllUsers } from "../../services/userService";
import { CommonUtils } from "../../utils";
import Lightbox from "react-image-lightbox";

class DetailUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genderArr: [],
      gender: "",
      isEdit: false,

      userId: "",
      email: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      address: "",
      gender: "",
      image: "",

      arrUser: {},
    };
  }

  async componentDidMount() {
    await this.getAllUserFromReact();
    this.getUserInfor();
    await this.getGenderFormReact();
    let genderArr = this.state.genderArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : "",
    });
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
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
      userId: this.state.arrUser.id,
      email: this.state.arrUser.email,
      firstName: this.state.arrUser.firstName,
      lastName: this.state.arrUser.lastName,
      phonenumber: this.state.arrUser.phonenumber,
      address: this.state.arrUser.address,
      gender: this.state.arrUser.gender,
      image: this.state.arrUser.image,
    });
  };
  //change cancel
  handleCancel = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };
  //change edit
  handleChangeEditUser = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  // edit user
  editUser = async (user) => {
    try {
      let res = await editUserService(user);
      if (res && res.errCode === 0) {
        toast.success("Lưu thành công!");
        this.setState({
          isEdit: !this.state.isEdit,
        });
      } else {
        toast.error("Lưu thất bại, vui lòng thử lại!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleEditUser = async () => {
    await this.editUser({
      id: this.state.userId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      phonenumber: this.state.phonenumber,
      gender: this.state.gender,
      image: this.state.image,
    });
  };

  // get value input
  onChangeInput = (event, id) => {
    // console.log(event.target.value);
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  // load gender
  getGenderFormReact = async () => {
    let response = await getAllCodeService("gender");
    if (response && response.errCode === 0) {
      this.setState({
        genderArr: response.data,
      });
    }
  };

  handleGetCurrentPosition = async () => {
    let textConfirm = "Cho phép hệ thống truy cập vị trí ?";
    if (window.confirm(textConfirm) === true) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},
                ${longitude}&key=${"AIzaSyAyQEOM66oqAYAXSCPgZH-ayZwi2RYexlA"}`,
              );
              if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                  const address = data.results[0].formatted_address;

                  // Cập nhật địa chỉ vào state
                  this.setState({
                    address: address,
                  });

                  this.performBookingWithAddress();
                } else {
                  console.error("Không thể lấy được địa chỉ từ tọa độ.");
                }
              } else {
                console.error("Lỗi khi lấy địa chỉ từ tọa độ.");
              }
            } catch (error) {
              console.error("Lỗi xảy ra trong quá trình lấy địa chỉ:", error);
            }
          },
          // (error) => {
          //   console.error("Lỗi khi lấy vị trí người dùng:", error);
          // }
        );
      } else {
        console.error("Trình duyệt không hỗ trợ geolocation.");
      }
    } else {
      toast.warn("Vui lòng cho phép truy cập vị trí trước khi đặt lịch!");
    }
  };

  render() {
    let genders = this.state.genderArr;
    let { email, firstName, lastName, phonenumber, address, gender, image } =
      this.state;
    // const { userInfo } = this.props;
    // console.log("check:", this.props.userInfo);
    // console.log("check user infor:", this.state.arrUser);
    return (
      <div className="banner-container">
        <HomeHeader />
        {/* Image Lightbox */}
        {this.state.isOpenImage === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpenImage: false })}
          />
        )}
        <div className="container mt-5">
          <div className="row">
            <div className="left-banner col-2  mt-5 "></div>
            <div className="right-banner col-8">
              <div className="container">
                <div className="row">
                  <div className="title col-12 mb-4">Hồ sơ của tôi</div>
                  <div className="col-9 mt-2">
                    <Container>
                      <Row>
                        <div className="col-6 mt-2">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control mt-3"
                            value={email}
                            disabled={true}
                          />
                        </div>
                        <div className="col-6 mt-4"></div>
                        <div className="col-6 mt-4">
                          <label>Họ</label>
                          <input
                            type="text"
                            className="form-control mt-3"
                            value={lastName}
                            onChange={(event) =>
                              this.onChangeInput(event, "lastName")
                            }
                            disabled={
                              this.state.isEdit === false ? true : false
                            }
                          />
                        </div>
                        <div className="col-6 mt-4">
                          <label>Tên</label>
                          <input
                            type="text"
                            className="form-control mt-3"
                            value={firstName}
                            onChange={(event) =>
                              this.onChangeInput(event, "firstName")
                            }
                            disabled={
                              this.state.isEdit === false ? true : false
                            }
                          />
                        </div>

                        <div className="col-6 mt-4">
                          <label>Số điện thoại</label>
                          <input
                            type="text"
                            className="form-control mt-3"
                            value={phonenumber}
                            onChange={(event) =>
                              this.onChangeInput(event, "phonenumber")
                            }
                            disabled={
                              this.state.isEdit === false ? true : false
                            }
                          />
                        </div>

                        <div className="col-3 mt-4">
                          <label>Giới tính </label>
                          {this.state.isEdit === true ? (
                            <select
                              className="form mt-3"
                              value={gender}
                              onChange={(event) => {
                                this.onChangeInput(event, "gender");
                              }}
                            >
                              {genders &&
                                genders.length > 0 &&
                                genders.map((item, index) => {
                                  return (
                                    <option
                                      selected
                                      key={index}
                                      value={item.keyMap}
                                      onChange={(event) => {
                                        this.onChangeInput(event, "gender");
                                      }}
                                    >
                                      {item.valueVI}
                                    </option>
                                  );
                                })}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control mt-3"
                              value={
                                gender === "F"
                                  ? "Nữ"
                                  : gender === "M"
                                  ? "Nam"
                                  : "Khác"
                              }
                              disabled
                            />
                          )}
                        </div>

                        <div className="col-12 mt-4">
                          <label>Địa chỉ</label>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control mt-3 "
                              value={address}
                              onChange={(event) =>
                                this.onChangeInput(event, "address")
                              }
                              disabled={
                                this.state.isEdit === false ? true : false
                              }
                            />
                            <i
                              class="fa-solid fa-map-location-dot "
                              style={{
                                position: "relative",
                                top: "23px",
                                left: "-23px",
                              }}
                              onClick={() => this.handleGetCurrentPosition()}
                              hidden={
                                this.state.isEdit === false ? true : false
                              }
                            ></i>
                          </div>
                        </div>

                        {/* button edit user infor */}
                        <div className="col-4 mt-5">
                          {this.state.isEdit === false ? (
                            <button
                              className="btn btn-info px-3"
                              style={{ overflow: "hidden" }}
                              onClick={() => this.handleChangeEditUser()}
                            >
                              Sửa thông tin
                            </button>
                          ) : (
                            <button
                              className="btn btn-success px-3"
                              onClick={() => this.handleEditUser()}
                            >
                              Lưu thông tin
                            </button>
                          )}
                        </div>
                        <div className="col-2 mt-5">
                          <button
                            className="btn btn-warning px-3"
                            onClick={
                              this.state.isEdit === true
                                ? () => this.handleCancel()
                                : null
                            }
                          >
                            Hũy
                          </button>
                        </div>
                      </Row>
                    </Container>
                  </div>
                  {/* upload image */}
                  <div className="col-3">
                    <Container>
                      <Row>
                        <div className="col-12 avatar-item mt-1">
                          {image ? (
                            <div
                              className="avata"
                              style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: "cover",
                              }}
                            ></div>
                          ) : (
                            <div className="preview-image">
                              <i className="far fa-images"></i>
                            </div>
                          )}
                          <div>
                            <input
                              type="file"
                              hidden
                              id="previewImage"
                              className="form-control "
                              onChange={(event) =>
                                this.handleOnChangeImage(event)
                              }
                            />
                            {this.state.isEdit === false ? (
                              ""
                            ) : (
                              <label
                                htmlFor="previewImage"
                                className="lb-upload-image"
                              >
                                Tải ảnh <i class="fas fa-images"></i>
                              </label>
                            )}
                          </div>
                        </div>
                      </Row>
                    </Container>
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailUser);
