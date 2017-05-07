/**
 * Created by zeman on 07-May-17.
 */

import * as React from "react";
import Link from "react-router-dom/es/Link";
import Login from "./Login";
export default class Header extends React.Component {
    render(){
        return(
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">Vcelin</Link>
                    </div>

                    <ul className="nav navbar-nav">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/posts">Posts</Link></li>

                    </ul>
                    <Login history={this.props.history}/>
                </div>
            </nav>
        )
    }

}
