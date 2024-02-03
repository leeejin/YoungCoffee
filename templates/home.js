import React, { Component } from "react";
import Menubar from "./menubar.js";

import '../styles/main.css';
//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div><Menubar /></div>
        <div style={{marginTop:'50px'}}>{this.props.children}</div>
      </div>
    );
  }

}


