import React, { Component } from "react";
import * as THREE from "three";
import RenderingDemo from "./RenderingDemo";
import Rendering from "./Rendering";
import Tests from "./tests.js";

class ThreeCanvas extends Component {
  constructor(props) {
    super(props);
    console.log("ThreeCanvas props: ", props);
    // Referenz auf den Canvas, wird in Rendering.js für three.js benötigt
    this.canvasRef = React.createRef();
    // Referenz auf den umschließenden Container, wird für das Resizing benötigt
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
    this.animationId = null;
  }

  componentDidMount() {
    // Initialize Scene
    // Rendering: Three.js Basis
    this.rendering = new Rendering(
      this.canvasRef,
      this.props.widthFactor,
      this.props.heightFactor
    );
    // pepe pepe poo poo
    //this.rendering = RenderingDemo(this.canvasRef);
    // Tests

    //TODO: hier dann die Werte aus Props reingeben.
    let tests = new Tests(this.rendering);

    //tests.testRendering();
    //tests.testVectors();
    //tests.testEdges();
    //tests.testRectangles();
    tests.testHouses(this.props.n);
  }

  componentWillUnmount() {
    this.rendering.unmount();
    // TODO: Den shit hier in Rendering einbinden
  }

  /* Der shit wird ja nirgends verwendet... hier zumindest. Der Renderer hat das ja doppelt
  handleWindowResize = () => {
    if (this.camera && this.renderer) {
      this.camera.aspect =
        ((window.innerWidth * this.props.widthFactor) / window.innerHeight) *
        this.props.heightFactor;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        window.innerWidth * this.props.widthFactor,
        window.innerHeight * this.props.heightFactor
      );
    }
  };

  */

  render() {
    return <canvas ref={this.canvasRef}></canvas>;
  }
}

export default ThreeCanvas;
