import React, { Component, useRef, useEffect } from "react";
import * as THREE from "three";
import RenderingDemo from "./Three/RenderingDemo";
import Rendering from "./Three/Rendering";
import Tests from "./Three/tests.js";

const ThreeCanvas = (props) => {
  //const rendering = useRef();
  // CanvasRef ist nur zum Referenzieren des hier erzeugten canvas-Element in Rendering.js da!
  const canvasRef = useRef();

  //TODO: Muss hier für rendering ne ref verwendet werden?
  // Für canvasRef ja, aber für rendering?

  // useEffect (callback, [dependencies])
  // callback wird bei mount aufgerufen, auch wenn sich dependencies ändern
  // Muss verwendet werden, da Rendering von DOM-Elementen abhängig ist, die erst nach mount vorhanden sind!
  useEffect(() => {
    //callback
    // Initialize Scene
    // Rendering: Three.js Basis
    // Nimm den hier erzeugten canvas und gib dessen Ref an den Rendering-Konstruktor weiter
    // Prinzipiell geht da aber bestimmt auch "findElementById"
    const rendering = new Rendering(
      canvasRef,
      props.widthFactor,
      props.heightFactor
    );

    const tests = new Tests(rendering);
    //this.rendering = RenderingDemo(this.canvasRef);
    // Tests

    //tests.testRendering();
    //tests.testVectors();
    //tests.testEdges();
    //tests.testRectangles();7
    // TODO: Use prop for corridor width
    //tests.testHouses(props.n, 2);
    //tests.testRectangleHelpers();
    tests.testRectangleSTMSplitting();
  }, []);

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
