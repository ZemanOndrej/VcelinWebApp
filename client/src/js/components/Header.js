/**
 * Created by zeman on 07-May-17.
 */

import * as React from "react";
import Link from "react-router-dom/es/Link";
import Login from "./User/Login";
import {serverAddress} from "../serverConfig";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {token: localStorage.getItem("token"), todayNewPostCount: 0}
    }

    componentDidMount() {
        if (this.state.token) {
            fetch(`http://${serverAddress}/vcelin/api/todayPostsCount`, {
                method: 'GET',
                mode: "cors",
                cache: "default",
                headers: {
                    "token": localStorage.getItem("token")
                }
            }).then((response) => {
                    if (response.ok) {
                        response.json().then(o => {
                            this.setState({todayNewPostCount: o.todayNewPostCount});
                        });

                    }
                }
            );
        }
    }

    render() {
        let token = localStorage.getItem("token");
        let mobile = window.matchMedia("(max-width: 767px)");
        return (
            <nav className="navbar navbar-inverse navbar-static-top" id="navigation" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar-collapseId" aria-expanded="true">
                            <span className="sr-only"> Toggle navigation</span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                            <span className="icon-bar"> </span>
                        </button>
                        <Link className="navbar-brand" to="/vcelin">Včelín Team</Link>

                    </div>

                    <div className="collapse navbar-collapse" id="navbar-collapseId">

                        <ul className="nav navbar-nav">
                            <li><Link data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                      to="/vcelin">Home</Link>
                            </li>
                            <li><Link data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                      to="/vcelin/about">About</Link></li>
                            <li><Link data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                      to="/vcelin/articles">
                                Articles</Link></li>
                            {token ? <li>
                                <Link data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                      to="/vcelin/createArticle">Create Article</Link>
                            </li> : null}
                            {token ?
                                <li>
                                    <Link data-toggle={mobile.matches ? "collapse" : null}
                                          data-target="#navbar-collapseId" to="/vcelin/posts">Posts
                                        {this.state.todayNewPostCount > 0 ?
                                            <span
                                                className="spanNotification">{this.state.todayNewPostCount}</span> : null}
                                    </Link>
                                </li> : null
                            }
                        </ul>
                        <Login history={this.props.history} updateHeader={(p) => this.setState({isAuthorized: p})}/>
                    </div>
                </div>
            </nav>
        )
    }

}
