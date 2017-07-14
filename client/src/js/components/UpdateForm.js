/**
 * Created by zeman on 11-May-17.
 */
import {serverAddress} from "../serverConfig";
import React from "react";
export default class UpdateForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.state={error:null, message:this.props.data.message};

        this.handleUpdate= this.handleUpdate.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    handleUpdate(event){

        event.preventDefault();
        fetch(`${serverAddress}/vcelin/api/${this.props.type}s/${this.props.data.ID}`, {
            method: "PUT",
            mode: "cors",
            body:JSON.stringify({Message:this.state.message}),
            cache: "default",
            headers: {"Content-type": "application/json", "token":localStorage.getItem("token")}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.props.closeModal();
                        this.props.updateHandler({Message: this.state.message, ID: this.props.data.ID});

                    });
                }

            });


    }

    handleMessageChange(event){
        this.setState({message: event.target.value})
    }

    handleDelete(event) {
        event.preventDefault();
        fetch(`${serverAddress}/vcelin/api/${this.props.type}s/${this.props.data.ID}`, {
            method: "DELETE",
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json", "token":localStorage.getItem("token")}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.props.closeModal();
                        this.props.deleteHandler(this.props.data.ID);

                    });
                }

            });

    }

    render() {
        return (
            <div >
                <div style={{
                    zIndex: "1000",
                    position: "fixed",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                    opacity: "0.75"
                }}>
                </div>

                <div style={{
                    border: "black solid 1px",
                    zIndex: "1000", position: "fixed", top: "30%", left: "30%", margin: "0 auto",
                    height: "40%", width: "40%",
                    backgroundColor: "#d6d6d6", opacity: "1"
                }}>

                    <form >
                        <div className="input-group">
                        <textarea value={this.state.message} onChange={this.handleMessageChange} className="form-control" type="text" placeholder="Message" rows="3"

                        />
                        </div>
                        <button onClick={this.handleUpdate} className="btn btn-primary">Update</button>
                    </form>

                    <button onClick={this.handleDelete}> Delete</button>
                    <button onClick={this.props.closeModal}>Cancel</button>

                </div>
            </div>
        )
    }

}
