/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Post from "./Post";
import PostForm from "./PostForm";
import {h} from "react-router-dom";

export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.newPostHandler = this.newPostHandler.bind(this);

        let token = localStorage.getItem("token");
        this.state = {token: token};

        if (token) {
            fetch("http://localhost:5513/vcelin/api/posts", {
                method: "GET",
                headers: {"token": token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                this.setState({"data": json.data});
                            });
                    }
                    else if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("isAuthorized");
                        this.props.history.push("/")
                    }
                });
        }


    }

    newPostHandler(e) {
        this.setState({data: [e, ...this.state.data]});
    }


    render() {


        if (!this.state.token) {
            return (<div> Please Login</div>);
        }
        let posts=null;

        if (!this.state.data) {
            posts= <div>No posts ;(</div>
        }else {
            posts=this.state.data.map((object, i)=>{
                return <Post data={object} key={i} link={true}/>;
            })
        }
        return (
            <div>
                <h2>Posts</h2>
                <PostForm newPostHandler = {this.newPostHandler}/>

                {posts}
            </div>
        )
    }
}
