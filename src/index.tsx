import * as React from "react";
import * as ReactDOM from "react-dom";

class TT extends React.Component {
  render() {
    return (
      <div>Hello world</div>
    );
  }
}

ReactDOM.render(<TT/>, document.getElementById("root"));
