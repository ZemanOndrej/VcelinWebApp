/**
 * Created by zeman on 07-May-17.
 */

import React from "react";
export default class Home extends React.Component {


    render(){


        const userInfo = localStorage.getItem("login");
        return (
            <div>

                <p>
                    Home screen
                </p>

            </div>

        )
    }
}
