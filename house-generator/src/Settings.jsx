import { SettingsTab } from "./SettingsTab";
import React, { Component, useState } from "react"; // Oben ein Bereich, der mehrere Inputdingers für Settings enthält

// Oben ein Bereich, der mehrere Inputdingers für Settings enthält
const Settings = (props) => {
  console.log("Settings props: ", props);
  const [n, setN] = useState(6);
  const [buildingWidth, setBuildingWidth] = useState(10);
  const [buildingHeight, setBuildingHeight] = useState(10);
  const [corridorWidth, setCorridorWidth] = useState(2);
  const [minapatmentArea, setMinapatmentArea] = useState(6);
  const [maxApartmentArea, setMaxApartmentArea] = useState(12);
  const [maxAR, setMaxAR] = useState(1.5);

  return (
    // div surrounds one setting tab
    <div
      style={{
        width: "100vw",
        height: "20vh",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "darkgrey",
      }}
    >
      <SettingsTab
        n={n}
        labelText="Apartments"
        onDataChange={props.onDataChange}
      />{" "}
      <SettingsTab n={n} labelText="Test1" onDataChange={props.onDataChange} />
      <SettingsTab n={n} labelText="Test2" onDataChange={props.onDataChange} />
      <SettingsTab n={n} labelText="Test3" onDataChange={props.onDataChange} />
      <SettingsTab n={n} labelText="Test4" onDataChange={props.onDataChange} />
    </div>
  );
};
export default Settings;
