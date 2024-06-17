import React, { Component } from "react";
import loading from "../images/loading.gif";
import "./Styles.css"

export class Spinner extends Component {
  render() {
    return (
      <div className="loading">
        <img src={loading} alt="loading" />
      </div>
    );
  }
}

export default Spinner;
