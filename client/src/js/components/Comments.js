/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Post from "./Post";
export default class Comments extends React.Component {

    constructor(props){
        super(props);


        this.newCommentHandler=this.newCommentHandler.bind(this);
        let token = localStorage.getItem("token");
        this.state = {data: [], token: token};

        console.log("constructor comments  ");
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

    newCommentHandler(e) {

        let data = this.state.data;
        data.Comments = [e, ...data.Comments];
        this.setState({data: data});
    }

    render() {
        if (!this.state.token) {
            return (<div> Please Login</div>)
        }

        let comments =null;
        let post = null;
        if (!this.state.data.Comments) {
            post = <div>something went wrong ;(</div>;
            comments=<div>No comments ;(</div>
        }
        else {
            post = <Post data={this.state.data} link={false}/>;
            comments = this.state.data.Comments.map((object, i) => {
                return <Comment data={object} key={i}/>;
            })
        }

        return (
            <div>
                {post}

                <h2>Comments</h2>
                <CommentForm postId={this.props.match.params.postId}  newCommentHandler={this.newCommentHandler} />
                {comments}
            </div>
        )
    }

}