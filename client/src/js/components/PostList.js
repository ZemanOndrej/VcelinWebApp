/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Post from "./Post";
import PostForm from "./PostForm";
import {removeDuplicates} from "../util";

export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.newPostHandler = this.newPostHandler.bind(this);
        this.deletePostHandler = this.deletePostHandler.bind(this);
        this.updatePostHandler = this.updatePostHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        window.addEventListener("scroll", this.handleScroll);

        let token = localStorage.getItem("token");
        this.state = {token: token, page: 0, data: []};
        this.loadPosts()
    }

    loadPosts() {
        if (this.state.token) {
            fetch("http://ozeman.tk/vcelin/api/postspage/" + this.state.page, {
                method: "GET",
                headers: {"token": this.state.token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                if (json.data) {
                                    let data = this.state.data.concat(json.data);
                                    data = removeDuplicates(data);

                                    this.setState({"data": data});
                                } else {
                                    this.setState({error: json.message, lastPage: true})
                                }
                            });
                    }
                    else if (response.status === 401) {
                        localStorage.clear();
                        this.props.history.push("/vcelin")
                    }
                });
        }

    }

    handleScroll() {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.lastPage) {
                this.setState({page: this.state.page + 1});
                this.loadPosts();
            }
        }
    }

    newPostHandler(e) {
        this.setState({data: [e, ...this.state.data]});
    }

    deletePostHandler(postId) {

        let data = this.state.data;
        data = data.filter(c => c.ID !== postId);
        this.setState({data: data});
    }

    updatePostHandler(event) {
        let data = this.state.data;
        for (let post of this.state.data) {
            if (post.ID === event.ID) {
                post.message = event.Message;
                break;
            }
        }
        this.setState({data: data})
    }

    render() {

        if (!this.state.token) {
            return (<div> Please Login</div>);
        }
        let posts = null;

        if (!this.state.data) {
            posts = <div>No posts ;(</div>
        } else {
            posts = this.state.data.map((object, i) => {
                return <Post data={object} key={i} link={true}
                             deletePostHandler={this.deletePostHandler}
                             updatePostHandler={this.updatePostHandler}/>;
            })
        }
        return (
            <div>
                <h2>Posts</h2>
                <PostForm newPostHandler={this.newPostHandler}/>
                {posts}
                <div>
                    <span>
                        {this.state.error}
                    </span>
                </div>
            </div>
        )
    }
}
