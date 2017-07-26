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
        this.props.handleImageDelete(this.props.image.FileName);
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
                    style={{height: "100px", width: "100px"}} src={this.props.image.data}
                    onClick={this.handleImageEnlarge}/>

                {/*//             static content rework inc
       style={{height: "100px", width: "100px"}} src={`${serverAddress}/vcelin/img/${this.props.image.name}`}*/}

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