import React, { Component } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/login_page";
import UserInfoPage from "./pages/user_info_page";
import TaxInfoPage from "./pages/tax_info_page";

import MyStorage from './util/redux_storage';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("App.js 렌더 실행됨");
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/UserInfo" element={<ConditionRoute path={'/'} originPath={"/UserInfo"}/>}>
            <Route path="/UserInfo" element={<UserInfoPage />} />
          </Route>

          <Route path="/TaxInfo" element={<ConditionRoute path={'/'} originPath={"/TaxInfo"}/>}>
            <Route path="/TaxInfo" element={<TaxInfoPage />} />
          </Route>


        </Routes>
      </BrowserRouter>
    );
  }
}



class ConditionRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: parseInt(sessionStorage.getItem("userID")),
      passwd: sessionStorage.getItem("passwd")
    }
  }

  componentDidMount() {
    this.unsubscribe = MyStorage.subscribe(this.onStorageChange); //리덕스에서 업데이트되면 알려줘, 여기 app.js만 씀, App.js에서도 값 업더ㅔ이트를 알아야함
    
  }

  componentWillUnmount() {
    //console.log('라우터 언 마운트...');
    this.unsubscribe();
  }

  onStorageChange = () => {
    //console.log('라우터에서 리덕스에 변경된 값을 감지 = ', MyStorage.getState());
    this.setState({ 
      userID: parseInt(sessionStorage.getItem("userID")), 
      passwd: sessionStorage.getItem("passwd")
    });
  }


  render() {
    //console.log('라우터에서 렌더',MyStorage.getState());
    //console.log("라우터에서 세션 값 = ",sessionStorage.getItem("userID"));
    
    if(this.state.userID!=0) {
      //console.log('라우터에서 로그인 성공 받았음',MyStorage.getState());
      return (<Outlet/>);
    }
    //로그인을 통해서 들어옴(login페이지에서 visitLogin을 true로 해줌으로써 인식)
    else if(MyStorage.getState().visitLogin==true && this.props.originPath=="/UserInfo") {
      MyStorage.dispatch({type:"Exit"});
      //console.log("Exit 후 리덕스 값 =",MyStorage.getState())
      //console.log('라우터에 처음으로 들어롬');
      return (<></>);
    }
    else {
      //console.log('라우터에서 거절되어 홈으로 이동함')
      return (<Navigate to={this.props.path} />);
    }
  }
}
