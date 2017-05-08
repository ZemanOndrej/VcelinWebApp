/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
export default class Comments extends React.Component {

    constructor(props){
        super(props);

        this.state = {data:[]};

        this.newCommentHandler=this.newCommentHandler.bind(this);
        let token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:1337/vcelin/api/post/"+this.props.match.params.postId+"/comments", {
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

    newCommentHandler(e) {
        this.setState({data: this.state.data.concat([e])});
    }

    render() {
        let comments =null;
        if (!this.state.data) {
            comments=<div>No comments ;(</div>
        }else {
            comments=this.state.data.map((object, i)=>{
                return <Comment data={object} key={i}/>;
            })
        }
        return (
            <div>
                <h2>Comments</h2>
                <CommentForm postId={this.props.match.params.postId}  newCommentHandler={this.newCommentHandler} />
                {comments}
            </div>
        )
    }

}