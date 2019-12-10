/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Header
 **/

import * as React from "react";
import {Link} from "react-router-dom";
import "./index.scss";

const {Component} = React;

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Link to={this.props.to} className="header">
                {this.props.title}
            </Link>
        )
    }
}

export default Header;