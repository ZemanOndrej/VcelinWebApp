/**
 * Created by zeman on 08-May-17.
 */
import React from "react";

export default class CommentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {error: null, message: ""};
        this.handleSendComment = this.handleSendComment.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);

    }

    handleMessageChange(event) {

        this.setState({message: event.target.value})
    }

    handleSendComment(event) {
        event.preventDefault();

        if (this.state.message) {
            this.props.newCommentHandler(this.state.message,);
            this.setState({message: "", error: null});
            // let data = JSON.stringify({
            //     Message: this.state.message,
            //     PostId: this.props.postId
            //
            // });
            // fetch(`http://${serverAddress}/vcelin/api/comments`, {
            //     method: "POST",
            //     body: data,
            //     mode: "cors",
            //     cache: "default",
            //     headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
            // })
            //     .then((response) => {
            //         if (response.ok) {
            //             return response.json().then((json) => {
            //
            //
            //             });
            //         }
            //
            //     });
        } else {
            this.setState({error: "Message is empty"});
        }

    }

    render() {
        return (
            <div className="generalPadding">

                <form>
                    <div className="input-group postForm">
                        <textarea className="form-control postTextArea" type="text" placeholder="Message" rows="4"
                                  cols="70"
                                  value={this.state.message}
                                  onChange={this.handleMessageChange}/>
                        <button className="btn btn-primary postFormButton" onClick={this.handleSendComment}>Send
                        </button>

                    </div>
                    {this.state.error ?
                        <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                </form>
            </div>
        )
    }
}