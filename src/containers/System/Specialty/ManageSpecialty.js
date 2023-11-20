import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../../utils";
import { toast } from "react-toastify";
import {
  getAllSpecialty,
  createNewSpecialty,
  deleteSpecialtyService,
  editSpecialtyService,
} from "../../../services/userService";
import Lightbox from "react-image-lightbox";

const mdParser = new MarkdownIt(/* Markdown-it options*/);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialtyId: "",
      name: "",
      image: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      active: true,
      previewImgURL: "",
      arrSpecialty: [],
      isOpenImage: false,
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialty: res.data ? res.data : [],
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

  handleFillSpecialtyInfo = async (specialty) => {
    let imaBase64 = "";
    if (specialty.image) {
      imaBase64 = new Buffer(specialty.image, "base64").toString("binary");
    }

    this.setState({
      specialtyId: specialty.id,
      name: specialty.name,
      descriptionMarkdown: specialty.descriptionMarkdown,
      image: specialty.image,
      previewImgURL: imaBase64,
      active: false,
    });
  };

  saveNewSpecialty = async () => {
    let res = await createNewSpecialty(this.state);
    if (res && res.errCode === 0) {
      toast.success("Thêm mới chuyên khoa thành công!");
      this.getResetState();
    } else {
      toast.warn("Có lỗi, vui lòng kiểm tra lại...");
      console.log("...check state: ", res);
    }
  };

  editSpecialty = async (data) => {
    // console.log("check data specialty : ", data);
    try {
      let res = await editSpecialtyService(data);
      if (res && res.errCode === 0) {
        toast.success("Cập nhật phòng khám thành công !!!");
        await this.getAllSpecialtyFromReact();
        this.getResetState();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getAllSpecialtyFromReact = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialty: res.data ? res.data : [],
      });
    }
  };

  handleSaveSpecialty = async () => {
    console.log("check data:", this.state.active);
    let { active } = this.state;
    if (active === true) {
      await this.saveNewSpecialty({
        id: this.state.specialtyId,
        name: this.state.name,
        image: this.state.image,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
      });
    } else {
      await this.editSpecialty({
        id: this.state.specialtyId,
        name: this.state.name,
        image: this.state.image,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
      });
    }
  };

  handleDeleteSpecialty = async (data) => {
    // console.log("click delete", clinic.id);
    try {
      let res = await deleteSpecialtyService(data.id);
      if (res && res.errCode === 0) {
        toast.success("Xóa chuyên khoa thành công !!!");
        await this.getAllSpecialtyFromReact();
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getResetState = () => {
    this.setState({
      specialtyId: "",
      name: "",
      image: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      active: true,
      previewImgURL: "",
    });
  };

  render() {
    let arrSpecialty = this.state.arrSpecialty;
    console.log("check data Specialty:", arrSpecialty);

    return (
      <div className="manage-specialty-container mb-4 container">
        <div className="add-new-specialty row">
          {this.state.isOpenImage === true && (
            <Lightbox
              mainSrc={this.state.image}
              onCloseRequest={() => this.setState({ isOpenImage: false })}
            />
          )}
          <div className="title col-12">Quản lý chuyên khoa</div>

          <div className="col-6 form-group mt-2">
            <label>Tên chuyên khoa</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-3 form-group mt-2">
            <div className="d-flex justify-content-between">
              <label>Ảnh chuyên khoa </label>
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
                  ? "btn-save-specialty btn btn-primary"
                  : "btn-save-specialty btn btn-info"
              }
              onClick={() => this.handleSaveSpecialty()}
            >
              <span className="mx-2">
                {this.state.active === true
                  ? "Lưu chuyên khoa mới"
                  : " Lưu thay đổi"}
              </span>
            </button>
          </div>
          <div className="specialtys-table mt-3 col-6">
            <table id="specialtys">
              <tr>
                <th>STT</th>
                <th colSpan="5">Tên chuyên khoa</th>
                <th colSpan="4">Ảnh</th>
                <th colSpan="2">Action</th>
              </tr>
              <tbody>
                {arrSpecialty && arrSpecialty.length > 0 ? (
                  arrSpecialty.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td colSpan="5">{item.name}</td>
                        <td colSpan="4">
                          <div
                            className="preview-image"
                            style={{
                              backgroundImage: `url(${item.image})`,
                              backgroundSize: "contain",
                              width: "80px",
                            }}
                          ></div>
                        </td>
                        <td colSpan="2">
                          <button
                            className="btn-edit"
                            onClick={() => this.handleFillSpecialtyInfo(item)}
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              this.handleDeleteSpecialty(item);
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
                      Chưa có chuyên khoa nào hết!!!
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
