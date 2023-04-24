import React, {Component} from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";


class DefaultClass extends Component{
    constructor(props){
        super(poprs);
        this.state = {

        }
    }

    async componentDidMount(){

    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){

        }
            
    }

    render(){    
        return(
            <div></div>
        );
        
    }
}

const mapDispatchToProps = dispatch =>{
    return{

    };
};

export default connect (mapDispatchToProps)(DefaultClass);