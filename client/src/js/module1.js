import React from "react";
import ReactDOM from "react-dom";

class Layout extends React.Component{
    render(){
        return (
            <h1>Hello worlda</h1>
        )
    }
}
const app  = document.querySelector("#app");
ReactDOM.render(<Layout/>,app);