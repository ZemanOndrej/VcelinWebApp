/**
 * Created by zeman on 07-May-17.
 */

import React from "react";
import scroll from "react-scroll/modules/mixins/animate-scroll";

export default class Home extends React.Component {


    render(){
        return (
            <div>

                <div id="homepageBackground">
                </div>
                <div id="mainHeading">
                    Včelín tím
                </div>


                <div onClick={scroll.scrollToBottom}>
                    <div id="aboutLink"> About</div>
                    <span className="arrow unselectable spanClick downArrow">&#9001;</span>
                </div>
            </div>

        )
    }
}
