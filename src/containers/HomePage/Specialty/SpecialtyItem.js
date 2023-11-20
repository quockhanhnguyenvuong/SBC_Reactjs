import React, { Component } from "react";
import { connect } from "react-redux";
class SpecialtyItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  render() {
    // console.log("check props:", this.props);
    return (
      <tr>
        {/* <td>{this.props.stt}</td> */}
        <td>
          <span>{this.props.data.name}</span>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyItem);
