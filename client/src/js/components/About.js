import React from "react";
import {serverAddress} from "../serverConfig";

export default class About extends React.Component {

    render() {
        let images = [{filename: "vcelinTim.jpg"}];

        return (
            <div>
                <div className="aboutPage"></div>
                <div className="aboutContainer generalPadding">

                    <div className="aboutText">
                        <h1 className="generalPadding">About</h1>
                        <p className="generalPadding">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy
                            text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                            make a type specimen book. It has

                        </p>
                        <div className="aboutStuff">
                            <img src={`http://${serverAddress}/vcelin/staticImg/vcelinTim.jpg`}
                                 style={{height: "200px", float: "left"}}/>
                            <iframe
                                src="https://goo.gl/gyXvJH" style={{border: 0}}
                                width="200" height="200" frameBorder="0" allowFullScreen>
                            </iframe>
                        </div>

                    </div>

                </div>
            </div>


        )
    }
}