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
      previewImgURL: "",
      isOpenImage: false,
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

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = ["firstName", "lastName", "phonenumber", "address"];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        toast.warn("Vui lòng nhập đủ thông tin!");
        break;
      }
    }
    return isValid;
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
    // alert("Xác nhận lưu thông tin?");
    // console.log("check state:", this.state);
    let isValid = this.checkValidateInput();
    if (isValid === false) return;
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

  render() {
    let genders = this.state.genderArr;
    let { email, firstName, lastName, phonenumber, address, gender, image } =
      this.state;
    // const { userInfo } = this.props;
    // console.log("check:", this.props.userInfo);
    console.log("check user infor:", this.state);
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
            <div className="title col-12 mb-4">Hồ sơ của tôi</div>
            <div className="left-banner col-2  mt-5 ">
              {/* <div
                className="avata"
                style={{
                  backgroundImage: `url(${image ? image : "1"})`,
                }}
              ></div>

              <div>
                <span className="name ">
                  {lastName} {firstName}
                </span>
              </div> */}
            </div>
            <div className="right-banner col-8">
              <div className="container">
                <div className="row">
                  <div className="col-9 mt-5">
                    <Container>
                      <Row>
                        <div className="col-6 mt-4">
                          <label>Email</label>
                          {this.state.isEdit === true ? (
                            <input
                              type="email"
                              className="form-control mt-3"
                              value={email}
                              disabled
                            />
                          ) : (
                            <p className="userInfor w-100 w-100">{email}</p>
                          )}
                        </div>
                        <div className="col-6 mt-4"></div>
                        <div className="col-6 mt-4">
                          <label>Họ</label>
                          {this.state.isEdit === true ? (
                            <input
                              type="text"
                              className="form-control mt-3"
                              value={lastName}
                              onChange={(event) =>
                                this.onChangeInput(event, "lastName")
                              }
                            />
                          ) : (
                            <p className="userInfor w-100">{lastName}</p>
                          )}
                        </div>
                        <div className="col-6 mt-4">
                          <label>Tên</label>
                          {this.state.isEdit === true ? (
                            <input
                              type="text"
                              className="form-control mt-3"
                              value={firstName}
                              onChange={(event) =>
                                this.onChangeInput(event, "firstName")
                              }
                            />
                          ) : (
                            <p className="userInfor w-100">{firstName}</p>
                          )}
                        </div>

                        <div className="col-6 mt-4">
                          <label>Số điện thoại</label>
                          {this.state.isEdit === true ? (
                            <input
                              type="text"
                              className="form-control mt-3"
                              value={phonenumber}
                              onChange={(event) =>
                                this.onChangeInput(event, "phonenumber")
                              }
                            />
                          ) : (
                            <p className="userInfor w-100">{phonenumber}</p>
                          )}
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
                            <p className="userInfor w-100">
                              {/* {gender} */}
                              {gender === "F"
                                ? "Nữ"
                                : gender === "M"
                                ? "Nam"
                                : "Khác"}
                            </p>
                          )}
                        </div>

                        <div className="col-12 mt-4">
                          <label>Địa chỉ</label>
                          {this.state.isEdit === true ? (
                            <input
                              type="text"
                              className="form-control mt-3 "
                              value={address}
                              onChange={(event) =>
                                this.onChangeInput(event, "address")
                              }
                            />
                          ) : (
                            <p className="userInfor w-100">{address}</p>
                          )}
                        </div>

                        {/* button edit user infor */}
                        <div className="col-3 mt-4">
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
                        <div className="col-2 mt-4">
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
                        <div className="col-12 avatar-item mt-5">
                          {image ? (
                            <div
                              className="avata"
                              style={{
                                backgroundImage: `url(${image})`,
                              }}
                              onClick={() => this.openPreviewImage()}
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
