// npm run dev


import './style.css'
import Rendering from './Rendering.js';
import * as THREE from 'three';
import Tests from './tests.js';
// Datei heißt anders ?!? aber ok

const rendering = new Rendering();
rendering.animate();

// Code below here can be reached! 




// Tests

let tests = new Tests(rendering);


//tests.testRendering();
//tests.testVectors();
//tests.testEdges();
//tests.testRectangles();
tests.testHouses();


//TODO: Test Edges, Test new Rectangles

//TODO: Test Rectangle Class.
// Generate vertices, then create a Rectangle and generate its mesh. 
// Put the mesh into the Rendering by calling "addToScene"


