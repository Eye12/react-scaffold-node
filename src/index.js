import * as React from "react";
import * as ReactDOM from "react-dom";
import "./global.scss";

const {Component} = React;

class Template extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div>Hello world</div>
                <div id="img1"></div>
                <div id="img2"></div>
            </div>
        )
    }
}
ReactDOM.render(<Template/>, document.getElementById("root"));
