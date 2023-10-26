import React, { Component } from "react";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  deleteUserService,
  getAllCodeService,
  createNewUserService,
  editUserService,
} from "../../../services/userService";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { toast } from "react-toastify";
import { CommonUtils } from "../../../utils";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      userEdit: {},
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpenImage: false,
      active: true,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      address: "",
      gender: "",
      roleID: "",
      positionID: "",
      image: "",
      userId: "",
    };
  }

  getSetState = () => {
    this.setState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      address: "",
      gender: "",
      roleID: "",
      positionID: "",
      image: "",
      active: true,
    });
  };
  async componentDidMount() {
    await this.getAllUserFromReact();
    await this.getGenderFormReact();
    await this.getPositionFormReact();
    await this.getRoleFormReact();
    //get default value for gender,role,position
    let genderArr = this.state.genderArr;
    let roleArr = this.state.roleArr;
    let positionArr = this.state.positionArr;
    this.setState({
      gender: genderArr && genderArr.length > 0 ? genderArr[0].keyMap : "",
      roleID: roleArr && roleArr.length > 0 ? roleArr[0].keyMap : "",
      positionID:
        positionArr && positionArr.length > 0 ? positionArr[0].keyMap : "",
      previewImgURL: "",
    });
  }

  // load role
  getRoleFormReact = async () => {
    let response = await getAllCodeService("role");
    if (response && response.errCode === 0) {
      this.setState({
        roleArr: response.data,
      });
    }
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
  // load position
  getPositionFormReact = async () => {
    let response = await getAllCodeService("position");
    if (response && response.errCode === 0) {
      this.setState({
        positionArr: response.data,
      });
    }
  };
  // load all users
  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  };

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

  // get value input
  onChangInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = ["email", "password", "firstName", "lastName"];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        toast.warn("Vui lòng nhập đầy đủ thông tin!");
        break;
      }
    }
    return isValid;
  };
  // create user
  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      console.log("create user: ", data);
      if (response && response.errCode !== 0) {
        if (response && response.errCode === 1) {
          toast.error("Email đã được sử dụng, vui lòng nhập email khác !!!");
        }
      } else {
        toast.success("Tạo người dùng mới thành công !!!");
        this.getSetState();
        await this.getAllUserFromReact();
      }
    } catch (e) {
      console.log(e);
    }

    console.log("check data from child :", data);
  };

  // edit user
  editUser = async (user) => {
    try {
      let res = await editUserService(user);
      if (res && res.errCode === 0) {
        await this.getAllUserFromReact();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //fill info user , handleEditUesrFromParent
  handleFillUserInfo = async (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    this.setState({
      userId: user.id,
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      phonenumber: user.phonenumber,
      address: user.address,
      gender: user.gender,
      roleID: user.roleID,
      positionID: user.positionID,
      image: user.image,
      previewImgURL: imageBase64,
      active: false,
    });
  };

  // function create and edit new user
  handleSaveUser = async () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { active } = this.state;
    if (active === true) {
      // create new user
      await this.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phonenumber,
        gender: this.state.gender,
        roleID: this.state.roleID,
        positionID: this.state.positionID,
        image: this.state.image,
      });
    } else {
      // edit user
      await this.editUser({
        id: this.state.userId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phonenumber,
        gender: this.state.gender,
        roleID: this.state.roleID,
        positionID: this.state.positionID,
        image: this.state.image,
      });

      toast.success("Cập nhật thành công !!!");
      await this.getAllUserFromReact();
    }
    this.getSetState();
  };

  // delete user
  handleDeleteUser = async (user) => {
    console.log("click delete", user);
    try {
      let res = await deleteUserService(user.id);
      if (res && res.errCode === 0) {
        toast.success("Xóa người dùng thành công !!!");
        await this.getAllUserFromReact();
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    let arrUsers = this.state.arrUsers;
    let genders = this.state.genderArr;
    let positionArr = this.state.positionArr;
    let roleArr = this.state.roleArr;

    let {
      email,
      password,
      firstName,
      lastName,
      phonenumber,
      address,
      gender,
      roleID,
      positionID,
      image,
    } = this.state;
    return (
      <div className="user-container container">
        <div className="row">
          {/* Image Lightbox */}
          {this.state.isOpenImage === true && (
            <Lightbox
              mainSrc={this.state.previewImgURL}
              onCloseRequest={() => this.setState({ isOpenImage: false })}
            />
          )}
          <div className="title text-center col-12">Quản lý người dùng</div>
          {/* table fill infomation user */}
          <div className="user-body col-12">
            <div className="container">
              <div className="row">
                <div className="col-3 mt-4">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => {
                      this.onChangInput(event, "email");
                    }}
                    disabled={this.state.active === false}
                  />
                </div>
                <div className="col-3 mt-4">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => {
                      this.onChangInput(event, "password");
                    }}
                    disabled={this.state.active === false}
                  />
                </div>
                <div className="col-3 mt-4">
                  <label>Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(event) => {
                      this.onChangInput(event, "firstName");
                    }}
                  />
                </div>
                <div className="col-3 mt-4">
                  <label>Họ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(event) => {
                      this.onChangInput(event, "lastName");
                    }}
                  />
                </div>
                <div className="col-3 mt-4">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phonenumber}
                    onChange={(event) => {
                      this.onChangInput(event, "phonenumber");
                    }}
                  />
                </div>
                <div className="col-9 mt-4">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(event) => {
                      this.onChangInput(event, "address");
                    }}
                  />
                </div>
                <div className="col-3 mt-4">
                  <label>Giới tính </label>
                  <select
                    className="form"
                    value={gender}
                    onChange={(event) => {
                      this.onChangInput(event, "gender");
                    }}
                  >
                    {genders &&
                      genders.length > 0 &&
                      genders.map((item, index) => {
                        return (
                          <option selected key={index} value={item.keyMap}>
                            {item.valueVI}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-3 mt-4">
                  <label>Chức vụ</label>
                  <select
                    value={positionID}
                    className="form"
                    onChange={(event) => {
                      this.onChangInput(event, "positionID");
                    }}
                  >
                    {positionArr &&
                      positionArr.length > 0 &&
                      positionArr.map((item, index) => {
                        return (
                          <option selected key={index} value={item.keyMap}>
                            {item.valueVI}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-3 mt-4">
                  <label>Vai trò</label>
                  <select
                    value={roleID}
                    className="form"
                    onChange={(event) => {
                      this.onChangInput(event, "roleID");
                    }}
                  >
                    {roleArr &&
                      roleArr.length > 0 &&
                      roleArr.map((item, index) => {
                        return (
                          <option selected key={index} value={item.keyMap}>
                            {item.valueVI}
                          </option>
                        );
                      })}
                  </select>
                </div>
                {/* upload image */}
                <div className="col-3 mt-4">
                  <label>Ảnh đại diện</label>
                  <div>
                    <input
                      type="file"
                      hidden
                      id="previewImage"
                      className="form-control "
                      onChange={(event) => this.handleOnChangeImage(event)}
                    />
                    <label htmlFor="previewImage" className="lb-upload-image">
                      Tải ảnh <i class="fas fa-images"></i>
                    </label>
                    <div
                      className="preview-image"
                      style={{
                        backgroundImage: `url(${this.state.previewImgURL})`,
                      }}
                      onClick={() => this.openPreviewImage()}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* button add new user */}
          <div className="customer-add-user mx-3 col-12">
            <button
              className={
                this.state.active === true
                  ? "btn-add px-3 btn btn-primary"
                  : "btn-add2 px-3 btn "
              }
              onClick={() => this.handleSaveUser()}
            >
              {this.state.active === true ? (
                <i class="fas fa-user-plus mx-2"></i>
              ) : (
                <i class="fas fa-user-edit"></i>
              )}

              <span className="mx-2">
                {this.state.active === true
                  ? "Lưu người dùng mới"
                  : " Lưu thay đổi"}
              </span>
            </button>
          </div>
          {/* table user manage */}
          <div className="users-table mt-3 mx-3 col-12">
            <table id="customers">
              <tr>
                <th>Tên người dùng</th>
                <th>Tên</th>
                <th>Họ</th>
                <th>Vai trò</th>
                <th>Action</th>
              </tr>
              <tbody>
                {arrUsers &&
                  arrUsers.map((item, index) => {
                    return (
                      <tr>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>
                          {item.roleID === "R1"
                            ? "Quản trị viên"
                            : item.roleID === "R2"
                            ? "Bác sĩ"
                            : "Bệnh nhân"}
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => this.handleFillUserInfo(item)}
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              this.handleDeleteUser(item);
                            }}
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);