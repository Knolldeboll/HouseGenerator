import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { thickness } from "three/tsl";

class Rendering {
  // This class initiates everything that three.js needs to render and containts the animation update loop
  // also exposes the addToScene() Method, which centralizes adding stuff to the scene

  constructor(canvasRef, widthFactor, heightFactor) {
    this.canvasRef = canvasRef;
    this.scene = new THREE.Scene();
    this.wrapper = document.getElementById("canvas-wrapper");
    console.log("Wrapper: ", this.wrapper);
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;

    this.meshes = [];

    // Camera
    // (fov, aspect ratio,  view frustrum, view frustru,)

    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initHelpers();
    this.initControls();

    this.animate();
    window.addEventListener("resize", this.handleWindowResize);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      ((window.innerWidth * this.widthFactor) / window.innerHeight) *
        this.heightFactor,
      0.1,
      1000
    );
  }

  initRenderer() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });

    // Renderer initialize
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Hier ist das wichtige!
    // Direkt scalen geht, wenn kein div um beide Components rum ist!
    // Geht auch mit div, auf jeden Fall wenn kein css dabei ist.
    this.renderer.setSize(
      this.wrapper.clientWidth,
      this.wrapper.clientHeight,
      false
    );
    this.camera.position.setZ(30);
  }

  initLights() {
    // Lights: Lichteffekte ..
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(1, 1, 1);
    const ambientLight = new THREE.AmbientLight();
    const lighthelper = new THREE.PointLightHelper(pointLight);
    this.scene.add(pointLight, ambientLight, lighthelper);
  }

  initHelpers() {
    // General helpers
    const gridhelper = new THREE.GridHelper(200, 50);
    this.scene.add(gridhelper);
  }

  initControls() {
    this.oControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  unmount() {
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
      //this.camera.aspect = window.innerWidth / window.innerHeight;
      console.log("Resize");
      this.camera.aspect = this.wrapper.clientWidth / this.wrapper.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.wrapper.clientWidth,
        this.wrapper.clientHeight,
        false
      );
    }
  };

  // Generate mesh from vertices, given in typical object literal format
  generateMeshFromVertices(vertices, material) {
    if (vertices.length == 2) {
      console.log("Go line");
      return this.generateLine(vertices, material.color);
    }

    let shape = new THREE.Shape();

    const values = Object.values(vertices);

    if (values.length == 2) {
      return this.generateLine(values);
    }
    console.log("Values of the vertices:", values);
    // Set currentPoint to point 0 ??
    shape.moveTo(values[0].x, values[0].y);
    // Set lines in the Shape object
    // Problem liegt hier!

    values.slice(1).forEach((vert) => {
      // console.log("line to " + vert.x + vert.y)
      shape.lineTo(vert.x, vert.y);
    });
    //shape.lineTo(values[0].x, values[0].y);

    let geometry = new THREE.ShapeGeometry(shape);

    /*
                // Test for the shape: (so klappts!)
                this.shape.moveTo(0, 0);
                this.shape.lineTo(5, 0);
                this.shape.lineTo(2.5, 5);
                this.shape.lineTo(0, 0);
        */

    let mesh = new THREE.Mesh(geometry, material);
    //console.log("geometry debug:" + this.geometry.attributes.position.count);

    return mesh;
  }

  generateLine(verts, color) {
    const start = new THREE.Vector3(verts[0].x, verts[0].y, 0);
    const end = new THREE.Vector3(verts[1].x, verts[1].y, 0);

    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: 0xff4400 });
    const line = new THREE.Line(geometry, material);

    return line;
  }

  // To be called from the businessLogic
  // So is the Business logic responsible for generating meshes?
  // All THREE.js Stuff should be done here I think...

  /**
   * Adds one Mesh to the scene
   * @param {The Mesh to be added} mesh
   */
  addToScene(mesh) {
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  /**
   * Adds all Meshes from a List to the scene
   * @param {List of Meshes} meshes
   */
  addAllToScene(meshes) {
    for (let m of meshes) {
      // console.log("Add all mesh to scene:",m)
      this.scene.add(m);
      this.meshes.push(m);
    }
  }

  clearScene() {
    // .clear is too harsh!
    // only remove the meshes.
    this.scene.remove(...this.meshes);

    console.log(this.scene);
    this.meshes = [];
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate the Cube
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }

    // Render the Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };
}

export default Rendering;
