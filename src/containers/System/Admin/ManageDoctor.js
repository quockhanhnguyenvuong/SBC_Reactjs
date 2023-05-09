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
import { manageActions } from '../../../utils/constant';
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHTML: "",
      contentMarkdown: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,
      listPrice: [],
      listPayment: [],
      listProvince: [],
      selectedPrice: '',
      selectedPayment: '',
      selectedProvince: '',
      nameClinic: '',
      addressClinic: '',
      note: '',

    };
  }
  async componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    // let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
    if (inputData && inputData.length > 0) {
      // inputData.map((item, index) => {
      //   let object = {};
      //   object.label = `${item.lastName} ${item.firstName}`;
      //   object.value = item.id;
      //   result.push(object);
      // });
      if (type === 'USERS') {
        inputData.map((item, index) => {
          let object = {};
          object.label = `${item.lastName} ${item.firstName}`;
          object.value = item.id;
          result.push(object)
        })
      }


      if (type === 'PAYMENT' || type === 'PRICE' || type === 'PROVINCE') {
        inputData.map((item, index) => {
          let object = {}
          object.label = `${item.valueVI}`;
          object.value =  item.keyMap;
          result.push(object)
        })
      }

    }
    return result;
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
      this.setState({
        listDoctors: dataSelect,
      });
    }
    // if(prevProps.language !== this.props.language){
    //   let
    // }

    if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
      let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;
      let dataSelectedPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectedPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectedProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      this.setState({
        listPrice: dataSelectedPrice,
        listPayment: dataSelectedPayment,
        listProvince: dataSelectedProvince,
      })
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
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? manageActions.EDIT : manageActions.ADD,
      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
     
    });
   
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let {listPayment, listPrice, listProvince} = this.state;
    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown
      let addressClinic = '', nameClinic = '', note = '',
      paymentId = '', priceId ='', provinceId ='',
      selectedPayment = '', selectedPrice = '', selectedProvince = '';
      if(res.data.Doctor_Infor){
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        priceId = res.data.Doctor_Infor.priceId;
        paymentId = res.data.Doctor_Infor.paymentId;
        provinceId = res.data.Doctor_Infor.provinceId;
        selectedPayment = listPayment.find(item => {
          return item && item.value === paymentId
        })
        selectedPrice = listPrice.find(item => {
          return item && item.value === priceId
        })
        selectedProvince = listProvince.find(item => {
          return item && item.value === provinceId
        })

      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince:selectedProvince,
       
      })
    } else {
      this.setState({
        contentHTML: '',
        contentMarkdown: '',
        description: '',
        hasOldData: false,
        addressClinic: '',
        nameClinic: '',
        note: '',
      })
    }
  
  };
  /* Textarea description doctor */
  handleOnChangeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };
  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy
    })
 
  }
  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy
    })
  }

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
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={"Chọn bác sĩ"}

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
          <div className="more-infor-extra row">
            <div className="col-4 form-group mt-2">
              <label>Chọn giá</label>
              <Select
                value={this.state.selectedPrice}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listPrice}
                placeholder={"Chọn giá"}
                name="selectedPrice"
              />
            </div>
            <div className="col-4 form-group mt-2">
              <label>Chọn phương thức thanh toán</label>
              <Select
                value={this.state.selectedPayment}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listPayment}
                placeholder={"Chọn phương thức thanh toán"}
                name="selectedPayment"
              />
            </div>
            <div className="col-4 form-group mt-2">
              <label>Chọn tỉnh thành</label>
              <Select
                value={this.state.selectedProvince}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listProvince}
                placeholder={"Chọn tỉnh thành"}
                name="selectedProvince"
              />
            </div>
            <div className="col-4 form-group mt-2">
              <label>Tên phòng khám</label>
              <input className="form-control" 
              onChange={(event)=> this.handleOnChangeText(event, 'nameClinic')}
              value={this.state.nameClinic}
              />
            </div>
            <div className="col-4 form-group mt-2">
              <label>Địa chỉ phòng khám</label>
              <input className="form-control" 
              onChange={(event)=> this.handleOnChangeText(event, 'addressClinic')}
              value={this.state.addressClinic}
              />
            </div>
            <div className="col-4 form-group mt-2">
              <label>Note</label>
              <input className="form-control"
              onChange={(event)=> this.handleOnChangeText(event, 'note')}
              value={this.state.note}
               />
            </div>
          </div>
          <div className="manage-doctor-editor col-12 mt-4">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
            <button
              onClick={() => this.handleSaveContentMarkdown()}
              className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}>
              {hasOldData === true ?
                <span>Lưu thông tin</span> :
                <span>Tạo thông tin</span>
              }
              <i className="far fa-save mx-2"></i>
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
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);