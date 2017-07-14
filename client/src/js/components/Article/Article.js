/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";
export default class Article extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        let data = this.props.data;
        return (
            <div style={{padding: "10px 20px 10px 20px"}}>
                <h3>
                    {data.title}
                </h3>
                <p>
                    {data.text.substring(0, 50)} ...
                </p>

                <span>
                    {data.CreatedAt}
                </span>
                <span>sent:
                    {data.User.name}
                </span>
            </div>
        )
    }
}