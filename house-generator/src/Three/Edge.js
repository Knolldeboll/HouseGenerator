// Displays Edges
import * as THREE from "three";
import { RectAreaLight, Vector2 } from "three/webgpu";
import Rectangle from "./Rectangle";
class Edge {
  // TODO: Die Reihenfolge der Vertices festlegen, also z.B. immer im Uhrzeigersinn oder so
  // d.H.
  // bei upperEdge: v1 = upperLeft, v2 = upperRight
  // bei rightEdge: v1 = upperRight, v2 = lowerRight
  // bei lowerEdge: v1 = lowerRight v2 = lowerLeft
  // bei leftEdge: v1 = lowerLeft, v2 = upperLeft

  /**
   *
   * @param {Vector2} v1 Left/Upper Vertice
   * @param {Vector2} v2 Right/Lower Vertice
   */
  constructor(v1, v2) {
    this._vertices = {
      vertice1: v1,
      vertice2: v2,
    };

    this._color = new THREE.Color(Math.random(), Math.random(), Math.random());
    this._material = new THREE.MeshStandardMaterial({
      color: this._color,
      side: THREE.DoubleSide,
    });

    // Same y: horizontal, same x: vertical
    this._isHorizontal =
      this.vertices.vertice1.y == this.vertices.vertice2.y ? true : false;

    this._middleVertice = new THREE.Vector2(
      (this._vertices.vertice1.x + this._vertices.vertice2.x) / 2,
      (this._vertices.vertice1.y + this._vertices.vertice2.y) / 2
    );
  }

  // Return length float
  get length() {
    return this._vertices.vertice1.distanceTo(this._vertices.vertice2);
  }

  get material() {
    return this._material;
  }

  get vertices() {
    return this._vertices;
  }

  get isHorizontal() {
    return this._isHorizontal;
  }

  get middleVertice() {
    return this._middleVertice;
  }

  /**
   * Splits the Edge evenly into n parts
   * @param {} n
   * @returns The newly generated Edges
   */
  splitEvenly(n) {
    //console.log("> split Edge evenly in n edges");
    let subEdges = [];
    let direction = new THREE.Vector2();

    // Has totalLength
    direction.subVectors(this._vertices.vertice2, this._vertices.vertice1);

    let previousVertice = this._vertices.vertice1;

    // Oder: addScaledVector(direction, 1/n) - modifiziert glaub den prevVector!

    for (let i = 0; i < n; i++) {
      // Per step, add 1/n of the distance vector to the initial vector

      let v1 = previousVertice.clone();

      // TODO: Do manually and round...
      let v2 = v1.clone().addScaledVector(direction, 1 / n);

      subEdges.push(new Edge(v1, v2));

      previousVertice = v2;

      // immer so: 0,0 - 0,1  / 0,1 - 0,2  /
    }

    return subEdges;
  }

  /**
   * Splits the Edge in two parts, with one having a length of the
   * provided Parameter
   * @param {} len
   * @returns The two generated Edgess
   */
  splitByLength(len) {
    //console.log("> Split Edge by length ");
    let newEdges = [];

    if (len >= this.length) {
      console.error("Invalid splitting length: too long");
      return undefined;
    }

    let direction = new THREE.Vector2();
    // Has totalLength
    direction.subVectors(this._vertices.vertice2, this._vertices.vertice1);

    let splitScale = len / this.length;

    let v1 = this._vertices.vertice1;
    let v2 = v1.clone();
    v2.addScaledVector(direction, splitScale);

    let v3 = this._vertices.vertice2;

    newEdges.push(new Edge(v1, v2));
    newEdges.push(new Edge(v2, v3));

    return newEdges;
  }

  /**
   * Split Edge into specifed parts
   * @param {number} parts As specific lengths of the new Edges, not percentages
   * @returns The newly generated Edges
   */
  splitIntoParts(parts) {
    let subEdges = [];
    let direction = new THREE.Vector2();

    //TODO: Verify if parts are valid, e.g. sum(parts) <= length

    // Has totalLength
    direction.subVectors(this._vertices.vertice2, this._vertices.vertice1);

    let previousVertice = this._vertices.vertice1;

    let len = this.length;

    // Oder: addScaledVector(direction, 1/n) - modifiziert glaub den prevVector!

    for (let i = 0; i < parts.length; i++) {
      // Per step, add 1/n of the distance vector to the initial vector

      let v1 = previousVertice.clone();

      // TODO: Do manually and round...
      let v2 = v1.clone().addScaledVector(direction, parts[i] / len);

      subEdges.push(new Edge(v1, v2));

      previousVertice = v2;

      // immer so: 0,0 - 0,1  / 0,1 - 0,2  /
    }

    return subEdges;
  }

  /**
   * Spawns a new Rectangle sharing the two Vertices of the Edge as one of its edges
   *@param {float} height The height of the rectangle
   * @param {THREE.Vector2} direction The direction of the rectangle, x = 1: right, x = -1: left, y = 1: up, y = -1: down
   */
  spawnRectangle(height, direction) {
    /*      console.log(
        "> Failed to Spawn Rectangle along Edge with height: ",
        height,
        " and direction: ",
        direction );
     */
    if (this._isHorizontal && direction.x != 0 && direction.y == 0) {
      console.error("Invalid direction for horizontal edge!");
      return undefined;
    }

    if (!this._isHorizontal && direction.x == 0 && direction.y != 0) {
      console.error("Invalid direction for vertical edge!");

      return undefined;
    }

    // new Rect:
    // if horizontal & direction.y == 1: // nach oben
    // if horizontal & direction.y == -1: // nach unten
    // if vertical & direction.x == 1: // nach rechts
    // if vertical & direction.x == -1: // nach links

    let x, y, w, h;

    if (this._isHorizontal) {
      //console.log("is horizontal edge");
      x = this._middleVertice.x;
      // if direction.y == 1: // nach oben
      // if direction.y == -1: // nach unten
      y = this._middleVertice.y + (direction.y * height) / 2;
      w = this.length;
      h = height;
    } else {
      //console.log("is vertical edge");
      // if direction.x == 1: // nach rechts
      // if direction.x == -1: // nach links
      x = this._middleVertice.x + (direction.x * height) / 2;
      y = this._middleVertice.y;
      w = height;
      h = this.length;
    }

    //console.log("new rect in order with: ", w, h, x, y);
    let newRect = new Rectangle().fromCoords(w, h, x, y);
    //console.log("Spawned Rectangle: ", newRect);
    return newRect;
  }

  /**
   * Prints the Vertices of the Edge
   */
  printEdge() {
    console.log(
      "V1: ",
      this._vertices.vertice1,
      "V2: ",
      this._vertices.vertice2
    );
  }
}

export default Edge;
