import React, { Component } from "react";
export class SettingsTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Apartments
        </label>
        <input
          type="email"
          className="form-control w-25"
          id="exampleFormControlInput1"
          placeholder={this.props.n} //onChange nimmt Callback aus den Props!
          //TODO: aktuellen Value reinpacken
          // Value ist im state drinnrn
          onChange={this.props.onChange}
        ></input>
      </div>
    );
  }
}
