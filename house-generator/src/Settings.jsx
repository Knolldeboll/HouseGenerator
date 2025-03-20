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
    <>
      <SettingsTab n={n} onDataChange={props.onDataChange} />

      <SettingsTab n={n} onDataChange={props.onDataChange} />
    </>
  );
};
export default Settings;
