import React,{Component} from "react";

import Template from "../templates/home";
import Modify from "../components/post/modify";

export default class ModifyPage extends Component{
    render(){
        return(
            <Template>
                <Modify/>
            </Template>
        )
    }
    
}
