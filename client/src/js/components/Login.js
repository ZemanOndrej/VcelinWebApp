import React from "react";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        let authorized = localStorage.getItem("isAuthorized");

        this.state = {
            error: null,
            isAuthorized: authorized
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value})
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value})
    }

    render() {

        const isAuthorized = this.state.isAuthorized;
        if (isAuthorized) {
            return (
                <div style={{float: "right"}}>
                    <form className="navbar-form" onSubmit={this.handleLogoutClick.bind(this)}>
                        <button className="btn btn-default">
                            Logout
                        </button>
                    </form>
                </div>
            )
        }
        return (
            <div style={{float: "right"}}>
                <form className="navbar-form" onSubmit={this.handleLoginClick.bind(this)}>
                    <div className="input-group">
                        <input className="form-control" type="text" value={this.state.email} placeholder="Email"
                               onChange={this.handleChangeEmail}/>
                    </div>
                    <div className="input-group">
                        <input className="form-control" type="password" value={this.state.password}
                               placeholder="Password" onChange={this.handleChangePassword}/>
                    </div>
                    <button className="btn btn-primary">Login</button>
                    {this.renderError()}
                </form>
            </div>
        )
    }

    handleLoginClick(event) {
        event.preventDefault();

        let data = JSON.stringify({
            "Password": this.state.password,
            "Email": this.state.email
        });

        fetch("http://localhost:1337/vcelin/api/login", {
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.setState({"loginInfo": json,"isAuthorized": true, error: null});
                        localStorage.setItem("token", json.token);
                        localStorage.setItem("isAuthorized", true);
                    });
                }

                this.setState({error: "Email or Password are wrong"})
            });
    }

    handleLogoutClick() {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthorized");
        this.setState({isAuthorized: false, loginInfo: null});
    }

    renderError() {
        if (!this.state.error) {
            return null;
        }

        return <div style={{color: 'red'}}>{this.state.error}</div>;
    }
}


