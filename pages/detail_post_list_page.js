import React,{Component} from "react";

import Template from "../templates/home";
import DetailPostList from "../components/post/detail_post_list";

export default class DetailPostListPage extends Component{
    render(){
        return(
            <Template>
                <DetailPostList/>
            </Template>
        )
    }
   
}
