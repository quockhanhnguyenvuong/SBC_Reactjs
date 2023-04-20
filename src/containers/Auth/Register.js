import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllCodeService } from "../../services/userService";
import * as actions from "../../store/actions"
// import TableManageUser from "./TableManageUser";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: []
        }
    }
  async componentDidMount() {
    this.props.getGenderStart();
    // try{
    //     let res = await getAllCodeService('gender');
    //     console.log('check res:',res)
    //     if(res && res.errCode === 0 )
    //     {
    //         this.setState({
    //             genderArr: res.data
    //         })
    //     }
    //     console.log('Check res', res)
    // }catch(e){
    //     console.log(e)
    // }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.genderRedux !== this.props.genderRedux){
      this.setState({
        genderArr: this.props.genderRedux
      })
    }
  }
  render() {
    console.log('check state:', this.state)
    let genders = this.state.genderArr;
    // return <TableManageUser />;
    return (
      <div className="user-redux-container">
        <div className="title">
          Dăng ký tài khoản người dùng Smart Booking Care
        </div>
        <div className="user-redux-body container">
          <div className="row">
            <div className="col-12">Đăng ký tài khoản</div>
            <div className="col-3">
              <label>Email</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-3">
              <label>Password</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-3">
              <label>Số điện thoại</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-3">
              <label>Họ</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-3">
              <label>Tên</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-9">
              <label>Địa chỉ</label>
              <input className="form-control" type="email" />
            </div>
            <div className="col-3">
              <label>Giới tính</label>
              <select className="form-control">
                <option select>Chose...</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-3">
              <label>Position</label>
              <select className="form-control">
                <option select>Chose...</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-3">
              <label>RoleID</label>
              <select className="form-control">
                {genders && genders.length > 0 && genders.map((item, index) => {
                  return (
                    <option key={index}>{item.valueVI}</option>
                  )
                })
                }
                <option select>Chose...</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-3">
              <label>Image</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-3">
              <button className="btn btn-primary">Đăng ký tài khoản</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    genderRedux: state.admin.genders
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
