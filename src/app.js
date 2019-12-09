import * as React from "react";
import * as ReactDOM from "react-dom";
import "./global.scss";
const {Component} = React;

class App extends Component {
    render() {
        return <div style={styles}>Hello</div>
    }
}

const styles = {
    width: "100%",
    height: "100%",
    backgroundColor: "red"
};

ReactDOM.render(<App/>, document.getElementById("root"));
