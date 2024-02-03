import {legacy_createStore as createStore} from "redux";

const loginState={userID:0,passwd:"",visitLogin:false};

function reducer (state=loginState, action)  {
    //console.log('리덕스에서의 값들 = ',action.data);
    switch(action.type) {
        case "Login":
            sessionStorage.setItem('userID',action.data.userID);
            sessionStorage.setItem('passwd',action.data.passwd);
            return {...state,userID:action.data.userID,passwd:action.data.passwd,visitLogin:false};
        case "Visit":
            sessionStorage.setItem("userID",0);
            sessionStorage.setItem("passwd","");
            return {...state,userID:state.userID,passwd:state.passwd,visitLogin:true};
        case "Exit":
            return {...state,visitLogin:false};
        case "Logout" :
            sessionStorage.setItem('userID',0);
            sessionStorage.setItem('passwd','');
            return {...state, userID:0, passwd:'',visitLogin:true};
        default:
            return {...state, state};
    }
};

export default createStore(reducer);