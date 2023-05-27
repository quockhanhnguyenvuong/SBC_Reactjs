import React, { Component } from 'react';
import { connect } from 'react-redux';
import './forgetPassword.scss';
import { Link } from 'react-router-dom';
import { postForgetPassword } from '../../services/userService';

class forgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email:'',
        }
    }

    async componentDidMount() {
        if(this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email,
            })
        }
      }
    
      componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.dataModal !== this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email,
            })
        }
      }

    handleOnchangeEmail = (event) =>{
        this.setState({
            email: event.target.value,
        })
      }

    handleSendResetPassword = async(data) =>{
        // this.props.forgetPassword(this.state)
        console.log("state:  ", this.state)
        let res = await postForgetPassword({
            email: this.state.email,
        });
        console.log('res postForgetPassword: ', res)
        
    }

    render() {
        return (
            <div className='Reset-password-backgroud'>
                <Link to={"/login"}><button className='back'>
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                </Link>

                <div className='Reset-password-container'>
                    <div className='Reset-password-content'>
                        <div className='col-12 text-reset-password'>Forget password</div>
                        <div className='text-p'><p>Enter your email to reset your password</p></div>
                        <div className="col-6 form-group">
                                <label>Email</label>
                                <input className="form-control" 
                                    value={this.state.email}
                                    type='email'
                                    onChange={(event) => this.handleOnchangeEmail(event,'email')}
                                />
                                <button className='btn-send-gmail' onClick={() => this.handleSendResetPassword()}>
                                    Send mail
                                </button>
                        </div>
                    </div>   
                </div>
            </div>
        )
    }
}


export default connect()(forgetPassword);
