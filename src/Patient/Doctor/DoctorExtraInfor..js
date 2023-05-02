import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
// import NumberFormat from 'react-number-format';
// import NumberFormatBase from "react-number-format";

// import {getExtraInforDoctorById} from '../../../services/userService';
class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      // extraInfor: {}
    };
  }
  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
    //     let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
    //     if (res && res.errCode === 0) {
    //         this.setState({
    //             extraInfor: res.data
    //         })
    //     }
    // }
  }
  showHideDetailInfor = (status) => {
    this.setState({
      isShowDetailInfor: status,
    });
  };
  render() {
    let { isShowDetailInfor /*extraInfor*/ } = this.state;
    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          {/* <div className="text-address">Địa chỉ khám</div> */}
          <div className="text-address">
            Đặt khám tại nhà <i className="far fa-hand-point-right"></i>{" "}
            <button className="btn btn-booking-at-home">Tại đây </button>
          </div>
          <div className="name-clinic">
            {/* {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''} */}
          </div>
          <div className="detail-address">
            {/* {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''} */}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfor === false && (
            <div className="short-infor">
              {
                // <NumberFormat
                //     className="currency"
                //     value={extraInfor.priceTypeData.valueVI}
                //     displayType={'text'}
                //     thousandSeparator={true}
                //     suffix={"VND"}
                // />
              }
              <div className="title-price">Giá khám tại nhà:</div>
              <span onClick={() => this.showHideDetailInfor(true)}>
                Xem chi tiết
              </span>
            </div>
          )}

          {isShowDetailInfor === true && (
            <>
              <div className="detail-infor">
                <div className="price">
                  <span className="left">Giá khám tại nhà: </span>
                  <span className="right">
                    {
                      // <NumberFormat
                      //     className="currency"
                      //     value={extraInfor.priceTypeData.valueVI}
                      //     displayType={'text'}
                      //     thousandSeparator={true}
                      //     suffix={"VND"}
                      // />
                    }
                  </span>
                </div>
                <div className="note">
                  {/* {extraInfor && extraInfor.note ? extraInfor.note : ''} */}
                </div>
              </div>
              <div className="payment">
                {/* {extraInfor && extraInfor.paymentTypeData ? extraInfor.paymentTypeData.valueVI: ''} */}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfor(false)}>
                  Ẩn bảng giá
                </span>
              </div>
            </>
          )}
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
export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
