/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Post from "./Post";
import PostForm from "./PostForm";
export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.newPostHandler = this.newPostHandler.bind(this);

        let token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:1337/vcelin/api/posts", {
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
                });
        }


    }

    newPostHandler(e) {
        this.setState({data: this.state.data.concat([e])});
    }


    render() {

        let posts=null;

        if (!this.state.data) {
            posts= <div>No posts ;(</div>
        }else {
            posts=this.state.data.map((object, i)=>{
                return <Post data={object} key={i} />;
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
