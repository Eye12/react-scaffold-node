/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Header
 **/

import * as React from "react";
import "./index.scss";

const {Component} = React;

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="header">Welcome Magical Child's World</div>
        )
    }
}

export default Header;
