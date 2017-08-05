/**
 * Created by Ondrej on 17/07/2017.
 */
import * as React from "react";
import {serverAddress} from "../../serverConfig";

export default class Image extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            isSelected: false
        };
        this.handleImageEnlarge = this.handleImageEnlarge.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.showDelete) {
            this.setState({isSelected: false})
        }
    }

    handleImageDelete() {
        this.props.handleImageDelete(this.props.image.filename);
        if (this.props.isImageSelectable) {
            this.setState({isSelected: !this.state.isSelected});
        }
    }

    handleImageEnlarge(e) {
        this.props.openBigImageHandler(this.props.index);
        e.stopPropagation();
    }

    render() {
        return (
            <div className="generalPadding" style={{display: "inline-block"}}>

                <img
                    className={"imagePreview " + (this.props.showDelete && this.state.isSelected ? "selectedImage" : null )}
                    style={{height: "100px", width: "100px"}}
                    src={(this.props.image.data ? this.props.image.data : `${serverAddress}/vcelin/img/${this.props.image.filename}`)}
                    onClick={this.handleImageEnlarge}/>
                {this.state.token && this.props.showDelete ?
                    <div style={{position: "relative", width: "0", height: "0"}}>
                        <span className="spanClick spanImageClickDelete glyphicon glyphicon-remove-circle"
                              onClick={this.handleImageDelete}>
                        </span>
                    </div>
                    : null}
            </div>

        )
    }
}