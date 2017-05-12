/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Post from "./Post";
export default class Comments extends React.Component {

    constructor(props) {
        super(props);

        this.newCommentHandler = this.newCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
        this.updateCommentHandler = this.updateCommentHandler.bind(this);

        let token = localStorage.getItem("token");
        this.state = {data: {}, token: token};

        if (token) {
            fetch("http://localhost:5513/vcelin/api/posts/" + this.props.match.params.postId, {
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
                        this.props.history.push("/")

                    }
                });
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
            post = <Post data={this.state.data} link={false}/>;
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
            </div>
        )
    }

}