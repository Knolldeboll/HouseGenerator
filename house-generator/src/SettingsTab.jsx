import React, { Component } from "react";
export const SettingsTab = (props) => {
  console.log("SettingsTab props: ", props);

  return (
    <div
      style={{
        margin: "5px",
        border: "1px solid grey",
        borderRadius: "5px",
        padding: "5px",
      }}
    >
      <label htmlFor="exampleFormControlInput1" className="form-label">
        {props.labelText}
      </label>
      <input
        type="email"
        className="form-control"
        id="exampleFormControlInput1"
        placeholder={props.placeHolder} //onChange nimmt Callback aus den Props!
        //TODO: aktuellen Value reinpacken
        // Value ist im state drinnrn
        onChange={(e) => {
          props.onDataChange(e.target.value);
        }}
        style={{ width: "80%" }}
      ></input>

      {props.limitValue && (
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Limit: {props.limitValue}
        </label>
      )}
    </div>
  );
};
