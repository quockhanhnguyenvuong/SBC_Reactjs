import React, { Component } from "react";
import { connect } from "react-redux";
import './DoctorExtraInfor.scss'
import { NumericFormat } from 'react-number-format';

import { getExtraInforDoctorById } from '../../../services/userService';
class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {}
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }
    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address"> Dia chi kham</div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className="detail-address">
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">

                    {isShowDetailInfor === false &&
                        <div className="short-infor">
                            {/* {
                                extraInfor && extraInfor.priceTypeData &&
                                <NumericFormat
                                    className="currency"
                                    value={extraInfor.priceTypeData.valueVI}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={"VND"}
                                />
                            } */}
                            <span onClick={() => this.showHideDetailInfor(true)}>
                                Xem chi tiet
                            </span>
                        </div>
                    }

                    {isShowDetailInfor === true &&
                        <>
                            <div className="title-price">Gia kham: .</div>
                            <div className="detail-infor">
                                <div className="price">
                                    <span className="left">Gia Kham: </span>
                                    <span className="right">
                                        {/* {
                                            extraInfor && extraInfor.priceTypeData &&
                                            <NumericFormat
                                                className="currency"
                                                value={extraInfor.priceTypeData.valueVI}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={"VND"}
                                            />
                                        } */}
                                    </span>
                                </div>
                                <div className="note">
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className="payment">
                                {extraInfor && extraInfor.paymentTypeData ? extraInfor.paymentTypeData.valueVI: ''}
                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfor(false)}>An bang gia
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {

    };
};
const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
