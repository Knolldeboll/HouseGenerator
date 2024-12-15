import * as THREE from 'three';


// Speichern von Vertices (Koordinaten) und auch Seitenlängen des Rechtecks
// TODO: Seichern der Vertices als "upperLeftCorner" "lowerLeftCorner" und "rightXY" zur Referenzierung:
// z.B.: Gib untere Rechte Ecke vom Nachbarraum. 

//TODO: Rename to "Apartment", also File

// Only Job: Take Vertices and Generate a Shape out of it.

class ShapeObject {

    constructor(vertices, materialColor) {

        // Set vertices later via method, as they are not known before generating the floor plan
        this.vertices = vertices;

        console.log("new ShapeObject, vertices ", vertices[0])

        // Auto-calculate on vertice setting
        this.width = null;
        this.height = null;
        this.aspectRatio = null;

        //console.log("vert coords" +verticeCoordinates)
        this.shape = null;
        this.geometry = null;
        // TODO: get Material from parameters
        this.material = new THREE.MeshStandardMaterial({ color: materialColor, side: THREE.DoubleSide });  //side: THREE.DoubleSide, 
        this.mesh = null; // Info: Initialize fields with no value

        this.createShape();
    }

    // Used to set vertices during the squarified treemap algorithm

    // Use THREE.Shape to create a ShapeGeometry based mesh
    createShape() {


        this.shape = new THREE.Shape();

        // Set currentPoint to point 0 ?? 
        this.shape.moveTo(this.vertices[0].x, this.vertices[0].y);
        // Set lines in the Shape object
        // Problem liegt hier!
        this.vertices.slice(1).forEach(vert => {
            // console.log("line to "+  vert.x +vert.y)
            this.shape.lineTo(vert.x, vert.y)
        }
        )

        /*
                // Test for the shape: (so klappts!)
                this.shape.moveTo(0, 0);
                this.shape.lineTo(5, 0);
                this.shape.lineTo(2.5, 5);
                this.shape.lineTo(0, 0);
        */

        // Create ShapeGeometry from shape (will be 2D)
        this.geometry = new THREE.ShapeGeometry(this.shape);


        //console.log("geometry debug:" + this.geometry.attributes.position.count);

        // Create Mesh from geometry and material
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    getMesh() {
        return this.mesh;
    }

    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getAspectRatio() {
        return this.aspectRatio;
    }
}

export default ShapeObject;