/**
 * @Author: wyy
 * @Date: 2019/12/11
 * @Description: common component named Loading
 **/
import * as React from "react";
import "./index.scss";
const {Component} = React;

class Loading extends Component {
    render() {
        return (
            <div className="loading">Loading</div>
        )
    }
}

export default Loading;
