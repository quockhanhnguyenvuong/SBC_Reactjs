import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailUser.scss";
import HomeHeader from "../../containers/HomePage/HomeHeader";
import { Container, Row } from "reactstrap";
import { getAllCodeService, editUserService } from "../../services/userService";
import { toast } from "react-toastify";

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
      // image: "",
    };
  }

  async componentDidMount() {
    this.getUserInfor();
    await this.getGenderFormReact();
    let genderArr = this.state.genderArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : "",
    });
  }
  getUserInfor = () => {
    this.setState({
      userId: this.props.userInfo.id,
      email: this.props.userInfo.email,
      firstName: this.props.userInfo.firstName,
      lastName: this.props.userInfo.lastName,
      phonenumber: this.props.userInfo.phonenumber,
      address: this.props.userInfo.address,
      gender: this.props.userInfo.gender,
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
      // image: this.state.image,
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
    let { email, firstName, lastName, phonenumber, address, gender } =
      this.state;
    // const { userInfo } = this.props;
    // console.log("check:", userInfo);
    return (
      <div className="banner-container">
        <HomeHeader />
        <div className="container mt-5">
          <div className="row">
            <div className="title col-12 mb-4">Hồ sơ của tôi</div>
            <div className="left-banner col-3  mt-5 ">
              {/* <img src="avatar.png" alt="Avatar" className="avatar" /> */}
              <div className="avatar mb-4">
                <i class="far fa-user-circle"></i>
              </div>
              <div>
                <span className="name mx-4">
                  {this.state.lastName} {this.state.firstName}
                </span>
              </div>
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
                          <div
                            className="preview-image"
                            style={{
                              backgroundImage: `url(${this.state.previewImgURL})`,
                            }}
                            // onClick={() => this.openPreviewImage()}
                          >
                            <i className="far fa-images"></i>
                          </div>
                          <div>
                            <input
                              type="file"
                              hidden
                              id="previewImage"
                              className="form-control "
                              // onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label
                              htmlFor="previewImage"
                              className="lb-upload-image"
                            >
                              Tải ảnh <i class="fas fa-images"></i>
                            </label>
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
