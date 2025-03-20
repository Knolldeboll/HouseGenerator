import React, { Component } from "react";
export const SettingsTab = (props) => {
  console.log("SettingsTab props: ", props);
  return (
    <div className="mb-3">
      <label htmlFor="exampleFormControlInput1" className="form-label">
        Apartments
      </label>
      <input
        type="email"
        className="form-control w-25"
        id="exampleFormControlInput1"
        placeholder={props.n} //onChange nimmt Callback aus den Props!
        //TODO: aktuellen Value reinpacken
        // Value ist im state drinnrn
        onChange={(e) => {
          props.onDataChange(e.target.value);
        }}
      ></input>
    </div>
  );
};
