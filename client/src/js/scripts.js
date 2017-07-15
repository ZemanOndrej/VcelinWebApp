/**
 * Created by zeman on 04-May-17.
 */
import ReactDOM from "react-dom";
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PostList from "./components/Post/PostList";
import Home from "./components/Home";
import Header from "./components/Header";
import CommentList from "./components/Comment/CommentList";
import ArticleList from "./components/Article/ArticleList";
import ArticleDetails from "./components/Article/ArticleDetails";


const App = () => (
    <Router>
        <div>
            <Header />
            <Switch>
                <Route exact path="/vcelin" component={Home}/>
                <Route path={"/vcelin/posts/:postId"} component={CommentList}/>
                <Route exact path={"/vcelin/posts"} component={PostList}/>
                <Route path={"/vcelin/articles/:articleId"} component={ArticleDetails}/>
                <Route exact path={"/vcelin/articles"} component={ArticleList}/>
            </Switch>
        </div>
    </Router>
);

ReactDOM.render(<App/>,document.querySelector("#app"));

