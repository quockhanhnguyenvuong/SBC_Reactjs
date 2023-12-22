import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../../utils";
import { toast } from "react-toastify";
import {
  getAllClinic,
  deleteClinicService,
  editClinicService,
  createNewClinic,
} from "../../../services/userService";
import Lightbox from "react-image-lightbox";

const mdParser = new MarkdownIt(/* Markdown-it options*/);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicId: "",
      name: "",
      address: "",
      image: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      active: true,
      previewImgURL: "",
      arrClinic: [],
      isOpenImage: false,
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        arrClinic: res.data ? res.data : [],
        previewImgURL: "",
      });
    }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
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

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpenImage: true,
    });
  };

  handleFillClinicInfo = async (clinic) => {
    let imaBase64 = "";
    if (clinic.image) {
      imaBase64 = new Buffer(clinic.image, "base64").toString("binary");
    }

    this.setState({
      clinicId: clinic.id,
      name: clinic.name,
      address: clinic.address,
      descriptionMarkdown: clinic.descriptionMarkdown,
      image: clinic.image,
      previewImgURL: imaBase64,
      active: false,
    });
  };
  getResetState = () => {
    this.setState({
      clinicId: "",
      name: "",
      image: "",
      address: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      active: true,
      previewImgURL: "",
    });
  };

  saveNewClinic = async (data) => {
    let res = await createNewClinic(data);
    if (res && res.errCode === 0) {
      toast.success("Thêm mới phòng khám thành công!");
      this.getResetState();
      await this.getAllClinicFromReact();
    } else {
      toast.warn("Có lỗi, vui lòng kiểm tra lại...");
      console.log("...check state: ", res);
    }
  };

  editClinic = async (data) => {
    try {
      let res = await editClinicService(data);
      if (res && res.errCode === 0) {
        toast.success("Cập nhật phòng khám thành công !!!");
        await this.getAllClinicFromReact();
        this.getResetState();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleSaveClinic = async () => {
    // console.log("check data:", this.state);
    let { active } = this.state;
    if (active === true) {
      await this.saveNewClinic({
        id: this.state.clinicId,
        name: this.state.name,
        address: this.state.address,
        image: this.state.image,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
      });
    } else {
      await this.editClinic({
        id: this.state.clinicId,
        name: this.state.name,
        address: this.state.address,
        image: this.state.image,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
      });
    }
  };

  getAllClinicFromReact = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        arrClinic: res.data ? res.data : [],
      });
    }
  };

  handleDeleteClinic = async (data) => {
    // console.log("click delete", clinic.id);
    try {
      let res = await deleteClinicService(data.id);
      if (res && res.errCode === 0) {
        toast.success("Xóa phòng khám thành công !!!");
        await this.getAllClinicFromReact();
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    let arrClinic = this.state.arrClinic;
    // console.log("check data clinic:", arrClinic);

    return (
      <div className="manage-clinic-container mb-4 container">
        <div className="add-new-clinic row">
          {this.state.isOpenImage === true && (
            <Lightbox
              mainSrc={this.state.image}
              onCloseRequest={() => this.setState({ isOpenImage: false })}
            />
          )}
          <div className="title col-12">Quản lý phòng khám</div>
          <div className="col-6">
            <div className="col-12 form-group mt-2">
              <label>Tên phòng khám</label>
              <input
                className="form-control"
                type="text"
                value={this.state.name}
                onChange={(event) => this.handleOnChangeInput(event, "name")}
              />
            </div>
            <div className="col-12 form-group mt-4">
              <label>Địa chỉ phòng khám</label>
              <input
                className="form-control"
                type="text"
                value={this.state.address}
                onChange={(event) => this.handleOnChangeInput(event, "address")}
              />
            </div>
          </div>

          <div className="col-3 form-group mt-2">
            <div className="d-flex justify-content-between">
              <label>Ảnh phòng khám </label>
              <input
                type="file"
                hidden
                id="previewImage"
                className="form-control "
                onChange={(event) => this.handleOnChangeImage(event)}
              />
              <label htmlFor="previewImage" className="lb-upload-image">
                Tải ảnh <i className="fas fa-images"></i>
              </label>
            </div>
            <div
              className="preview-image"
              style={{
                backgroundImage: `url(${this.state.image})`,
                backgroundSize: "contain",
                height: "90px",
                borderRadius: "5px",
              }}
              onClick={() => this.openPreviewImage()}
            ></div>
          </div>

          <div className="col-12 mt-4">
            <MdEditor
              style={{ height: "450px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className={
                this.state.active === true
                  ? "btn-save-clinic btn btn-primary"
                  : "btn-save-clinic btn btn-info"
              }
              onClick={() => this.handleSaveClinic()}
            >
              <span className="mx-2">
                {this.state.active === true
                  ? "Lưu phòng khám mới"
                  : " Lưu thay đổi"}
              </span>
            </button>
            <button
              className="btn btn-danger px-2 mx-1"
              onClick={() => this.getResetState()}
            >
              Hũy
            </button>
          </div>

          <div className="clinics-table mt-3 col-12">
            <table id="clinics">
              <tr>
                <th>STT</th>
                <th colSpan="3">Tên phòng khám</th>
                <th colSpan="4">Địa chỉ</th>
                <th colSpan="3">Ảnh</th>
                <th colSpan="1">Action</th>
              </tr>
              <tbody>
                {arrClinic && arrClinic.length > 0 ? (
                  arrClinic.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td colSpan="3">{item.name}</td>
                        <td colSpan="4">{item.address}</td>
                        <td colSpan="3">
                          <div
                            className="preview-image"
                            style={{
                              backgroundImage: `url(${item.image})`,
                              backgroundSize: "contain",
                              width: "80px",
                            }}
                          ></div>
                        </td>
                        <td colSpan="1">
                          <button
                            className="btn-edit"
                            onClick={() => this.handleFillClinicInfo(item)}
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              this.handleDeleteClinic(item);
                            }}
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="no-data">
                      Chưa có phòng khám nào hết!!!
                    </td>
                  </tr>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
