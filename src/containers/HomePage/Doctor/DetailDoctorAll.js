import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomeHeader";
import "./DetailDoctorAll.scss";
import _ from "lodash";
import { getAllDoctors } from "../../../services/userService";
import DetailDoctorItem from "./DetailDoctorItem";

class DetailDoctorAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
      currentPage: 1,
      newsPerPage: 4,
    };
  }

  async componentDidMount() {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({
        arrDoctor: res.data ? res.data : [],
      });
    }
  }
  chosePage = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  };

  render() {
    let { arrDoctor } = this.state;
    // console.log("check data:", this.state);
    const currentPage = this.state.currentPage; //trang hiện tại
    const newsPerPage = this.state.newsPerPage; //tin tức mỗi trang
    const indexOfLastNews = currentPage * newsPerPage; //index(vị trí) tin tức cuối cùng của trang hiện tại trong mảng dữ liệu arrDoctor
    const indexOfFirstNews = indexOfLastNews - newsPerPage; //index(vị trí) tin tức đầu tiên của trang hiện tại trong mảng dữ liệu arrDoctor
    const currentDatas = arrDoctor.slice(indexOfFirstNews, indexOfLastNews); //*cắt* dữ liệu ban đầu, lấy ra 1 mảng dữ liệu mới cho trang hiện tại
    const renderDatas = currentDatas.map((data, index) => {
      return <DetailDoctorItem data={data} key={index} />;
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(arrDoctor.length / newsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div>
        <HomeHeader />
        <div className="detail-doctor-container">
          <h3 style={{ marginLeft: "15%", marginTop: "10px" }}>
            Danh sách bác sĩ
          </h3>
          <div className="render-data">{renderDatas}</div>

          <div className="pagination-custom">
            <ul id="page-numbers">
              {pageNumbers.map((number) => {
                if (this.state.currentPage === number) {
                  return (
                    <li key={number} id={number} className="active">
                      {number}
                    </li>
                  );
                } else {
                  return (
                    <li key={number} id={number} onClick={this.chosePage}>
                      {number}
                    </li>
                  );
                }
              })}
            </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctorAll);
