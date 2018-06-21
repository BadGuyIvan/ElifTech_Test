import React, { Component } from "react";
import "./styles/Tree.scss";

class Tree extends Component {

    render() {
      const data = this.props.data;
      return (
            <ul className="tree">
                {data && data.map(item => (
                <li key={item._id}>
                    {item.companyName} <span>{item.estimatedEarnings}</span>
                    {item.children.length != 0 && <Tree data={item.children} />}
                </li>
                ))}
            </ul>
      )
    }
}

export default Tree;