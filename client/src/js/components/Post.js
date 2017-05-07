/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Link from "react-router-dom/es/Link";
export default class Post extends React.Component {

    constructor(props){
        super(props)


    }
    render(){
        let data = this.props.data;
        console.log("post data prop:", this.props.data);
        return(
            <div style={{padding:"10px 20px 10px 20px"}}>
                <h3>
                {data.message}
                </h3>

                <span>
                    {data.CreatedAt}
                </span>
                <span>sent:
                    {data.User.name}
                </span>
                <Link to={"/post/"+data.ID}>Comments</Link>
            </div>
        )
    }

}