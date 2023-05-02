import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);
// Initialize a markdown parser
import Select from "react-select";
import { CRUD_ACTIONS } from "../../../utils";
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
    };
  }
  async componentDidMount() {
    this.props.fetchAllDoctors();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
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
    });
    console.log("check state: ", this.state);
    // this.props.saveDetailDoctor({
    //   contentHTML: this.state.contentHTML,
    //   contentMarkdown: this.state.contentMarkdown,
    //   description: this.state.description,
    //   doctorId: this.state.selectDoctor.value,
    // });
    // console.log("check state: ", this.state);
  };

  /* Select option doctor */
  handleChangeSelect = async (selectDoctor) => {
    this.setState({ selectDoctor });
    let res = await getDetailInforDoctor(selectDoctor.value);
    if (res && res.errCode === 0 && res.data.Markdown) {
      let markdown = res.data.Markdown;
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
      });
    }
    console.log("select doctor", selectDoctor);
  };

  /* Textarea description doctor */
  handleOnChangeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = `${item.lastName} ${item.firstName}`;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  render() {
    let { hasOldData } = this.state;
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
            />
          </div>
          {/* Textarea description doctor */}
          <div className="col-7">
            <label>Thông tin giới thiệu:</label>
            <textarea
              className="form-control"
              onChange={(event) => this.handleOnChangeDescription(event)}
              value={this.state.description}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
