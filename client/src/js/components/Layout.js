/**
 * Created by zeman on 05-May-17.
 */

import React from "react";
import LoginControl from "./Login";
export default class Layout extends React.Component {

    render(){
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Vcelin</a>
                        </div>
                        <LoginControl/>
                    </div>
                </nav>

                <div>

                </div>
                <footer>

                </footer>


            </div>

        )
    }
}