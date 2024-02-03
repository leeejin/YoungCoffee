import React,{Component} from "react";

import Template from "../templates/home";
import Create from "../components/post/create";

export default class CreatePage extends Component{
    render(){
        return(
            <Template>
                <Create/>
            </Template>
        )
    }
}
