import React, { Component } from "react";
export const SettingsCheckTab = (props) => {
  //console.log("SettingsTab props: ", props);

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
      <div class="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
          onChange={(event) => {
            props.onChange(event.target.checked);
          }}
        />
      </div>
    </div>
  );
};
