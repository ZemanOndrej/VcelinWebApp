import React from "react";

export default class LoginControl extends React.Component{


    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleChangeEmail(event){
        this.setState({email: event.target.value})
    }

    handleChangePassword(event){
        this.setState({password: event.target.value})
    }

    render(){

        const isAuthorized = this.state.isAuthorized;
        if(isAuthorized){
            return (
                <div style={{float:"right"}}>
                    <form className="navbar-form" onSubmit={this.handleLogoutClick.bind(this)}>
                        <button className="btn btn-default">
                            Logout
                        </button>
                    </form>
                </div>
            )
        }


        return (
            <div style={{float:"right"}}>
                <form className="navbar-form" onSubmit={this.handleLoginClick.bind(this)}>
                    <div className="input-group">
                        <input className="form-control" type="text" value={this.state.email} placeholder="Email" onChange={this.handleChangeEmail}  />
                    </div>
                    <div className="input-group">
                        <input className="form-control" type="password" value={this.state.password}  placeholder="Password" onChange={this.handleChangePassword}  />
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

        fetch("http://localhost:1337/vcelin/api/login",{
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response)=>{
            if (response.ok){
                this.setState({"isAuthorized":true, error:null});
                return response.json().then((json)=>{
                    this.setState({login:json});
                });
            }

            this.setState({error:"Email or Password are wrong"})
        });
    }

    handleLogoutClick() {
        this.setState({isAuthorized: false , login:null});
    }

    renderError() {
        if (!this.state.error) { return null; }

        return <div style={{ color: 'red' }}>{this.state.error}</div>;
    }
}


