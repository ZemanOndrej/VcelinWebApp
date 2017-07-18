/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";
import {removeDuplicates} from "../../util";
import {serverAddress} from "../../serverConfig";
import Article from "./Article";
import ArticleForm from "./ArticleForm";

export default class ArticleList extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.newArticleHandler = this.newArticleHandler.bind(this);

        window.addEventListener("scroll", this.handleScroll);

        let token = localStorage.getItem("token");
        this.state = {token: token, page: 0, data: []};
        this.loadArticles()
    }

    closeModal() {
        this.setState({showModal: false})
    }

    openModal() {
        this.setState({showModal: true})
    }

    loadArticles() {
        fetch(`${serverAddress}/vcelin/api/articlesPage/${this.state.page}`, {
            method: "GET"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((json) => {
                            if (json.data) {
                                let data = this.state.data.concat(json.data);
                                data = removeDuplicates(data);

                                this.setState({"data": data});
                            } else {
                                this.setState({error: json.message, lastPage: true})
                            }
                        });
                }
            });


    }

    handleScroll() {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.lastPage) {
                this.setState({page: this.state.page + 1});
                this.loadArticles();
            }
        }
    }

    newArticleHandler(e) {
        this.setState({data: [e, ...this.state.data]});
    }

    render() {
        let articles = null;

        if (!this.state.data) {
            articles = <div>No Articles(</div>
        } else {
            articles = this.state.data.map((object, i) => {
                return <Article data={object} key={i}/>;
            })
        }
        return (
            <div>
                {this.state.showModal ?
                    <ArticleForm closeModal={this.closeModal} newArticleHandler={this.newArticleHandler}/> : null}

                {this.state.token ?
                    <button className="btn btn-default" onClick={this.openModal}>Create Article</button> : null}
                <h2>Articles</h2>
                {articles}
                <div>
                    <span>
                        {this.state.error}
                    </span>
                </div>
            </div>
        )
    }
}
