import React from "react";
import Home from "./Home";
import About from "./About";
import scroll from "react-scroll/modules/mixins/animate-scroll";

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.checkParams(props)
    }

    componentWillReceiveProps(nextProps) {
        this.checkParams(nextProps)

    }

    checkParams(props) {
        if (props.match.params.about === "about") {
            scroll.scrollToBottom();
        }
    }


    render() {
        return (
            <div>
                <Home/>
                <About/>
            </div>
        )
    }
}