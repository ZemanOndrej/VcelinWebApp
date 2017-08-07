/**
 * Created by zeman on 11-May-17.
 */
import {serverAddress} from "../serverConfig";
import React from "react";

export default class UpdateForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.state = {error: null, message: this.props.data.message};

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    handleUpdate(event) {
        event.preventDefault();
        if (this.state.message.length > 0) {
            fetch(`http://${serverAddress}/vcelin/api/${this.props.type}s/${this.props.data.ID}`, {
                method: "PUT",
                mode: "cors",
                body: JSON.stringify({Message: this.state.message}),
                cache: "default",
                headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
            })
                .then((response) => {
                    if (response.ok) {
                        this.props.closeModal();
                        this.props.updateHandler({Message: this.state.message, ID: this.props.data.ID});
                    }
                });
        } else {
            this.setState({error: "Message is empty!"})
        }


    }

    handleMessageChange(event) {
        this.setState({message: event.target.value})
    }

    handleDelete(event) {
        event.preventDefault();
        fetch(`http://${serverAddress}/vcelin/api/${this.props.type}s/${this.props.data.ID}`, {
            method: "DELETE",
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
        })
            .then((response) => {
                if (response.ok) {
                    this.props.closeModal();
                    this.props.deleteHandler(this.props.data.ID);
                }
            });
    }

    render() {
        return (
            <div className="formComponent">
                <div className="overlay">
                </div>

                <div className="formWindow">

                    <h4 className="heading">Update {this.props.type}</h4>

                    <div className="generalPadding" style={{width: "50%"}}>
                        <div style={{display: "inline-block"}}>Message:</div>
                        <p> {this.props.data.message}</p>
                    </div>

                    <form>
                        {this.state.error ?
                            <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                        <div className="input-group">
                        <textarea value={this.state.message} onChange={this.handleMessageChange}
                                  className="form-control updateFormTextarea" type="text" placeholder="Message"
                                  rows="4" cols="70"
                        />
                        </div>
                        <button onClick={this.handleUpdate} className="btn btn-primary">Update</button>
                        <button onClick={this.props.closeModal} className="btn btn-primary">Cancel</button>
                        <button onClick={this.handleDelete} className="btn btn-danger"> Delete</button>
                    </form>
                </div>
            </div>
        )
    }

}
