import React, { Component } from "react";
import { connect } from "react-redux";

class DefaultClass extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    return <div>casi gi day</div>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapDispatchToProps)(DefaultClass);
