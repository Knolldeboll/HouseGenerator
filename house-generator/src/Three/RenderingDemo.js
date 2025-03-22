import * as THREE from "three";

class RenderingDemo{
    constructor(canvasRef){

        this.scene = new THREE.Scene();

        // Initialize Camera
        this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        this.camera.position.z = 5;
    
        // Initialize Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    
        // Hier jetzt den anderen Müslimüll rein
    
    
        // Start Animation Loop
        this.startAnimationLoop();
    
        // Handle Window Resize
        window.addEventListener("resize", this.handleWindowResize);

    }

    startAnimationLoop = () => {
        this.animationId = requestAnimationFrame(this.startAnimationLoop);
    
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


} export default RenderingDemo;