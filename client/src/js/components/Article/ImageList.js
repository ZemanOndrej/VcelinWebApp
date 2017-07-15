/**
 * Created by Ondrej on 14/07/2017.
 */
import React from "react";
export default class ImageList extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        let data = this.props.data;
        return (
            <div style={{padding: "10px 20px 10px 20px"}}>
                Imagelist
            </div>
        )
    }
}