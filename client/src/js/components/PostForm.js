/**
 * Created by zeman on 08-May-17.
 */
import React from "react";
export default class PostForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {error: null, message: ""};

        this.handleSendPost = this.handleSendPost.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);

    }

    handleMessageChange(event) {

        this.setState({message: event.target.value})
    }

    handleSendPost(event) {

        event.preventDefault();
        console.log("message ", this.state.message);

        if (this.state.message) {
            let data = JSON.stringify({
                "Message": this.state.message
            });
            fetch("http://localhost:5513/vcelin/api/posts", {
                method: "POST",
                body: data,
                mode: "cors",
                cache: "default",
                headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((json) => {

                            console.log(json.post, json.message);

                            this.props.newPostHandler(json.post)
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

                <form onSubmit={this.handleSendPost.bind(this)}>
                    <div className="input-group">
                        <textarea className="form-control" type="text" placeholder="Message" rows="3"
                                  value={this.state.message}
                                  onChange={this.handleMessageChange}/>
                    </div>
                    <button className="btn btn-primary">Send</button>
                    {this.renderError()}
                </form>
            </div>
        )
    }
}