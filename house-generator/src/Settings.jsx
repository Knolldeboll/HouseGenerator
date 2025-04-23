import { use } from "react";
import { useLimitStore } from "./LimitStore";
import { SettingsTab } from "./SettingsTab";
import React, { Component, useState } from "react"; // Oben ein Bereich, der mehrere Inputdingers für Settings enthält
import { useParamStore } from "./ParamStore";
import { SettingsSliderTab } from "./SettingsSliderTab";
import { SettingsCheckTab } from "./SettingsCheckTab";

// Oben ein Bereich, der mehrere Inputdingers für Settings enthält
const Settings = (props) => {
  // console.log("Settings props: ", props);
  //const [n, setN] = useState(6);

  //console.log("Settings Component requested!");

  const n = "-";
  /*
  const [buildingWidth, setBuildingWidth] = useState(10);
  const [buildingHeight, setBuildingHeight] = useState(10);
  const [corridorWidth, setCorridorWidth] = useState(2);
  const [minapatmentArea, setMinapatmentArea] = useState(6);
  const [maxApartmentArea, setMaxApartmentArea] = useState(12);
  const [maxAR, setMaxAR] = useState(1.5);
*/

  // Should currently only contain default values
  /*
  // Der Bums funktioniert iwie nicht, da ist dann konstantes Rerendering
  const { maxCorridorWidth, maxMinApartmentWidth, maxN } = useLimitStore(
    (state) => ({
      maxCorridorWidth: state.maxCorridorWidth,
      maxMinApartmentWidth: state.maxMinApartmentWidth,
      maxN: state.maxN,
    })
  );
  */

  // Limit getters
  const maxCorridorWidth = useLimitStore((state) => state.maxCorridorWidth);

  const minApartmentWidthLowerLimit = useLimitStore(
    (state) => state.minApartmentWidthLowerLimit
  );

  const minApartmentWidthLimit = useLimitStore(
    (state) => state.minApartmentWidthLimit
  );

  const maxApartmentWidthLowerLimit = useLimitStore(
    (state) => state.maxApartmentWidthLowerLimit
  );
  const maxApartmentWidthLimit = useLimitStore(
    (state) => state.maxApartmentWidthLimit
  );

  const maxN = useLimitStore((state) => state.maxN);
  const minN = useLimitStore((state) => state.minN);

  // Param Setters, for passing the inputs from the settings tabs
  const setHouseWidth = useParamStore((state) => state.setHouseWidth);
  const setHouseHeight = useParamStore((state) => state.setHouseHeight);
  const setCorridorWidth = useParamStore((state) => state.setCorridorWidth);
  const setMinApartmentWidth = useParamStore(
    (state) => state.setMinApartmentWidth
  );
  const setMaxApartmentWidth = useParamStore(
    (state) => state.setMaxApartmentWidth
  );
  const setN = useParamStore((state) => state.setN);
  const setRandom = useParamStore((state) => state.setRandom);

  // Param getters
  const currentN = useParamStore((state) => state.n);
  const currentMinWidth = useParamStore((state) => state.minApartmentWidth);
  const currentMaxWidth = useParamStore((state) => state.maxApartmentWidth);

  // da unten bei minWidth bei limitValue rein (minApartmentWidthLimit != "")?(): "x"
  //
  // da sollen jeweils nur werte rein, wenn minApartmentWidthLimit (=shorterSide) gegeben ist, ansonsten X
  // bei min soll auch nur das geprüfte currentMax rein, wenn daas != "" ist. Ansonsten minApartmentWidthLimit
  //

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
        placeHolder={n}
        labelText="House Width"
        onDataChange={setHouseWidth}
      />
      <SettingsTab
        placeHolder={n}
        labelText="House Height"
        onDataChange={setHouseHeight}
      />
      <SettingsTab
        placeHolder={n}
        labelText="Corridor Width"
        limitValue={maxCorridorWidth || "x"}
        onDataChange={setCorridorWidth}
      />
      <SettingsSliderTab
        labelText="Min Apartment Width"
        lowerLimitValue={minApartmentWidthLowerLimit}
        currentValue={currentMinWidth}
        limitValue={minApartmentWidthLimit != "" ? minApartmentWidthLimit : "x"}
        onDataChange={setMinApartmentWidth}
      />

      <SettingsSliderTab
        labelText="Max Apartment Width"
        lowerLimitValue={maxApartmentWidthLowerLimit || "x"}
        currentValue={currentMaxWidth}
        limitValue={maxApartmentWidthLimit || "x"}
        onDataChange={setMaxApartmentWidth}
      />

      <SettingsSliderTab
        labelText="Apartments"
        limitValue={maxN || 0}
        lowerLimitValue={minN || 0}
        currentValue={currentN}
        onDataChange={setN}
      ></SettingsSliderTab>

      <SettingsCheckTab
        labelText="Randomize?"
        onChange={setRandom}
      ></SettingsCheckTab>
    </div>
  );
};

/*
      <SettingsTab
        placeHolder={n}
        labelText="Apartments"
        limitValue={maxN || "x"}
        onDataChange={setN}
      />
*/
export default Settings;
