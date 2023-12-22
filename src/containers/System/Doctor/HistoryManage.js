import React, { Component } from "react";
import { connect } from "react-redux";
import "./HistoryManage.scss";
import { getListPatientForHistory } from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class HistoryManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPatient: {},
      arrPatientS5: [],
      arrPatientS6: [],
      arrPatientS7: [],
    };
  }
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
    let { user } = this.props;

    let res = await getListPatientForHistory({
      doctorId: user.id,
      // date: formattedDate,
    });
    let arrS5 = [];
    let arrS6 = [];
    let arrS7 = [];
    let arr = res.data;
    console.log("check", arr);
    let countS5 = 0;
    let countS6 = 0;
    let countS7 = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].statusId === "S5") {
        arrS5[countS5++] = arr[i];
        console.log("s5", arrS5);
      } else if (arr[i].statusId === "S6") {
        arrS6[countS6++] = arr[i];
        console.log("S6", arrS6);
      } else if (arr[i].statusId === "S7") {
        arrS7[countS7++] = arr[i];
      }
    }

    // console.log("check arr ", res.data);
    if (res && res.errCode == 0) {
      this.setState({
        dataPatient: res.data,
        arrPatientS5: arrS5,
        arrPatientS6: arrS6,
        arrPatientS7: arrS7,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  convertTimestampToDate = (timestamp) => {
    return moment(parseInt(timestamp)).format("DD/MM/YYYY");
  };

  render() {
    let { arrPatientS5, arrPatientS6, arrPatientS7 } = this.state;
    console.log("echs7", arrPatientS7);
    return (
      <>
        <div className="title">Quản lý lịch sử</div>
        <div className="col-12 table-m-p mt-3">
          <p className="h5">Danh sách các lịch hẹn đã hoàn thành</p>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th>STT</th>
                {/* <th>Thời gian</th> */}
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Thời gian</th>
                <th style={{ textAlign: "center" }}>Hình thức</th>
                <th>Trạng thái</th>
              </tr>
              {arrPatientS5 && arrPatientS5.length > 0 ? (
                arrPatientS5.map((item, index) => {
                  return item.statusId === "S5" ? (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        {item.patientData.lastName +
                          " " +
                          item.patientData.firstName}
                      </td>
                      <td>{item.patientData.email}</td>
                      <td>{item.address}</td>
                      <td>{this.convertTimestampToDate(item.date)}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.bookingType}
                      </td>
                      <td className="status">{item.statusTypeData.valueVI}</td>
                    </tr>
                  ) : (
                    ""
                  );
                })
              ) : (
                <tr>
                  <td colspan="8" className="no-data">
                    Lịch sử trống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-12 table-m-p mt-3">
          <p
            className="h5"
            style={{ color: "white", marginTop: "50px", background: "red" }}
          >
            Danh sách các lịch hẹn đã hủy
          </p>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th>STT</th>
                {/* <th>Thời gian</th> */}
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Thời gian</th>
                <th style={{ textAlign: "center" }}>Hình thức</th>
                <th>Trạng thái</th>
              </tr>
              {arrPatientS6 && arrPatientS6.length > 0 ? (
                arrPatientS6.map((item, index) => {
                  return item.statusId === "S6" ? (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        {item.patientData.lastName +
                          " " +
                          item.patientData.firstName}
                      </td>
                      <td>{item.patientData.email}</td>
                      <td>{item.address}</td>
                      <td>{this.convertTimestampToDate(item.date)}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.bookingType}
                      </td>
                      <td style={{ background: "red" }} className="status">
                        {item.statusTypeData.valueVI}
                      </td>
                    </tr>
                  ) : (
                    ""
                  );
                })
              ) : (
                <tr>
                  <td colspan="8" className="no-data">
                    Lịch sử trống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-12 table-m-p mt-3">
          <p
            className="h5"
            style={{
              color: "#fff",
              fontWeight: "bold",
              marginTop: "50px",
              background: "black",
            }}
          >
            Danh sách đen
          </p>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th>STT</th>
                {/* <th>Thời gian</th> */}
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Thời gian</th>
                <th style={{ textAlign: "center" }}>Hình thức</th>
                <th>Trạng thái</th>
              </tr>
              {arrPatientS7 && arrPatientS7.length > 0 ? (
                arrPatientS7.map((item, index) => {
                  return item.statusId === "S7" ? (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        {item.patientData.lastName +
                          " " +
                          item.patientData.firstName}
                      </td>
                      <td>{item.patientData.email}</td>
                      <td>{item.address}</td>
                      <td>{this.convertTimestampToDate(item.date)}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.bookingType}
                      </td>
                      <td style={{ background: "#000" }} className="status1">
                        X
                      </td>
                    </tr>
                  ) : (
                    ""
                  );
                })
              ) : (
                <tr>
                  <td colspan="8" className="no-data">
                    Lịch sử trống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryManage);
