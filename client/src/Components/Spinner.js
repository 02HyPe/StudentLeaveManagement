import React, { Component } from "react";
import loading from "../images/loadinggg.gif";
// import loading from "../images/srki-loading.gif"
// import loading from "../images/Loading-main.gif"
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
