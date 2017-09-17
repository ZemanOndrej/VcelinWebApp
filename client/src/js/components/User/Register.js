import React from "react";
import {serverAddress} from "../../serverConfig";

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            message: null,
            buttonsEnabled: true,
            token: localStorage.getItem("token"),
            userForm: {
                Username: "",
                RetypePassword: "",
                Email: "",
                Password: ""
            }
        };

        this.handleCancel = this.handleCancel.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleCancel() {
        this.setState({
            error: null,
            message: null,
            buttonsEnabled: true,
            userForm: {
                Username: "",
                RetypePassword: "",
                Email: "",
                Password: ""
            }
        });
    }

    handleRegister() {

        if (this.state.userForm.Password && this.state.userForm.Password.length > 5
            && this.state.userForm.Password === this.state.userForm.RetypePassword) {
            fetch(`http://${serverAddress}/vcelin/api/users`, {
                method: 'POST',
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                    "token": this.state.token,
                },
                body: JSON.stringify(this.state.userForm)
            })
                .then((response) => {
                    if (response.ok) {
                        this.setState({error: "", message: "User successfully created"});
                        response.json().then(j => this.props.handleNewUser(j.user));
                        this.handleCancel();
                    } else {
                        response.json().then(j => this.setState({error: j.message}))
                    }
                });

        } else {
            this.setState({error: "Error: incorrect password."});
        }

    }

    handleChange(event, propertyName) {
        const user = this.state.userForm;
        user[propertyName] = event.target.value;
        this.setState({userForm: user});
    }

    render() {

        if (!this.state.token) {
            return (<div> Please Login</div>);
        }
        return (
            <div className="generalPadding">
                <div>
                    <h1 className="heading">Add New User</h1>
                    <div>

                        <form>
                            <div className="input-group">
                                <input value={this.state.userForm.Email}
                                       onChange={(e) => this.handleChange(e, 'Email')}
                                       className="form-control" type="text" placeholder="Email"
                                       cols="100"/>
                            </div>

                            <div className="input-group">
                                <input value={this.state.userForm.Username}
                                       onChange={(e) => this.handleChange(e, 'Username')}
                                       className="form-control" type="text" placeholder="Username"
                                       cols="100"/>
                            </div>

                            <div className="input-group">
                                <input value={this.state.userForm.Password}
                                       onChange={(e) => this.handleChange(e, 'Password')}
                                       className="form-control" type="password" placeholder="Password"
                                       cols="100"/>
                            </div>

                            <div className="input-group">
                                <input value={this.state.userForm.RetypePassword}
                                       onChange={(e) => this.handleChange(e, 'RetypePassword')}
                                       className="form-control" type="password" placeholder="Retype Password"
                                       cols="100"/>
                            </div>
                        </form>
                    </div>

                    <div>
                        <button disabled={!this.state.buttonsEnabled} onClick={this.handleCancel}
                                className="btn btn-default buttonMargin">Cancel
                        </button>
                        <button disabled={!this.state.buttonsEnabled} className="btn btn-default"
                                onClick={this.handleRegister}>Create user
                        </button>
                    </div>
                    {this.state.error ?
                        <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                    {this.state.message ?
                        <div className="alert alert-success">  {this.state.message}</div> : null}
                </div>


            </div>

        )
    }
}