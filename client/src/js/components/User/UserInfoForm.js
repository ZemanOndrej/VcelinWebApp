import React from "react";
import {serverAddress} from "../../serverConfig";

export default class UserInfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            buttonsEnabled: true,
            token: localStorage.getItem("token"),
            userForm: {
                UserId: localStorage.getItem("userId"),
                Username: localStorage.getItem("userName"),
                NewPassword: "",
                RetypeNewPassword: "",
                Email: localStorage.getItem("userEmail"),
                OldPassword: ""
            }
        };

        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleCancel() {

        this.setState({
            error: null,
            buttonsEnabled: true,
            userForm: {
                UserId: localStorage.getItem("userId"),
                Username: localStorage.getItem("userName"),
                NewPassword: "",
                RetypeNewPassword: "",
                Email: localStorage.getItem("userEmail"),
                OldPassword: ""
            }
        })
    }

    handleSave() {
        if (this.state.userForm.OldPassword && this.state.userForm.OldPassword.length > 5) {
            fetch(`http://${serverAddress}/vcelin/api/users/${this.state.userForm.UserId}`, {
                method: 'PUT',
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
                        console.log(this.props);
                        this.props.history.push("/vcelin/");
                        localStorage.clear();
                        location.reload();
                        this.setState({error: ""});
                    } else {
                        response.json().then(j => this.setState({error: j.message}))
                    }
                });

        } else {
            this.setState({error: "Error: incorrect old password (min length6)."});
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
                    <h1 className="heading">Change Your Info</h1>
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
                                <input value={this.state.userForm.OldPassword}
                                       onChange={(e) => this.handleChange(e, 'OldPassword')}
                                       className="form-control" type="password" placeholder="Old Password"
                                       cols="100"/>
                            </div>

                            <div className="input-group">
                                <input value={this.state.userForm.NewPassword}
                                       onChange={(e) => this.handleChange(e, 'NewPassword')}
                                       className="form-control" type="password" placeholder="New Password"
                                       cols="100"/>
                            </div>
                            <div className="input-group">
                                <input value={this.state.userForm.RetypeNewPassword}
                                       onChange={(e) => this.handleChange(e, 'RetypeNewPassword')}
                                       className="form-control" type="password" placeholder="Retype New Password"
                                       cols="100"/>
                            </div>
                        </form>


                    </div>

                    <div>
                        <button disabled={!this.state.buttonsEnabled} onClick={this.handleCancel}
                                className="btn btn-default buttonMargin">Cancel
                        </button>
                        <button disabled={!this.state.buttonsEnabled} className="btn btn-default"
                                onClick={this.handleSave}>Save
                        </button>
                    </div>
                    {this.state.error ?
                        <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                </div>


            </div>

        )
    }
}