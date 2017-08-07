/**
 * Created by zeman on 08-May-17.
 */
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
            this.props.newPostHandler(this.state.message);
            this.setState({message: "", error: null});
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