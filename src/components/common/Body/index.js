/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Footer
 **/

import * as React from "react";
import {NavLink} from "react-router-dom";
import "./index.scss";

const {Component} = React;

class Body extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="c-body">
                <NavLink to="/about">About</NavLink>
            </div>
        )
    }
}

export default Body;
