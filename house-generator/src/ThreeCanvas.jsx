import React, { Component, useRef, useEffect } from "react";
import * as THREE from "three";
import RenderingDemo from "./Three/RenderingDemo";
import Rendering from "./Three/Rendering";
import Tests from "./Three/tests.js";
import { useLimitStore } from "./LimitStore.js";
import InputChecker from "./Three/InputChecker.js";
import { useParamStore } from "./ParamStore.js";
import { cos } from "three/tsl";

const ThreeCanvas = (props) => {
  //console.log("ThreeCanvas Component requested!");

  // useRef hält Zeugs zwischen Renders konstant und lädt die nicht neu!

  // Rerender-Stable rendering and tests objects.
  const rendering = useRef(null);
  const tests = useRef(null);

  // CanvasRef ist nur zum Referenzieren des hier erzeugten canvas-Element in Rendering.js da!
  const canvasRef = useRef();

  const setMaxCorridorWidth = useLimitStore(
    (state) => state.setMaxCorridorWidth
  );
  const setMaxMinApartmentWidth = useLimitStore(
    (state) => state.setMaxMinApartmentWidth
  );

  const setMaxN = useLimitStore((state) => state.setMaxN);

  const widthInput = useParamStore((state) => state.houseWidth);
  const heightInput = useParamStore((state) => state.houseHeight);
  const corrInput = useParamStore((state) => state.corridorWidth);
  const minApWidthInput = useParamStore((state) => state.minApartmentWidth);
  const nInput = useParamStore((state) => state.n);

  const inputChecker = new InputChecker(30, 20, 3, 3);

  // TODO: Problem. ThreeCanvas component gets rerendered on every input, which fucks up rendering and tests, as they only
  // get initialized on mount. mount however is not redone on every rerender!

  //let rendering;
  //let tests;

  // TODO: Number()-fy the inputs EVERYWHERE to process them for Limit comparision and for passing these into house generation
  // Maybe to do this in SettingsTab is enough!

  /** Call this if inputs have been changed to rerender stuff in the canvas, for example to rerender corridors! */
  // Currently called only on n change
  let refreshCanvas = () => {
    /*
    tests.current?.testLivingAreaApartmentFilling(
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput),
      Number(nInput)
    );
    */

    tests.current?.testAdaptiveMultiCorridorLayout(
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput),
      Number(nInput)
    );
  };

  // useEffect (callback, [dependencies]) -> hier spezielle Bedeutung!
  // Hier wird callback bei mount aufgerufen
  // Muss verwendet werden, da Rendering von DOM-Elementen abhängig ist, die erst nach mount vorhanden sind!
  useEffect(() => {
    console.log("MOUNTING");

    rendering.current = new Rendering(
      canvasRef,
      props.widthFactor,
      props.heightFactor
    );

    tests.current = new Tests(rendering.current);

    console.log(" Objects after mounting: ", rendering.current, tests.current);
    //callback
    // Initialize Scene
    // Rendering: Three.js Basis
    // Nimm den hier erzeugten canvas und gib dessen Ref an den Rendering-Konstruktor weiter
    // Prinzipiell geht da aber bestimmt auch "findElementById"
    //const InputChecker = new InputChecker();
    // Limit Values are generated here (from House/other js stuff) and accessed in the Settings tabs
    //TODO: Context for the Limit values, which are then passed into the settings tabs as limitValue prop for the labels
    // Settings Values are generated in the Settings Tabs and accessed here in the house/js stuff in method calls
    // for example: n changes, call house.generateMultiLayout(...,n,...)
    // TODO: How do I process value changes in the
    //this.rendering = RenderingDemo(this.canvasRef);
    // Tests
    //tests.testRendering();
    //tests.testVectors();
    //tests.testEdges();
    //tests.testRectangles();
    // TODO: Use prop for corridor width
    //tests.testHouses(props.n, 2);
    //tests.testHouseWithSTMRooms(props.n, 2);
    //tests.testRectangleHelpers();
    //
    //tests.testRectangleSTMSplitting();
    //tests.testHouseCalculator(10, 20, 6, 5);
    //tests.testHouseDefinedShape(30, 20);
    // Perfection!
    //tests.testMultiCorridorHouse(30, 20, 2, 3);
    //tests.testEdgeRectSpawn();
    // Das hier funzt glaub ganz gut soweit.
    //tests.testLivingAreaGeneration(30, 20, 2, 3);
    // Das hier funzt oft nicht:
    // Möglicherweise wegen Endlosem Random Splitting
    //console.log("hi");
    //tests.testRectangleRandomWidthSplitting();
    // Test Limit generation
    // Das hier soll eig nur ausgeführt werden, wenn ein Input geändert wurde
    // und die Inputs werden in SettingsTab geändert
    //setMaxMinApartmentWidth(inputChecker.getMinApWidthRange()[1]);
  }, []);

  // useEffect mit Dependency auf width values aus dem Store!

  // on width / height input change
  useEffect(() => {
    //only update maxminApLimit/corrLimit if width and height is given
    if (widthInput === "" || heightInput === "") return;

    let maxminApLimit = inputChecker.getMaxMinApWidth(widthInput, heightInput);
    console.log();
    setMaxMinApartmentWidth(maxminApLimit);

    let maxCorrWidth = inputChecker.getMaxCorridorWidth(
      widthInput,
      heightInput
    );
    setMaxCorridorWidth(maxCorrWidth);

    //TODO: update n limit if apWidth and corr are also given
  }, [widthInput, heightInput]);

  // Change n Limit on corrInput and all others present

  // on corridorInput changes
  useEffect(() => {
    //console.log("corrInput changed!")
    if (
      widthInput === "" ||
      heightInput === "" ||
      minApWidthInput === "" ||
      corrInput === ""
    ) {
      return;
    }

    let n = inputChecker.getMaxN(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput
    );

    // set the limit for n
    setMaxN(n);
  }, [corrInput]);

  // on minApartmentWidth Input
  useEffect(() => {
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === ""
    )
      return;

    let n = inputChecker.getMaxN(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput
    );

    setMaxN(n);
  }, [minApWidthInput]);

  // on nInput changes
  useEffect(() => {
    console.log("nInput Changed to ", nInput);
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === "" ||
      nInput === ""
    ) {
      console.log("but returned!");
      return;
    }

    refreshCanvas();
  }, [nInput]);
  //Bei canvas den canvasRef reinpacken, damit in canvasRef dieses Element referenziert werden kann

  // canvasWrapper dictates the width/heigt of the canvas
  return (
    <div
      id="canvas-div"
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <div
        id="canvas-wrapper"
        style={{
          width: "60vw",
          height: "70vh",
          overflow: "hidden",
          margin: "auto",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default ThreeCanvas;
