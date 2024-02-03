import React, { Component } from "react";

import Template from "../templates/home";
import PostList from "../components/post/post_list";

export default class PostListPage extends Component {
    render() {
        return (
            <Template>
                <PostList />
            </Template>
        )
    }

}
