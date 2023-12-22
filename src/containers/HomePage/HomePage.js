import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import OutStandingDoctor from "./Section/OutStandingDoctor";
import About from "./Section/About";
import HomeFooter from "./HomeFooter";
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "react-select";
import {
  getAllDoctors,
  getAllSpecialty,
  getAllClinic,
} from "../../services/userService";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrClinic: [],
      arrSpecialty: [],
      arrDoctor: [],
      arrSearch: [],
      selectDoctor: "",
    };
  }

  async componentDidMount() {
    let resClinic = await getAllClinic();
    let resSpecialty = await getAllSpecialty();
    let resDoctor = await getAllDoctors();
    if (resClinic && resClinic.errCode === 0) {
      this.setState({
        arrClinic: resClinic.data ? resClinic.data : [],
      });
    }
    if (resSpecialty && resSpecialty.errCode === 0) {
      this.setState({
        arrSpecialty: resSpecialty.data ? resSpecialty.data : [],
      });
    }
    if (resDoctor && resDoctor.errCode === 0) {
      this.setState({
        arrDoctor: resDoctor.data ? resDoctor.data : [],
      });
    }

    let dataSelectSearch = this.buildDataInputSelect(
      this.state.arrDoctor,
      this.state.arrClinic,
      this.state.arrSpecialty,
    );
    this.setState({
      arrSearch: dataSelectSearch,
    });
  }

  buildDataInputSelect = (dataDoctor, dataClinic, dataSpecialty) => {
    let result = [];
    if (dataDoctor && dataDoctor.length > 0) {
      dataDoctor.map((item, index) => {
        let object = {};
        object.label = `${item.lastName} ${item.firstName}`;
        object.value = item.id;
        object.type = "doctor";
        result.push(object);
      });
    }
    if (dataClinic && dataClinic.length > 0) {
      dataClinic.map((item, index) => {
        let object = {};
        object.label = `${item.name}`;
        object.value = item.id;
        object.type = "clinic";
        result.push(object);
      });
    }
    if (dataSpecialty && dataSpecialty.length > 0) {
      dataSpecialty.map((item, index) => {
        let object = {};
        object.label = `${item.name}`;
        object.value = item.id;
        object.type = "specialty";
        result.push(object);
      });
    }
    return result;
  };

  handleChangeSelect = (selectDoctor) => {
    this.setState({ selectDoctor });
    if (this.props.history) {
      if (selectDoctor.type == "doctor")
        this.props.history.push(`/home/detail-doctor/${selectDoctor.value}`);
      if (selectDoctor.type == "clinic")
        this.props.history.push(`/home/detail-clinic/${selectDoctor.value}`);
      if (selectDoctor.type == "specialty")
        this.props.history.push(`/home/detail-specialty/${selectDoctor.value}`);
    }
    // console.log("check data choose:", selectDoctor);
  };

  handleViewDetailDoctor = (id) => {
    if (this.props.history) {
      this.props.history.push(`/home/detail-doctor/${id}`);
    }
  };
  render() {
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    };
    console.log("arrSearch", this.state.arrSearch);
    return (
      <div>
        <HomeHeader />
        <div className="home-header-banner">
          <Select
            value={this.state.selectDoctor}
            onChange={this.handleChangeSelect}
            className="search"
            options={this.state.arrSearch}
            placeholder="Tìm bác sĩ, chuyên khoa, phòng khám ..."
          />
        </div>
        <Specialty settings={settings} />
        <OutStandingDoctor settings={settings} />
        <MedicalFacility settings={settings} />
        <About />
        <div style={{ position: "relative", marginTop: "30px" }}>
          <HomeFooter />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
