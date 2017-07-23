/**
 * Created by Ondrej on 14/07/2017.
 */
import React from "react";
import Image from "./Image";

export default class ImageGallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showImageView: false, selectedImage: -1};

        this.openBigImageHandler = this.openBigImageHandler.bind(this);
        this.closeBigImageHandler = this.closeBigImageHandler.bind(this);
        this.nextImageHandler = this.nextImageHandler.bind(this);
        this.previousImageHandler = this.previousImageHandler.bind(this);

    }

    previousImageHandler() {
        let index = this.state.selectedImage - 1;

        if (index < 0) {
            index = this.props.images.length - 1;
        }

        this.setState({selectedImage: index})
    }

    nextImageHandler() {

        let index = this.state.selectedImage + 1;

        if (index === this.props.images.length) {
            index = 0;
        }
        this.setState({selectedImage: index})
    }

    openBigImageHandler(number) {
        this.setState({selectedImage: number, showImageView: true})
    }

    closeBigImageHandler() {
        this.setState({selectedImage: -1, showImageView: false})
    }

    render() {
        let images = this.props.images;
        if (images) {
            let imageComps = images.map((obj, i) => {
                return <Image image={obj} key={i} index={i} showDelete={this.props.showDelete}
                              handleImageDelete={this.props.handleImageDelete}
                              openBigImageHandler={this.openBigImageHandler}/>;
            });
            return (
                <div className="imageGallery" style={{display: "inline-block", marginTop: "25px"}}>
                    <div id="images">
                        {imageComps}
                    </div>
                    <div id="imageOverlayParent" style={{display: this.state.showImageView ? 'block' : 'none'}}>
                        <div id="imageOverlay"></div>
                        <span className="previousArrow arrow unselectable"
                              onClick={this.previousImageHandler}>&#8249;</span>
                        <span className="nextArrow arrow unselectable" onClick={this.nextImageHandler}>&#8250;</span>
                        <span className="closingXSign" onClick={this.closeBigImageHandler}>&times;</span>
                        <span className="imageNumber">{this.state.selectedImage + 1}/{this.props.images.length}</span>

                        {this.state.selectedImage >= 0 ?
                            (<img id="bigPicture" src={images[this.state.selectedImage].data}/>) : null}
                    </div>

                </div>
            )
        } else {
            return (<div className="imageGallery"></div>)
        }


    }
}