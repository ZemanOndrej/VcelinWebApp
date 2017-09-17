import React from "react";
import UserInfoForm from "./UserInfoForm";
import Register from "./Register";
import UserList from "./UserList";
import {serverAddress} from "../../serverConfig";

export default class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {token: localStorage.getItem("token"), userList: []};
        this.handleUserDelete = this.handleUserDelete.bind(this);
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    componentDidMount() {
        if (this.state.token) {
            fetch(`http://${serverAddress}/vcelin/api/users`, {
                method: 'GET',
                mode: "cors",
                cache: "default",
                headers: {
                    "token": this.state.token,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then(j => {
                                this.setState({error: "", userList: j.data})
                            }
                        )
                    } else {
                        response.json().then(j => this.setState({error: j.message}))
                    }
                });
        }
    }

    handleUserDelete(id) {
        this.setState({userList: this.state.userList.filter(u => u.ID !== id)})
    }

    handleNewUser(user) {
        console.log(user);
        this.setState({userList: [...this.state.userList, user]})
    }


    render() {

        if (!this.state.token) {
            return (<div> Please Login</div>);
        }
        return (
            <div>
                <UserInfoForm history={this.props.history}/>
                <Register handleNewUser={this.handleNewUser}/>
                <UserList userList={this.state.userList} handleUserDelete={this.handleUserDelete}/>
            </div>)
    }
}