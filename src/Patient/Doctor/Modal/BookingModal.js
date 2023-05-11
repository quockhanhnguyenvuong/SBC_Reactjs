import React, {Component} from "react";
import './BookingModal.scss';
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import * as actions from "../../../store/actions";
import { postPatientBookAppointment } from "../../../services/userService";
import Select from "react-select";
import { toast } from "react-toastify";
// import { languages } from "../../../utils";
// import {LANGUAGES} from '../../utils'
// import NumberFormat from "react-number-format";
import moment from "moment";

class BookingModal extends Component{
    constructor(props){
        super(poprs);
        this.state = {
            fullName:'',
            phoneNumber:'',
            email:'',
            address:'',
            reason:'',
            birthday:'',
            selectedGender:'',
            doctorId:'',
            genders:'',
            timeType:'',
}
    }

    async componentDidMount(){
        this.props.getGender()
    }

    buildDataGender = (data) =>{
        let result = [];
        // let language = this.props.language;

        if(data && data.length >0){
            data.map(item =>{
                let object ={};
                object.label = item.valueVi;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){

        }
        if(this.props.genders !== prevProps.genders){
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }    

        if(this.props.dataTime !== !_.isEmpty(dataTime)){
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)){
                console.log('check datetime: ' ,this.props.dataTime);
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType,
                })
            }
        }
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = {...this.state}; //3 dấu ... là copy lại tên biến cần copy
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy,
        })
    }

    handleOnchangeDatePicker = (date) =>{
        this.setState({
            birthday: date[0],
        })
    }

    handleChangeSelect = () =>{
        this.setState({selectedGender: selectedOption });
    }
    

    capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) =>{
        console.log('check renderTimeBooking: ', dataTime);
        if(dataTime && !_.isEmpty(dataTime)){
            let time = dataTime.timeTypeData.valueVi;

            let date = moment.unix(+dataTime.data / 1000).format('dddd - DD/MM/YYYY')
            return(
                `${time} - ${this.capitalizeFirstLetter(date)}`
            )
        }
        return '';
    }

    buildDoctorName = (dataTime) =>{
        if(dataTime && !_.isEmpty(dataTime)){
            let name = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}` ;

            return name;
        }
        return '';
    }

    handleConfirmBooking = async() =>{
        // validate input
        // data.email || !data.doctorId || !data.timeTypeData || !data.date
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            // languages: this.props.language,
            timeString: timeString,
            doctorName: doctorName,
        })

        if(res && res.errCode === 0){
            toast.success('Booking a new appointment succeed!')
            this.props.closeBookingClose();
        }else{
            toast.error('Booking a new appointment error!')
        }
    }
    render(){    
        let {isOpenModal, closeBookingClose, dataTime} = this.props
        let doctorId = ' ';
        if(dataTime && !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId;
        }

        return(
            <Modal 
                isOpen={isOpenModal} 
                className="'booking-modal-container"
                size="lg"
                centered
                // backdrop={true}
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">Thông tin đặt lịch khám bệnh</span>
                        <span 
                            className="right"
                            onClick={closeBookingClose}
                        ><i className="fas fa-times"></i></span>
                    </div>
                    <div className="booking-modal-body">
                        {/* {JSON.stringify(dataTime)} */}
                        <div className="doctor-infor">
                            <ProfileDoctor 
                                doctorId = {doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ và tên</label>
                                <input className="form-control" 
                                    value={this.state.fullName}
                                    onChange={() => this.handleOnchangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Số điện thoại</label>
                                <input className="form-control" 
                                    value={this.state.phoneNumber}
                                    onChange={() => this.handleOnchangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ Email</label>
                                <input className="form-control" 
                                    value={this.state.email}
                                    onChange={() => this.handleOnchangeInput(event, 'email')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên hệ</label>
                                <input className="form-control" 
                                    value={this.state.address}
                                    onChange={() => this.handleOnchangeInput(event, 'address')}
                                />
                            </div>

                            <div className="col-12 form-group">
                                <label>Lý do khám</label>
                                <input className="form-control" 
                                    value={this.state.reason}
                                    onChange={() => this.handleOnchangeInput(event, 'reason')}
                                />
                            </div>

                            <div className="col-6 form-group">
                                <label>Ngày sinh</label>
                                <DatePicker 
                                    onChange={this.handleOnchangeDatePicker}
                                    className='form-control'
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <Select 
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                
                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm"
                            onClick={ () => this.handleConfirmBooking()}
                        >Xác nhận</button>
                        <button className="btn-booking-cancel"
                            onClick={closeBookingClose}
                        >Hủy</button>
                    </div>
                </div>
            </Modal>
        );
        
    }
}

const mapStateToProps = state =>{
    return{
        // language: state.app.language,
        gender: state.admin.gender,
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getGender: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect (mapDispatchToProps)(BookingModal);