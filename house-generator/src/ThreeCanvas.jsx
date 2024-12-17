import React, { Component } from "react";
import * as THREE from "three";
import RenderingDemo from "./RenderingDemo";
import Rendering from "./Rendering";
import Tests from './tests.js';

class ThreeCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.animationId = null;
    }

    componentDidMount() {

        // Initialize Scene
        this.rendering = new Rendering(this.canvasRef);
        // pepe pepe poo poo
        //this.rendering = RenderingDemo(this.canvasRef);
        // Tests

        let tests = new Tests(this.rendering);


        //tests.testRendering();
        //tests.testVectors();
        //tests.testEdges();
        tests.testRectangles();
        //tests.testHouses();
    }

    componentWillUnmount() {

        this.rendering.unmount();
        // TODO: Den shit hier in Rendering einbinden
        return;
        // Stop Animation Loop
        cancelAnimationFrame(this.animationId);

        // Remove Event Listener
        window.removeEventListener("resize", this.handleWindowResize);

        // Dispose of Three.js objects to prevent memory leaks
        this.renderer.dispose();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    handleWindowResize = () => {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    };



    render() {
        return <canvas ref={this.canvasRef}></canvas>;
    }
}

export default ThreeCanvas;