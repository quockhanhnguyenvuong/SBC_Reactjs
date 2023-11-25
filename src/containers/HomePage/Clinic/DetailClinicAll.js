import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomeHeader";
import "./DetailClinicAll.scss";
import _ from "lodash";
import DetailClinicItem from "./DetailClinicItem";
import { getAllClinic } from "../../../services/userService";

class DetailClinicAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrClinic: [],
      currentPage: 1,
      newsPerPage: 5,
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        arrClinic: res.data ? res.data : [],
      });
    }
  }

  chosePage = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  };

  render() {
    let { arrClinic } = this.state;
    console.log("check data:", this.state);

    const currentPage = this.state.currentPage; //trang hiện tại
    const newsPerPage = this.state.newsPerPage; //tin tức mỗi trang
    const indexOfLastNews = currentPage * newsPerPage; //index(vị trí) tin tức cuối cùng của trang hiện tại trong mảng dữ liệu arrClinic
    const indexOfFirstNews = indexOfLastNews - newsPerPage; //index(vị trí) tin tức đầu tiên của trang hiện tại trong mảng dữ liệu arrClinic
    const currentDatas = arrClinic.slice(indexOfFirstNews, indexOfLastNews); //*cắt* dữ liệu ban đầu, lấy ra 1 mảng dữ liệu mới cho trang hiện tại
    const renderDatas = currentDatas.map((data, index) => {
      return <DetailClinicItem data={data} />;
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(arrClinic.length / newsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div>
        <HomeHeader />
        <div className="detail-clinic-container">
          <h3 style={{ marginLeft: "15%", marginTop: "10px" }}> Cơ sở y tế</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinicAll);
