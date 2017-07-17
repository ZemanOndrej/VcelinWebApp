/**
 * Created by Ondrej on 17/07/2017.
 */
import * as React from "react";
export default class Image extends React.Component {

    constructor(props) {
        super(props);
        this.onclick = this.onclick.bind(this);
    }

    onclick(e) {
        this.props.openBigImageHandler(this.props.index)
    }

    render() {
        let image = this.props.image;
        return (
            <div style={{padding: "10px 20px 10px 20px", display: "inline-block"}} onClick={this.onclick}>
                <img style={{height: "100px", width: "100px"}} src={image}/>
            </div>
        )
    }
}