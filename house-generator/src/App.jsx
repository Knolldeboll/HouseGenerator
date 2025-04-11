import React, { Component, useState, useRef } from "react";
import ThreeCanvas from "./ThreeCanvas";
import Settings from "./Settings";
const App = (props) => {
  const [n, setN] = useState(6);

  // Faktoren für die Größe des Canvas, bezieht sich auf die Größe des Fensters... blöderweise.
  // Wäre cooler, wenn der sich auf die Größe eines umliegenden Div beschränken würde.
  const canvasWidthFactor = 1;
  const canvasHeightFactor = 1;

  console.log("Complete App component requested");
  //TODO: Define more state variables

  //TODO: Aktuell werden Inputs im SettingsTab angenommen, durch gepasste Callback-Methoden
  // über Settings an App weitergegeben und dann an den ThreeCanvas weitergegeben
  // Kann man das nicht über sowas wie nen Globalen State machen?
  // Oder nen StateManager-Component hier erzeugen und an alle relevanten Kinder weitergeben?
  // Das geht per Context!

  //TODO: Context hier erstellen (global zugänglicher State)
  // Dieser kann sowohl hier als auch an allen Stellen, wo er imported wird, gelesen und geschrieben werden
  // Der soll hier die Werte für "n" etc. enthalten und in den SettingsTabs verändert werden können.#

  //TODO: Macht man einen Context pro Variable oder einen für alle und dann iwie alle Variablen einzeln rein?
  // Oder alle States in einem Objekt speichern und dieses dann mitgeben?
  // Wie siehts dann hier mit State und rerendering aus?

  // Der shit hier wird direkt vom Input als callback für das "onChange" verwendet!
  const onDataChange = (value) => {
    //console.log("Data changed: ", onChangeEvent);

    if (value === "") {
      return;
    }
    // setN veranlasst das rerendern des ThreeCanvas durch State-Change
    // setN(value);
    //console.log("State: ", state.current);
  };
  //TODO: (aber nicht so wichtig) hier wieder Flexis reinpacken, damit mit beliebig vielen Settings gearbeitet werden kann
  // Aber die sind ja eh limitiert und ändern sich nicht so oft, da kann man das auch manuell anpassen also
  // Abstände etc.
  //  Das könnte man auch generell eh in den Settings machen
  //TODO: Remove unnecessary divs if a solution is found for the flexbox problem

  // Hier wird automatisch immer der root-div drumrum gepackt.
  // Dieser passt sich an die Inhalte an.
  // Wenn man dann hier sagt 100% passt sich dieser div natürlich nur an den
  // root-div an!
  return (
    <>
      <Settings onDataChange={onDataChange}></Settings>

      <ThreeCanvas
        //className=""

        // Canvas soll eig nur beim rescalen neu gerendert werden.

        widthFactor={canvasWidthFactor}
        heightFactor={canvasHeightFactor}
        // Key enforced ein Re-Rendering. ggf nicht nötig.
        //key={n} // Wenn nur ne Zahl geändert wird, die nichtmal angezeigt wird bzw. in ner custom prop ohne nutzen ist,
        // wird das Component nicht neu gerendert.
        // n={n}
      ></ThreeCanvas>
    </>
  );
};

export default App;
