import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manuallys
import "react-markdown-editor-lite/lib/index.css";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);
// Initialize a markdown parser
import Select from "react-select";
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHTML: "",
      contentMarkdown: "",
      selectDoctor: "",
      description: "",

      listDoctors: [],
      hasOldData: false,

      listProvince: [],
      listPayment: [],
      listFormality: [],
      listClinic: [],
      listSpecialty: [],
      selectClinic: "",
      selectSpecialty: "",
      priceOnId: "",
      priceOffId: "",
      selectProvince: "",
      selectPayment: "",
      selectFormality: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }
  async componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelectDoctor = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS",
      );
      this.setState({
        listDoctors: dataSelectDoctor,
      });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let { resPayment, resProvince, resFormality, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;

      let dataSelectFormality = this.buildDataInputSelect(
        resFormality,
        "FORMALITY",
      );
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE",
      );

      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY",
      );
      let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");

      this.setState({
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listFormality: dataSelectFormality,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };
  // Markdown
  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectDoctor.value,
      action: hasOldData === true ? "EDIT" : "CREATE",

      priceOnId: this.state.priceOnId,
      priceOffId: this.state.priceOffId,
      selectProvince: this.state.selectProvince,
      selectPayment: this.state.selectPayment,
      selectFormality: this.state.selectFormality,
      note: this.state.note,
      clinicId:
        this.state.selectClinic && this.state.selectClinic.value
          ? this.state.selectClinic.value
          : "",
      specialtyId:
        this.state.selectSpecialty && this.state.selectSpecialty.value
          ? this.state.selectSpecialty.value
          : "",
    });
    // console.log("check save: ", this.state);
    this.setState({
      contentHTML: "",
      contentMarkdown: "",
      selectDoctor: "",
      description: "",
      priceOnId: "",
      priceOffId: "",
      selectProvince: "",
      selectPayment: "",
      selectFormality: "",
      note: "",
      selectClinic: "",
      selectSpecialty: "",
    });
  };

  /* Select option doctor */
  handleChangeSelect = async (selectDoctor) => {
    this.setState({ selectDoctor });

    let {
      listPayment,
      listFormality,
      listProvince,
      listSpecialty,
      listClinic,
    } = this.state;

    let res = await getDetailInforDoctor(selectDoctor.value);
    if (res && res.errCode === 0 && res.data.Markdown) {
      let markdown = res.data.Markdown;

      let note = "",
        paymentId = "",
        provinceId = "",
        priceOnId = "",
        priceOffId = "",
        formality = "",
        selectPayment = "",
        selectProvince = "",
        selectFormality = "",
        specialtyId = "",
        selectSpecialty = "",
        clinicId = "",
        selectClinic = "";

      if (res.data.Doctor_Infor) {
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        provinceId = res.data.Doctor_Infor.provinceId;
        formality = res.data.Doctor_Infor.formality;
        priceOnId = res.data.Doctor_Infor.priceOnId;
        priceOffId = res.data.Doctor_Infor.priceOffId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;
        //
        selectPayment = listPayment.find((item) => {
          return item.label === paymentId;
        });
        selectProvince = listProvince.find((item) => {
          return item.label === provinceId;
        });
        selectFormality = listFormality.find((item) => {
          return item.label === formality;
        });
        selectSpecialty = listSpecialty.find((item) => {
          return item.value === specialtyId;
        });
        selectClinic = listClinic.find((item) => {
          return item.value === clinicId;
        });
      }
      // console.log("check select:", selectFormality);
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        note: note,
        priceOnId: priceOnId,
        priceOffId: priceOffId,
        selectPayment: selectPayment,
        selectProvince: selectProvince,
        selectFormality: selectFormality,
        selectSpecialty: selectSpecialty,
        selectClinic: selectClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        priceOnId: "",
        priceOffId: "",
        selectProvince: "",
        selectPayment: "",
        selectFormality: "",
        note: "",
        selectClinic: "",
        selectSpecialty: "",
      });
    }
    // console.log("select doctor", selectDoctor);
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({ ...stateCopy });
  };

  /* Textarea description doctor */
  handleOnChangeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          object.label = `${item.lastName} ${item.firstName}`;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    if (type === "PAYMENT" || type === "PROVINCE" || type === "FORMALITY") {
      inputData.map((item, index) => {
        let object = {};
        object.label = `${item.valueVI}`;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    if (type === "SPECIALTY") {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.name;
        object.value = item.id;
        result.push(object);
      });
    }
    if (type === "CLINIC") {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.name;
        object.value = item.id;
        result.push(object);
      });
    }

    return result;
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({ ...stateCopy });
  };

  render() {
    let { hasOldData } = this.state;
    // const { allRequiredDoctorInfor } = this.props;
    // console.log("check payment & province", allRequiredDoctorInfor);
    // console.log("check list payment", this.state.listPayment);
    return (
      <div className="manage-doctor-container container mb-5">
        <div className="row">
          <div className="manage-doctor-title title text-center col-12">
            Tạo thêm thông tin bác sĩ
          </div>
          {/* Select option doctor */}
          <div className="col-5">
            <label>Chọn bác sĩ:</label>
            <Select
              value={this.state.selectDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder="Chọn bác sĩ..."
            />
          </div>
          {/* Textarea description doctor */}
          <div className="col-7 mb-4">
            <label>Thông tin giới thiệu:</label>
            <textarea
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>

          <div className="col-4 mb-3">
            <label>Chọn phương thức thanh toán:</label>
            <Select
              value={this.state.selectPayment}
              options={this.state.listPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              placeholder="Chọn phương thức thanh toán..."
              name={"selectPayment"}
            />
          </div>

          <div className="col-4 mb-3">
            <label>Chọn hình thức khám bệnh:</label>
            <Select
              value={this.state.selectFormality}
              options={this.state.listFormality}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectFormality"
              placeholder="Chọn hình thức khám bệnh..."
            />
          </div>

          <div className="col-4">
            <label>Nhập giá khám trực tuyến:</label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "priceOnId")}
              value={this.state.priceOnId}
              placeholder="Nhập giá khám..."
            />
          </div>

          <div className="col-4">
            <label>Nhập giá khám tại nhà:</label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "priceOffId")}
              value={this.state.priceOffId}
              placeholder="Nhập giá khám..."
            />
          </div>

          <div className="col-4">
            <label>Chọn tỉnh thành:</label>
            <Select
              value={this.state.selectProvince}
              options={this.state.listProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              placeholder="Chọn tỉnh thành..."
              name="selectProvince"
            />
          </div>

          <div className="col-4 mb-3">
            <label>Chọn phòng khám:</label>
            <Select
              value={this.state.selectClinic}
              options={this.state.listClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectClinic"
              placeholder="Chọn phòng khám..."
            />
          </div>

          <div className="col-4 mb-3">
            <label>Chọn chuyên khoa:</label>
            <Select
              value={this.state.selectSpecialty}
              options={this.state.listSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectSpecialty"
              placeholder="Chọn chuyên khoa..."
            />
          </div>

          <div className="col-6 mb-2">
            <label>Note:</label>
            <textarea
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            ></textarea>
          </div>

          {/* Markdown */}
          <div className="manage-doctor-editor col-12 mt-4">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
            <button
              className={
                hasOldData === true
                  ? "save-content-doctor btn btn-success mt-4 px-4 "
                  : "save-content-doctor btn btn-primary mt-4 px-4 "
              }
              onClick={() => this.handleSaveContentMarkdown()}
            >
              <i className="far fa-save mx-2"></i>
              {hasOldData === true ? (
                <span>Lưu thông tin</span>
              ) : (
                <span>Tạo thông tin</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getAllRequiredDoctorInfor: () =>
      dispatch(actions.getAllRequiredDoctorInfor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
