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
    (state) => state.setMaxApartmentWidthLowerLimit
  );

  const setMaxApartmentWidthLimit = useLimitStore(
    (state) => state.setMaxApartmentWidthLimit
  );
  const setMaxN = useLimitStore((state) => state.setMaxN);
  const setMinN = useLimitStore((state) => state.setMinN);

  // Limit getters, for checking inputs against limits!
  const maxApartmentWidthLowerLimit = useLimitStore(
    (state) => state.maxApartmentWidthLowerLimit
  );
  const maxApartmentWidthLimit = useLimitStore(
    (state) => state.maxApartmentWidthLimit
  );
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

    /*
    tests.current?.testCalcMaxAps(
      Number(widthInput),
      Number(heightInput),
      Number(corrInput),
      Number(minApWidthInput)
    );
*/

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
    setMaxApartmentWidthLimit(maxApWidthUpperLimit);

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
  // TODO: ABCD
  // Ab nem bestimmten Wert für minWidth wird nur EIN Apartment generiert, da hier
  // kein Korridor mehr gemacht werden kann, weil die minWidth dann zu fett ist.
  // dann werden die lower/upper Limits von maxWidth auf fix longerside gesetzt, d.h. maxWidth ist dann longerside.

  // wenn man jetzt ein anderes minWidth festgelegt, wäre ja ein Korridor OK
  // es gibt aber einen wert von maxWidth, den man unterschreiten kann. Ab diesem sind irgendwie keine
  // Apartments mehr möglich.
  // 1. Warum?  -> kleineres maxWidth bedeutet: die Apartments können je weniger Breit sein.
  //            -> die LivingAreas müssen in eine mindestanzahl von Splits geteilt werden, die je kleiner als die maxWidth sind
  //            ->
  //            -> wenn minWidth erhöht wird, sinkt maxN (größere Räume = weniger Räume)
  //            -> wenn maxWidth erhöht wrid, steigt minN ()

  // 2.1 wie gehen wir damit um?
  // 2.2 was ist dieser Wert? und sollte der das eigentliche lower limit von maxWidth sein? -> ja.
  useEffect(() => {
    if (
      widthInput === "" ||
      heightInput === "" ||
      corrInput === "" ||
      minApWidthInput === ""
    )
      return;

    console.log("INPUT: on minApWidth input");
    // Already refresh the lower limit of maxWidth, as minWidth input has been made!

    // TODO: irgendwie kommt hier scheiße rein. der maxApartmentWidthLowerLimit wird tatsächlich zum UPPER LIMIT umgesetzt..
    // aber andersrum irgendwie nix?

    let lowerMaxWidthLimitTEST = inputChecker.getMaxWidthLowerLimit(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput
    );

    // Das untere Limit für maxWidth ist jetzt angepasst an die Berechnung.
    // Aber trotz Korrektheit von diesem Limit wird dann bei den Thresholds was verkackt! Why?

    setMaxApartmentWidthLowerLimit(lowerMaxWidthLimitTEST);

    //if (maxApWidthInput === "") return;

    // TODO: die thresholds sollen ja berechnet werden, wenn
    // sowohl minWidth als auch maxWidth feststehen.
    // Aber: um fehler aus alten Werten für maxWidth zu vermeiden, wird dieser Wert hier noch zurückgesetzt!
    // die thresholds werden aber trotzdem noch mit dem Alten Wert gemacht!
    //
    // Alte Werte wären auch kein Problem, wenn man sicherstellen kann, dass minWidth NICHT über maxWidth rutscht!
    // dann müsste man aber das Limit von minWidth konstant anpassen, und das sieht dumm aus.
    // denn dann ergibt sich so ein dummer Loop aus minWidthUpperLimit = maxWidthCurrent, maxWidthLowerLimit = minWidthCurrent

    //-> Vielleicht nur threshold berechnung, wenn BEIDES (max/minWidth) NEU eingegeben wurde!
    // Reihenfolge wäre dann: erst minWidth eingeben, dann maxWidth eingeben!

    // AUSNAHME: minWidth wird so hoch gesetzt, dass GAR KEIN Korridor generiert werden kann!
    // -> K ist in beiden fällen mit 1 Korridor KLEINER als minWidth
    // Dann generiere automatisch nen 1:1er.
    // den 1:1er-Fall kann man aber nicht mit Thresholds erfassen! denn diese werden erst berechnet, wenn
    // ein neuer maxWidth input kommt!

    // Wenn mit minWidth gespielt wird, muss alles weiter rechts zurückgesetzt werden.
    // ausser maxWidthLowerLimit

    setNInput("");

    // MaxN/minN basieren immer auf Thresholds! Ausser bei 1:1 fällen...
    setMaxN("");
    setMinN("");
    // Dieser muss nach Eingabe von minWidth neu eingegeben werden!
    setMaxApartmentWidthInput("");

    /*
    let maxN = inputChecker.getMaxN(thresholds);
    setMaxN(maxN);
    let minN = inputChecker.getMinN(thresholds);
    setMinN(minN);

    */

    // lower limit von maxApartmentWidth ist normalerweise der input vom minWidth!

    // console.log("-> maxN:", maxN, " minN ", minN);

    // z.B. wenn minN = 2 und maxN = 2, gibts genau 2 Aps. Refresh also.
    // aber auch, wenn minN = 1 und maxN = 1.
    // mal schauen ob der canvas das handeln kann.
    /* if (maxN != -Infinity && minN != -Infinity && maxN == minN) {
      console.log("fixedNInput is", maxN);
      refreshCanvas(maxN);
    }
*/

    // TODO: AUSSER: wenn die minApWidth schon so groß ist, dass KEIN KORRIDOR mehr gemacht werden kann, dann male automatisch ein
    // House mit 1 Apartment!
    // gib dann nen fick auf maxWidth, denn das muss dann 40 sein!

    // TODO: ist wirklich bei JEDEM 1:1er Fall so, dass das minWidth zu groß ist für nen Korridor?

    // TODO: Nochmal separat Checken, (inputChecker), ob minWidh zu groß für nen Korridor ist!
    // also bei i = 1: bei beiden seiten schauen ob k < minWidth wäre

    // Hier wird geprüft, ob der minWidth zu groß für überhaupt nen Korridor wäre!
    // Dann wäre automatisch single apartment!
    // das ist dann auch Konsistent mit den Thresholds, die dann aber nicht hier berechnet werden.
    // Denn die sollen erst nach freshem Eingeben von beiden width-Werten berechnet und in minN/maxN umgesetzt werden.

    if (
      inputChecker.isMinWidthTooBigForCorridor(
        widthInput,
        heightInput,
        corrInput,
        minApWidthInput
      )
    ) {
      // Nur Single Apartment möglich
      setMaxN(1);
      setMinN(1);
      console.log(
        "     single apartment Case detected! on minApartmentWidth input is too big for even one corridor"
      );
      setMaxApartmentWidthLowerLimit(
        inputChecker.getMaxApWidthUpperLimit(widthInput, heightInput)
      );

      // max ap widht input und lowerLimit = longerside!
      // den Input und beide limits auf max setzen, damit da nichts mehr kaputt gemacht werden kann.
      // weil: wenn der minInput so groß ist, dass kein Korridor mehr möglich ist, dann gibts ein einzelnes Apartment
      // dieses ist dann shorterside x longerside.
      // minWidth muss dann <= shorter sein (ists eh wegen limit), kann aber auch kleiner sein. Das Ap überschreitet
      // dann aber eh die mindestbreite, denn die echte minimalbreite = shorterside!
      // maxWidth muss dann genau longerside sein! denn das einzelApartment ist dann auf einer Seite GENAU longerside
      // dh, zu sagen "maximalBreite" < longerside soll dann verboten werden!
      //

      // Achtung: das hier sollte den maxWidth useEffect Triggern!
      // in dem werden dann thresholds mit minWidth/ maxWidth berechnet,
      // Wo auf jeden Fall ein 1:1 case rauskommen sollte!

      // das setzen triggert ein Refresh. Das sorgt fürs schlussendliche Rendern des single apartments.
      // ansonsten, also bei möglicherweise >=1 Korridor Fällen, wird NUR bei Änderung von maxWidth gerendert!

      setMaxApartmentWidthInput(
        inputChecker.getMaxApWidthUpperLimit(widthInput, heightInput)
      );
    }

    /*
    
    if (maxN == 1 && minN == 1) {
      // Wenn insg nur 1:1 geht, dann render das direkt!
      // max Ap width lower limit = longerside
      // max ap widht upper limit = longerside (ist eh)

      refreshCanvas(minN);
      return;
    }


    // Jedes Mal N auf den Minimalwert für n setzen, damit überhaupt was angezeigt wird!
    if (maxN != -Infinity && minN != -Infinity) {
      console.log("fixedNInput is", minN);
      refreshCanvas(minN);
      return;
    }

    */

    // TODO: wenn maxN = minN kann nur eine bestimmte Zahl an Apartments rein!
    // Refreshe dann sofort mit dem entsprechenden n

    // TODO: wenn maxN = 1 und minN = 1, dann mach auch nur 1 Apartment rein!
  }, [minApWidthInput]);

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

    // Hier MÜSSEN schon alle vorigen inputs gemacht worden sein.

    let thresholds = houseCalc.calculateMinMaxCorridorThresholds(
      widthInput,
      heightInput,
      corrInput,
      minApWidthInput,
      maxApWidthInput
    );

    console.log(">THRESHOLDS after maxWidth Input: ", thresholds);

    //Die min/maxWidth beeinflussen direkt das minN/maxN, also update das!
    let maxN = inputChecker.getMaxN(thresholds);
    setMaxN(maxN);

    let minN = inputChecker.getMinN(thresholds);
    setMinN(minN);

    console.log(
      "-->  on maxApWidth input, set maxN:",
      maxN,
      " set minN ",
      minN
    );

    //

    // TODO: Sicherstellen, dass nun die richtige anzahl an Corridoren/apartments gerendert wird.
    // Also auch nochmal auf von Thresholds hervorgerufene 1:1 oder n:n fälle prüfen und dann direkt
    // mit refresh(fixedN) rendern,
    // oder sonst auch einfach mit dem neuen minN rendern!

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
      console.log("on successful maxWidth INPUT, set nInput to minN ");
      console.log("fixedNInput is", minN);

      setNInput(minN);
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
