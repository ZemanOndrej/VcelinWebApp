/**
 * Created by zeman on 08-May-17.
 */
import React from "react";
import {serverAddress} from "../../serverConfig";

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
            let data = JSON.stringify({
                Message: this.state.message,
                PostId: this.props.postId

            });
            fetch(`${serverAddress}/vcelin/api/comments`, {
                method: "POST",
                body: data,
                mode: "cors",
                cache: "default",
                headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((json) => {
                            this.props.newCommentHandler(json.comment);
                            this.setState({message: ""});

                        });
                    }

                });
        } else {
            this.setState({error: "Message is empty"});
        }

    }

    renderError() {
        if (!this.state.error) {
            return null;
        }

        return <div style={{color: 'red'}}>{this.state.error}</div>;
    }

    render() {
        return (
            <div style={{padding: "10px 20px 10px 20px"}}>

                <form>
                    <div className="input-group">
                        <textarea className="form-control" type="text" placeholder="Message" rows="3"
                                  value={this.state.message}
                                  onChange={this.handleMessageChange}/>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleSendComment}>Send</button>
                    {this.renderError()}
                </form>
            </div>
        )
    }
}