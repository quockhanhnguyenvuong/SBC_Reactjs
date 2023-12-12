import React, {Component} from "react";
import { connect } from "react-redux";
import { FormattedMassage } from "react-intl";
import { locale } from "moment/moment";

class Comment extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    initFacebookSDK(){
        if(window.FB){
            window.FB.XFBML.parse();
        }
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,
                xfbml:true,
                version: 'v2.5'
            });
        };
        (function(d,s,id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if(d.getElementById(id)) return;
            js= d.createElement(s);   js.id=id;
            js.src = `//connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    componentDidMount(){
        this.initFacebookSDK();
    }
    render(){
        let { width, dataHref, numPost } = this.props;
        return(
            <>
            <div className="fb-comment"
                data-href={dataHref}
                data-width={width ? width:5}
                data-numPost={numPost ? numPost:5}
            >
            </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {};
  };
  const mapDispatchToProps = (dispatch) => {
    return {};
  };
export default connect(mapStateToProps, mapDispatchToProps)(Comment);