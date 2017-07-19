/**
 * Created by Ondrej on 17/07/2017.
 */
import * as React from "react";

export default class Image extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {token: localStorage.getItem("token")};
        this.handleImageDelete = this.handleImageDelete.bind(this);

    }

    handleImageDelete() {
        this.props.handleImageDelete(this.props.image.FileName);
    }

    onClick() {
        this.props.openBigImageHandler(this.props.index)
    }

    render() {
        let image = this.props.image;
        return (
            <div style={{padding: "10px 20px 10px 20px", display: "inline-block"}}>
                <img style={{height: "100px", width: "100px"}} src={image.data} onClick={this.onClick}/>

                {this.state.token ? <span className="spanClick" onClick={this.handleImageDelete}>Delete</span> : null}
            </div>

        )
    }
}