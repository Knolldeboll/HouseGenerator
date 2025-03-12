import React, { Component } from "react";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 6,
    };
  }

  //TODO: Inputfeld einfügen. onChange wird die callback-Funktion aus den Props aufgerufen
  // onChange wird von allen Input Feldern unterstützt! Kann also angepasst werden
  render() {
    return (
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Apartments
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder={this.state.n}
          //onChange nimmt Callback aus den Props!
          //TODO: aktuellen Value reinpacken
          // Value ist im state drinnrn
          onChange={this.props.onChange}
        ></input>
      </div>
    );
  }
}
export default Settings;
