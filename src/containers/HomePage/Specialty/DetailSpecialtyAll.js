import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import "./DetailSpecialtyAll.scss";
import _ from "lodash";
import SpecialtyItem from "../Specialty/SpecialtyItem";
import { getAllSpecialty } from "../../../services/userService";
class DetailSpecialtyAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrSpecialty: [],
      currentPage: 1,
      newsPerPage: 3,
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialty: res.data ? res.data : [],
      });
    }
  }

  chosePage = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  };

  select = (event) => {
    this.setState({
      newsPerPage: event.target.value,
    });
  };

  render() {
    let { arrSpecialty } = this.state;
    // console.log("check data specialty:", arrSpecialty);
    console.log("check data:", this.state);

    const currentPage = this.state.currentPage; //trang hiện tại
    const newsPerPage = this.state.newsPerPage; //tin tức mỗi trang
    const indexOfLastNews = currentPage * newsPerPage; //index(vị trí) tin tức cuối cùng của trang hiện tại trong mảng dữ liệu arrSpecialty
    const indexOfFirstNews = indexOfLastNews - newsPerPage; //index(vị trí) tin tức đầu tiên của trang hiện tại trong mảng dữ liệu arrSpecialty
    const currentDatas = arrSpecialty.slice(indexOfFirstNews, indexOfLastNews); //*cắt* dữ liệu ban đầu, lấy ra 1 mảng dữ liệu mới cho trang hiện tại
    const renderDatas = currentDatas.map((data, index) => {
      return (
        <SpecialtyItem
          // stt={index + 1 + (currentPage - 1) * newsPerPage}
          // key={index}
          data={data}
        />
      );
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(arrSpecialty.length / newsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={{ height: "100vh", marginBottom: "15px" }}>
        <div className="detail-specialty-container">
          <HomeHeader />

          <div className="news-per-page">
            <select defaultValue="0" onChange={this.select}>
              <option value="0" disabled>
                Get by
              </option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>

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
        <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialtyAll);
