/**
 * Created by zeman on 08-May-17.
 */
import {serverAddress} from "../../serverConfig";
import React from "react";

export default class PostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null, message: "", token: localStorage.getItem("token")};
        this.handleSendPost = this.handleSendPost.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);

    }

    handleMessageChange(event) {
        this.setState({message: event.target.value})
    }

    handleSendPost(event) {

        event.preventDefault();

        if (this.state.message) {
            let data = JSON.stringify({
                "Message": this.state.message
            });
            fetch(`${serverAddress}/vcelin/api/posts`, {
                method: "POST",
                body: data,
                mode: "cors",
                cache: "default",
                headers: {"Content-type": "application/json", "token": this.state.token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((json) => {
                            json.post.Comments = [];
                            this.props.newPostHandler(json.post);
                            this.setState({message: "", error: null});
                        });
                    } else if (response.status === 401) {
                        this.setState({token: null});
                        localStorage.clear();
                    }
                });
        } else {
            this.setState({error: "Message is empty"});
        }

    }

    render() {
        return (
            <div className="generalPadding">

                <form>
                    <div className="input-group  postForm">
                           <textarea className="form-control postTextArea" type="text" placeholder="Message" rows="4"
                                     cols="70"
                                     value={this.state.message}
                                     onChange={this.handleMessageChange}/>
                        <button className="btn btn-primary postFormButton" onClick={this.handleSendPost}>
                            Send
                        </button>
                    </div>
                    {this.state.error ?
                        <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                </form>
            </div>
        )
    }
}