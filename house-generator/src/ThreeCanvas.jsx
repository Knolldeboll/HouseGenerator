import React, { Component, useRef, useEffect } from "react";
import * as THREE from "three";
import RenderingDemo from "./Three/RenderingDemo";
import Rendering from "./Three/Rendering";
import Tests from "./Three/tests.js";
import { useLimitStore } from "./LimitStore.js";
import InputChecker from "./Three/InputChecker.js";
import { useParamStore } from "./ParamStore.js";
import { cos, max } from "three/tsl";
import HouseCalculator from "./Three/HouseCalculator.js";

const ThreeCanvas = (props) => {
  //console.log("ThreeCanvas Component requested!");

  // useRef hält Zeugs zwischen Renders konstant und lädt die nicht neu!

  // Rerender-Stable rendering and tests objects.
  const rendering = useRef(null);
  const tests = useRef(null);

  // CanvasRef ist nur zum Referenzieren des hier erzeugten canvas-Element in Rendering.js da!
  const canvasRef = useRef();

  // Limit setters
  const setMaxCorridorWidth = useLimitStore(
    (state) => state.setMaxCorridorWidth
  );

  // TODO: set to 1
  const setMinApartmentWidthLowerLimit = useLimitStore(
    (state) => state.setMinApartmentWidthLowerLimit
  );

  const setMinApartmentWidthLimit = useLimitStore(
    (state) => state.setMinApartmentWidthLimit
  );

  // TODO: set to minApWidthInput, AUSSER in Spezialfällen wo
  // minApWidth so hoch ist, dass kein Korridor mehr gemacht werden kann!
  // denn dann ist dies hier = longerSide
  const setMaxApartmentWidthLowerLimit = useLimitStore(
    (state) => state.setMaxApartmentWidthLimit
  );

  const setMaxApartmentWidthLimit = useLimitStore(
    (state) => state.setMaxApartmentWidthLimit
  );
  const setMaxN = useLimitStore((state) => state.setMaxN);
  const setMinN = useLimitStore((state) => state.setMinN);

  // Limit getters, for checking inputs against limits!
  const maxNLimit = useLimitStore((state) => state.maxN);
  const minNLimit = useLimitStore((state) => state.minN);

  // Input setters, for deleting
  const setCorridorWidthInput = useParamStore(
    (state) => state.setCorridorWidth
  );
  const setMinApartmentWidthInput = useParamStore(
    (state) => state.setMinApartmentWidth
  );
  const setMaxApartmentWidthInput = useParamStore(
    (state) => state.setMaxApartmentWidth
  );
  const setNInput = useParamStore((state) => state.setN);

  // Input getters
  const widthInput = useParamStore((state) => state.houseWidth);
  const heightInput = useParamStore((state) => state.houseHeight);
  const corrInput = useParamStore((state) => state.corridorWidth);
  const minApWidthInput = useParamStore((state) => state.minApartmentWidth);
  const maxApWidthInput = useParamStore((state) => state.maxApartmentWidth);
  const nInput = useParamStore((state) => state.n);
  const randomInput = useParamStore((state) => state.isRandom);

  // Helper stuff
  const inputChecker = new InputChecker(30, 20, 3, 3);
  const houseCalc = HouseCalculator.getInstance();

  // TODO: Problem. ThreeCanvas component gets rerendered on every input, which fucks up rendering and tests, as they only
  // get initialized on mount. mount however is not redone on every rerender!

  //let rendering;
  //let tests;

  // TODO: Number()-fy the inputs EVERYWHERE to process them for Limit comparision and for passing these into house generation
  // Maybe to do this in SettingsTab is enough!

  /** Call this if inputs have been changed to rerender stuff in the canvas, for example to rerender corridors! */
  // Currently called only on n change
  let refreshCanvas = (fixedN) => {
    /*
    tests.current?.testLivingAreaApartmentFilling(
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput),
      Number(nInput)
    );
    */

    /*
    tests.current?.testAdaptiveMultiCorridorLayout(
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput),
      Number(nInput)
    );
    */

    // Fixed n is for the case that bad inputs are given that would result in
    // say minN = 3 and maxN = 3
    // or minN = 1 and maxN = 1

    let n = fixedN ? fixedN : Number(nInput);
    console.log(
      "------------------>Refresh Canvas with inputs ",
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput),
      Number(maxApWidthInput),
      n
    );

    if (randomInput) {
      tests.current?.testMinMaxAdaptiveMultiCorridorLayout(
        Number(widthInput),
        Number(heightInput),
        Number(corrInput),
        Number(minApWidthInput),
        Number(maxApWidthInput),
        Number(nInput)
      );
      return;
    } else {
      //tests.current?.testRectangleColors();
      tests.current?.testNonrandomMinMaxAdaptiveMultiCorridorLayout(
        Number(widthInput),
        Number(heightInput),
        Number(corrInput),
        Number(minApWidthInput),
        Number(maxApWidthInput),
        n
      );
      return;
    }

    //  tests.current?.testHouseCalcMaxApWidth();

    // Alter shit ohne min max
    if (randomInput) {
      tests.current?.testAdaptiveMultiCorridorLayout(
        Number(widthInput),
        Number(heightInput),
        Number(corrInput),
        Number(minApWidthInput),
        Number(nInput)
      );
    } else {
      tests.current?.testNonrandomAdaptiveMultiCorridorLayout(
        Number(widthInput),
        Number(heightInput),
        Number(corrInput),
        Number(minApWidthInput),
        Number(nInput)
      );
    }

    return;
    tests.current?.testNewHouseConstructor(
      Number(widthInput),
      Number(heightInput)
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

    //tests.current?.unitTests();
  }, []);

  // useEffect mit Dependency auf width values aus dem Store!

  // TODO: Thresholds updaten, wenn alle inputs vorhanden und in limits sind!
  //      die anderen Sachen, die nur width height benötigen, auch so updaten!
  //      alternativ die anderen Inputs löschen, wenn hier was geändert wird!

  // on width / height input change
  useEffect(() => {
    //only update maxminApLimit/corrLimit if width and height is given
    if (widthInput === "" || heightInput === "") return;

    // delete other inputs

    // set minApWidth lower Limit
    setMinApartmentWidthLowerLimit(1);

    // set minApWidth upper limit
    let maxminApLimit = inputChecker.getMaxMinApWidth(widthInput, heightInput);
    console.log(
      " INPUT:  on width/height input: maxminapwidth limit ",
      maxminApLimit
    );
    setMinApartmentWidthLimit(maxminApLimit);

    // set maxApwidth LOWER limit = initial X. Wird gesetzt, wenn sich der regler von minWidth bewegt!
    /*let minmaxApLimit = inputChecker.getMinMaxApWidth(widthInput, heightInput);
    setMaxApartmentWidthLimit(minmaxApLimit);*/

    // set maxApWidth UPPER limit = longerside
    let maxApWidthUpperLimit = inputChecker.getMaxApWidthUpperLimit(
      widthInput,
      heightInput
    );

    // set corridorWidth upper limit
    let maxCorrWidth = inputChecker.getMaxCorridorWidth(
      widthInput,
      heightInput
    );
    setMaxCorridorWidth(maxCorrWidth);

    // TODO: Reset inputs for the values that the limits were changed!
    setCorridorWidthInput("");
    setMaxApartmentWidthInput("");
    setMinApartmentWidthInput("");
    setNInput("");

    console.log(
      " INPUT: on width/height input: maxCorrwidth limit ",
      maxCorrWidth
    );

    //TODO: update n limit if apWidth and corr are also given
  }, [widthInput, heightInput]);

  // Change n Limit on corrInput and all others present

  // on corridorInput changes
  useEffect(() => {
    //console.log("corrInput changed!")

    // Wenn corrInput anders, aber alle anderen da, NUR dann neue Limits für n berechnen!

    // TODO: wenn width height corr da ist, mach immerhin die limits
    if (
      widthInput === "" ||
      heightInput === "" ||
      minApWidthInput === "" ||
      maxApWidthInput === "" ||
      corrInput === ""
    ) {
      return;
    }

    // TODO: Problem: wenn man hier die inputs löscht, werden die Limits bei Änderung von anderen Inputs nicht mehr
    // berechnet!
    setMaxApartmentWidthInput("");
    setMinApartmentWidthInput("");
    setNInput("");

    //

    // thresholds neu berechnen, da corr anders, aber nur wenn
    console.log("INPUT: on corr widht input");
    console.log("calc thresholds");
    let thresholds = houseCalc.calculateMinMaxCorridorThresholds(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput,
      maxApWidthInput
    );

    // Wenn Korridor sich ändert, ändern sich thresholds, also auch die limits für N
    let maxN = inputChecker.getMaxN(thresholds);
    setMaxN(maxN);

    let minN = inputChecker.getMinN(thresholds);

    console.log("-> maxN:", maxN, " minN: ", minN);
    setMinN(minN);
    // set the limit for n
  }, [corrInput]);

  // on minApartmentWidth Input
  useEffect(() => {
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === "" ||
      maxApWidthInput === ""
    )
      return;

    console.log("INPUT: on minApWidth input");
    console.log("-> calculating thresholds: ");
    let thresholds = houseCalc.calculateMinMaxCorridorThresholds(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput,
      maxApWidthInput
    );

    setNInput("");
    setMaxApartmentWidthInput("");
    // Calcs the absolute max value of n
    let maxN = inputChecker.getMaxN(thresholds);
    setMaxN(maxN);
    let minN = inputChecker.getMinN(thresholds);
    setMinN(minN);

    // Wenn nur 1 Apartment möglich, mach das rein.
    // TODO: wenn das der Fall ist, muss auch maxWidth maximiert sein! denn eine Einzelwohnung kann
    // nur existieren, wenn die maxBreite auch die longerside ist!
    // Beispiel: Einzelwohnung = 30 x 40.
    // MaxBreite darf da nicht unter 40 sein. ABER:
    // MinBreite darf da auch nicht über 30 sein!

    // aber wenn das der Fall ist, werden die Slider auf 30/30 bzw 40/40 feststecken! dann kann man ja gar nix mehr machen!

    console.log("-> maxN:", maxN, " minN ", minN);

    // z.B. wenn minN = 2 und maxN = 2, gibts genau 2 Aps. Refresh also.
    // aber auch, wenn minN = 1 und maxN = 1.
    // mal schauen ob der canvas das handeln kann.
    /* if (maxN != -Infinity && minN != -Infinity && maxN == minN) {
      console.log("fixedNInput is", maxN);
      refreshCanvas(maxN);
    }
*/

    // TODO: wenn die minApWidth schon so groß ist, dass KEIN KORRIDOR mehr gemacht werden kann, dann male automatisch ein
    // House mit 1 Apartment!
    // gib dann nen fick auf maxWidth, denn das muss dann 40 sein!

    if (maxN == 1 && minN == 1) {
      setMaxApartmentWidthLimit();
    }

    if (maxN != -Infinity && minN != -Infinity) {
      console.log("fixedNInput is", minN);
      refreshCanvas(minN);
      return;
    }

    // TODO: wenn maxN = minN kann nur eine bestimmte Zahl an Apartments rein!
    // Refreshe dann sofort mit dem entsprechenden n

    // TODO: wenn maxN = 1 und minN = 1, dann mach auch nur 1 Apartment rein!
  }, [minApWidthInput]);

  // TODO: recalc n limit on maxapwidth change

  // on maxApartmentWidth Input
  useEffect(() => {
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === "" ||
      maxApWidthInput === ""
    )
      return;

    // Calcs the absolute max value of n
    // TODO: Change getMaxN to handle maxWidth input

    console.log("INPUT: on maxApWidth input");
    console.log("-> calculating thresholds: ");
    let thresholds = houseCalc.calculateMinMaxCorridorThresholds(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput,
      maxApWidthInput
    );

    //Die min/maxWidth beeinflussen direkt das minN/maxN, also update das!
    let maxN = inputChecker.getMaxN(thresholds);
    setMaxN(maxN);

    let minN = inputChecker.getMinN(thresholds);
    setMinN(minN);

    console.log("-> maxApWidth input, maxN:", maxN, " minN ", minN);

    // z.B. wenn minN = 2 und maxN = 2, gibts genau 2 Aps. Refresh also.
    // aber auch, wenn minN = 1 und maxN = 1.
    // mal schauen ob der canvas das handeln kann.
    /*
    if (maxN != -Infinity && minN != -Infinity && maxN == minN) {
      console.log("fixedNInput is", maxN);
      refreshCanvas(maxN);
      return;
    }
*/

    if (maxN != -Infinity && minN != -Infinity) {
      console.log("fixedNInput is", minN);
      refreshCanvas(minN);
      return;
    }
    // Mach das mit fixed n zum einmaligen machen vom mindest-N-Apartment bei änderung von maxApInput
  }, [maxApWidthInput]);

  // on nInput changes
  useEffect(() => {
    console.log("nInput Changed to ", nInput);

    // Hier muss alles drin sein!
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === "" ||
      maxApWidthInput === "" ||
      nInput === ""
    ) {
      console.log("but returned!");
      return;
    }

    if (Number(nInput) > Number(maxNLimit)) {
      console.log("Entered n", nInput, " is too big! maxNLimit is ", maxNLimit);
      return;
    }

    if (Number(nInput) < Number(minNLimit)) {
      console.log(
        "Entered n",
        nInput,
        " is too small! minNLimit is ",
        minNLimit
      );
      return;
    }

    if (Number(nInput) == 0) {
      console.log("Can't process 0 apartments");
      return;
    }

    refreshCanvas();
  }, [nInput]);

  useEffect(() => {
    console.log("isRandom im Canvas: ", randomInput);

    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === "" ||
      nInput === ""
    ) {
      return;
    }

    refreshCanvas();
    // TODO: In tests irgendwas abändern.
    // H
  }, [randomInput]);
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
