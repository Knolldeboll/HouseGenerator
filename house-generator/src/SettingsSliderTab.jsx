import React, { Component } from "react";
export const SettingsSliderTab = (props) => {
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

      <input
        type="range"
        className="form-range"
        min={props.lowerLimitValue}
        max={props.limitValue}
        step="1"
        id="customRange3"
        onChange={(e) => {
          props.onDataChange(e.target.value);
        }}
      ></input>

      <div
        style={{
          width: "100%",
          height: "20%",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "darkgrey",
        }}
      >
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Von: {props.lowerLimitValue}
        </label>

        <label htmlFor="exampleFormControlInput1" className="form-label">
          = {props.currentValue}
        </label>
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Bis: {props.limitValue}
        </label>
      </div>
    </div>
  );
};
