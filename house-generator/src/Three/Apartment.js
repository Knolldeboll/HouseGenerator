import * as THREE from "three";
import Tools from "./Tools";
import { RectAreaLight, Vector2 } from "three/webgpu";
import Rectangle from "./Rectangle";

// Speichern von Vertices (Koordinaten) und auch Seitenlängen des Rechtecks
// TODO: Seichern der Vertices als "upperLeftCorner" "lowerLeftCorner" und "rightXY" zur Referenzierung:
// z.B.: Gib untere Rechte Ecke vom Nachbarraum.

class Apartment {
  constructor(apartmentSize, materialColor, width, height, posX, posY) {
    this._apartmentArea = apartmentSize;
    // TODO: get Material from parameters
    this._material = new THREE.MeshStandardMaterial({
      color: materialColor,
      side: THREE.DoubleSide,
    }); //side: THREE.DoubleSide,
    this._width = width;
    this._height = height;
    this._position = new THREE.Vector2(posX, posY);

    // Vertices as iterable list
    this._verticeList = [];

    // Vertices as object literal
    this._vertices = {
      a: null,
      b: null,
      c: null,
      d: null,
    };

    // TODO: notwendigkeit von null-initialisierungen prüfen
    this._shape = null;
    this._geometry = null;
    this._mesh = null;
    this._aspectRatio = null;
    this.calculateVertices();
    this.createShape();
  }

  // Calculates 4 Vertices from position, width and height
  calculateVertices() {
    let a = (this._vertices.a = new Vector2(
      this._position.x - this._width / 2,
      this._position.y - this._height / 2
    ));
    let b = (this._vertices.b = new Vector2(
      this._position.x + this._width / 2,
      this._position.y - this._height / 2
    ));
    let c = (this._vertices.c = new Vector2(
      this._position.x + this._width / 2,
      this._position.y + this._height / 2
    ));
    let d = (this._vertices.d = new Vector2(
      this._position.x - this._width / 2,
      this._position.y + this._height / 2
    ));
    this._verticeList.push(a, b, c, d);
  }
  // Used to set vertices during the squarified treemap algorithm - bullshiii
  setVertices(newVertices) {
    this._vertices = newVertices;

    // Recalculate current with and height
    this._width = newVertices.b.x - newVertices.a.x;
    this._height = newVertices.c.y - newVertices.a.y;

    // this.aspectRatio = width/height vs height/width? Both, as described in original paper
    this._aspectRatio = Math.max(
      this._width / this._height,
      this._height / this._width
    );
  }
  // Use THREE.Shape to create a ShapeGeometry based mesh
  createShape() {
    if (this._verticeList == []) {
      console.log("Vertices not set!");
      return;
    }

    this._shape = new THREE.Shape();

    // Set currentPoint to point 0 ??
    console.log("vertices: ", this._vertices);
    console.log("verticeList: ", this._verticeList);
    this._shape.moveTo(this._verticeList[0].x, this._verticeList[0].y);
    // Set lines in the Shape object

    // Problem liegt hier!
    this._verticeList.slice(1).forEach((vert) => {
      console.log("line to " + vert.x + vert.y);
      this._shape.lineTo(vert.x, vert.y);
    });

    /*
                // Test for the shape: (so klappts!)
                this.shape.moveTo(0, 0);
                this.shape.lineTo(5, 0);
                this.shape.lineTo(2.5, 5);
                this.shape.lineTo(0, 0);
        */

    // Create ShapeGeometry from shape (will be 2D)
    this._geometry = new THREE.ShapeGeometry(this._shape);

    //console.log("geometry debug:" + this._geometry.attributes.position.count);

    // Create Mesh from geometry and material
    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }

  get area() {
    return this._apartmentArea;
  }
  get mesh() {
    return this._mesh;
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get area() {
    return this._apartmentArea;
  }
  get aspectRatio() {
    return this._aspectRatio;
  }

  get mesh() {
    return this._mesh;
  }

  get vertices() {
    return this._vertices;
  }

  logApartment() {
    //console.log("-logging apartment-")
    console.log(
      "set area:",
      this._apartmentArea,
      "set width",
      this._width,
      "set height ",
      this._height,
      " pos ",
      this._position
    );

    //let wFromVerts = Tools.getInstance().distanceBetweenTwoVertices(this.vertices.a, this.vertices.b);
    //let hFromVerts = Tools.getInstance().distanceBetweenTwoVertices(this.vertices.a, this.vertices.d);

    //console.log("vertices ", this.vertices);
    //console.log("width from verts: ", wFromVerts, "height from verts", hFromVerts);

    //let areaFromVerts = hFromVerts * wFromVerts;
    //console.log("area from verts:", areaFromVerts)
    //console.log("set position: ", this._position)
  }

  convertToRectangle() {
    const rect = new Rectangle().fromCoords(
      this._width,
      this._height,
      this._position.x,
      this._position.y
    );
    return rect;
  }
}

export default Apartment;
