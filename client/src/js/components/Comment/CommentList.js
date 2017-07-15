/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Post from "../Post/Post";
import {serverAddress} from "../../serverConfig";
import {removeDuplicates} from "../../util";

export default class CommentList extends React.Component {

    constructor(props) {
        super(props);

        this.newCommentHandler = this.newCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
        this.updateCommentHandler = this.updateCommentHandler.bind(this);
        this.deletePostHandler = this.deletePostHandler.bind(this);
        this.updatePostHandler = this.updatePostHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);

        window.addEventListener("scroll", this.handleScroll);

        let token = localStorage.getItem("token");
        this.state = {data: {}, token: token, page: 1};

        if (token) {
            fetch(`${serverAddress}/vcelin/api/posts/${this.props.match.params.postId}`  , {
                method: "GET",
                headers: {"token": token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                this.setState({"data": json.Post});
                            });
                    } else if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("isAuthorized");
                        this.props.history.push("/vcelin")

                    }
                });
        }

    }


    loadMoreComments() {
        if (this.state.token) {
            fetch(`${serverAddress}/vcelin/api/post/${this.props.match.params.postId}/commentspage/${this.state.page}`, {
                method: "GET",
                headers: {"token": this.state.token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                if (json.data) {
                                    let data = this.state.data.Comments.concat(json.data);
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
                this.loadMoreComments();
            }

        }
    }

    updateCommentHandler(event) {
        let data = this.state.data;
        for (let comment of this.state.data.Comments) {
            if (comment.ID === event.ID) {
                comment.message = event.Message;
                break;
            }
        }
        this.setState({data:data})
    }

    deletePostHandler() {
        this.props.history.push("/vcelin/posts")
    }

    updatePostHandler(event) {
        let data = this.state.data;
        data.message = event.Message;
        this.setState({data: data})
    }

    newCommentHandler(e) {

        let data = this.state.data;
        data.Comments = [e, ...data.Comments];
        this.setState({data: data});
    }

    deleteCommentHandler(commentId) {

        let data = this.state.data;
        data.Comments = data.Comments.filter(c => c.ID !== commentId);
        this.setState({data: data});
    }

    render() {
        if (!this.state.token) {
            return (<div> Please Login</div>)
        }

        let comments = null;
        let post = null;
        if (!this.state.data.Comments) {
            post = <div>something went wrong ;(</div>;
            comments = <div>No comments ;(</div>
        }
        else {
            post = <Post data={this.state.data} link={false}
                         deletePostHandler={this.deletePostHandler}
                         updatePostHandler={this.updatePostHandler}/>;
            comments = this.state.data.Comments.map((comment, key) => {
                return <Comment data={comment} updateCommentHandler={this.updateCommentHandler}
                                deleteCommentHandler={this.deleteCommentHandler} key={key}/>;
            })
        }

        return (
            <div>
                {post}

                <h2>Comments</h2>
                <CommentForm postId={this.props.match.params.postId} newCommentHandler={this.newCommentHandler}/>
                {comments}
                <div>
                    <span>
                        {this.state.error}
                    </span>
                </div>
            </div>
        )
    }

}