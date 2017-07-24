/**
 * Created by Ondrej on 17/07/2017.
 */
import * as React from "react";

export default class Image extends React.Component {

    constructor(props) {
        super(props);
        this.handleImageEnlarge = this.handleImageEnlarge.bind(this);
        this.state = {token: localStorage.getItem("token"), isSelected: false};
        this.handleImageDelete = this.handleImageDelete.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.showDelete) {
            this.setState({isSelected: false})
        }

    }

    handleImageDelete() {
        this.setState({isSelected: !this.state.isSelected});
        this.props.handleImageDelete(this.props.image.FileName);
    }

    handleImageEnlarge() {
        this.props.openBigImageHandler(this.props.index)
    }

    render() {
        let image = this.props.image;
        return (
            <div style={{padding: "10px 20px 10px 20px", display: "inline-block"}}
                 className={(this.props.showDelete && this.state.isSelected ? "selectedImage" : null )}>
                <img style={{height: "100px", width: "100px"}} src={image.data} onClick={this.handleImageEnlarge}/>

                {this.state.token && this.props.showDelete ?
                    <span className="spanClick" onClick={this.handleImageDelete}>Delete</span> : null}
            </div>

        )
    }
}