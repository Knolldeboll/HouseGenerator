// Vite should automatically only import one instance of three.js

import * as THREE from "three";
import Edge from "./Edge";
import ShapeObject from "./ShapeObject";
import PreApartment from "./PreApartment";
import Apartment from "./Apartment";
import Tools from "./Tools";

//TODO: Getters/Setters

class Rectangle {
  constructor() {
    // Random between 0x000000 and 0xffffff
    // TODO: Fix... even though rgb have values, its white. Maybe cap to integer
    //this._color =  new THREE.Color(0xffff00);
    // Warum kommt hier immer weiße farbe?
    this._color = new THREE.Color(Math.random(), Math.random(), Math.random());

    this._material = new THREE.MeshStandardMaterial({
      color: this._color,
      side: THREE.DoubleSide,
    });

    this._width = undefined;
    this._height = undefined;
    this._area = undefined;
    this._pos = undefined;
    this._isHorizontal = undefined;
    this._longerSideLength = undefined;
    this._shorterSideLength = undefined;
    /**
     * Vertices in following order.
     * upper left, upper right, lower right, lower left
     */
    this._vertices = undefined;

    /**
     * Edges in following order:
     * upper, right, lower, left
     */
    this._edges = undefined;
    //  this.generateVertices();
    //  this.generateEdges();
  }

  /**
   *
   * @param {THREE.Color} color
   * @returns
   */
  setColor(color) {
    this._color = color;
    this._material = new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    return this;
  }

  // 2nd constructors
  // Verts must be given in clockwise order, starting at upper left
  /**
   * creates a rectangle from the given vertices
   * also generates it's edges and other values
   * @param {Object} verts Value object defined as upperLeft, upperRight, lowerRight, lowerLeft with Vector2 values
   * @returns {Rectangle}
   */
  fromVertices(verts) {
    //console.log("> Rectangle from verts");

    // If Object given, transform to array
    let values = verts;

    // TODO: Achtung: Arrays sind auch objects..
    // Array.isArray(dingens) prüft, ob ein Objekt ein Array ist!
    // ggf austauschen, sonst wird umsonst von Array zu Array konvertiert..
    if (typeof verts === "object") {
      values = Object.values(verts);
    }

    //TODO: Refine, so that verts has exactly the naming as if generated
    // What
    let upperLeft = values[0];
    let upperRight = values[1];
    let lowerRight = values[2];
    let lowerLeft = values[3];

    this._vertices = {
      upperLeft: upperLeft,
      upperRight: upperRight,
      lowerRight: lowerRight,
      lowerLeft: lowerLeft,
    };

    this._width = this._vertices.upperLeft.distanceTo(
      this._vertices.upperRight
    );
    this._height = this._vertices.upperLeft.distanceTo(
      this._vertices.lowerLeft
    );

    this._area = this._width * this._height;

    //console.log("Set area to " ,this._width , " x ",this._height," = ",this._area)

    // Generate Position
    let x = this._vertices.upperLeft.x + this._width / 2;
    let y = this._vertices.lowerLeft.y + this._height / 2;
    this._pos = {
      x: x,
      y: y,
    };

    // Generate Edges
    this.generateEdges();
    // Irgendwas saugt hier Arsch
    this.calculateOrientation();

    return this;
  }

  fromCoords(width, height, x, y) {
    //console.log("> Rectangle from verts");
    this._width = width;
    this._height = height;
    this._area = this._width * this._height;
    //console.log("Set area to " ,this._width , " x ",this._height," = ",this._area)
    this._pos = {
      x: x,
      y: y,
    };

    // Generate Vertices and Edges
    this.generateVertices();
    this.generateEdges();
    this.calculateOrientation();
    return this;
  }

  /**
     * Generate the vertices from the position and height/width
     Vertice naming redefined to speaking names.  
     * 
     */

  generateVertices() {
    let upperLeft = new THREE.Vector2(
      this._pos.x - this._width / 2,
      this._pos.y + this._height / 2
    );
    let upperRight = new THREE.Vector2(
      this._pos.x + this._width / 2,
      this._pos.y + this._height / 2
    );
    let lowerRight = new THREE.Vector2(
      this._pos.x + this._width / 2,
      this._pos.y - this._height / 2
    );
    let lowerLeft = new THREE.Vector2(
      this._pos.x - this._width / 2,
      this._pos.y - this._height / 2
    );

    this._vertices = {
      upperLeft,
      upperRight,
      lowerRight,
      lowerLeft,
    };
  }

  /**
   * Generates and saves Edges from this Rects vertices
   *
   */
  generateEdges() {
    // ul > ur > lr > ll7
    // TODO: Überlegen, welches immer v1/v2 ist

    //console.log("> Generate Edges from Vertices");
    if (this._vertices == undefined) {
      console.error(
        "Cannot Generate Edges, vertices are not defined for this rect!"
      );
    }

    // v1 immer links/obe
    // v2 immer rechts/unten
    let upperEdge = new Edge(
      this._vertices.upperLeft,
      this._vertices.upperRight
    );
    let rightEdge = new Edge(
      this._vertices.upperRight,
      this._vertices.lowerRight
    );
    let lowerEdge = new Edge(
      this._vertices.lowerLeft,
      this._vertices.lowerRight
    );
    let leftEdge = new Edge(this._vertices.upperLeft, this._vertices.lowerLeft);

    this._edges = {
      upperEdge,
      rightEdge,
      lowerEdge,
      leftEdge,
    };

    this._longerSideLength = Math.max(this._width, this._height);
    this._shorterSideLength = Math.min(this._width, this._height);
  }

  /**
   * Generates a ShapeMesh from the vertices of this rectangle
   * @returns
   */
  generateShapeMesh() {
    const shape = new THREE.Shape();

    const values = Object.values(this._vertices);
    // Set currentPoint to point 0 ??
    shape.moveTo(values[0].x, values[0].y);
    // Set lines in the Shape object
    // Problem liegt hier!

    values.slice(1).forEach((vert) => {
      // console.log("line to "+  vert.x +vert.y)
      shape.lineTo(vert.x, vert.y);
    });

    // Save shape
    this._shape = shape;

    const geometry = new THREE.ShapeGeometry(shape);

    /*
                // Test for the shape: (so klappts!)
                this.shape.moveTo(0, 0);
                this.shape.lineTo(5, 0);
                this.shape.lineTo(2.5, 5);
                this.shape.lineTo(0, 0);
        */

    // Create ShapeGeometry from shape (will be 2D)
    this._geometry = geometry;

    const mesh = new THREE.Mesh(this._geometry, this._material);
    //console.log("geometry debug:" + this.geometry.attributes.position.count);

    // Create Mesh from geometry and material
    this._mesh = mesh;

    return this._mesh;
  }

  // Split into Random Sections with area between min, max
  // In
  splitRandomlyMinMax(n, min, max) {
    // Vorgabe: Die Basisform ist fix vorgegeben und nicht anpassbar.
    // 1. Calculate minimum/maximum Percentage of total area which will cover min/max-sized Rooms
    // 2. Calculate Percentages of the Room Areas randomly.
    // They must be between min/max-Percentage and total to 1
    // Vielleicht so wie schonmal gemacht/gedacht:
    // immer merken, wieviel man aktuell schon über/unter der Durchschnittspercentage, also 1/n liegt.
    // Die Werte für die nächste Percentage berechnen. Wenn diese zur Summe addiert den min/max-Rahmen sprengen,
    // berechne die random Percentage neu
    // Die letzte Percentage ist der Rest der percentageSum, bzw. 1- sum(alle Percentages bisher)
    // - Vorgehen geht nur, wenn min/max symmetrisch um 1/n liegen!
  }

  // Divide into n Rectangles of the same size, along the longer side
  splitEvenlyOriented(n) {
    let newRects = [];

    console.log("> Split Rectangle evenly oriented along the longer side");
    //console.log("split w / h",this.width,this.height)
    if (this._width > this._height) {
      // Horizontally

      // Divide along width
      let upperEdgeSplits = this._edges.upperEdge.splitEvenly(n);
      let lowerEdgeSplits = this._edges.lowerEdge.splitEvenly(n);

      //console.log("upper edge splits:" ,upperEdgeSplits)
      for (let i = 0; i < n; i++) {
        // For every rect:

        // ul, ur, lr, ll
        let verts = [
          upperEdgeSplits[i].vertices.vertice1,
          upperEdgeSplits[i].vertices.vertice2,
          lowerEdgeSplits[i].vertices.vertice2,
          lowerEdgeSplits[i].vertices.vertice1,
        ];

        let rect = new Rectangle().fromVertices(verts);
        newRects.push(rect);
      }
    } else {
      // Vertically
      // Divide along other axis:
      let rightEdgeSplits = this._edges.rightEdge.splitEvenly(n);
      let leftEdgeSplits = this._edges.leftEdge.splitEvenly(n);

      for (let i = 0; i < n; i++) {
        // For every rect:

        // ol, or, ur, ul
        let verts = [
          leftEdgeSplits[i].vertices.vertice1,
          rightEdgeSplits[i].vertices.vertice1,
          rightEdgeSplits[i].vertices.vertice2,
          leftEdgeSplits[i].vertices.vertice2,
        ];

        //console.log(verts)

        let rect = new Rectangle().fromVertices(verts);
        newRects.push(rect);
      }
    }

    return newRects;
    // Return (pieces) * new Rectangle
  }

  //TODO: Apply random splitting to both orientations
  /**
   * Split into n randomly sized parts, each part with size between min and max
   * Oriented along the longer side
   * Can be used to keep AR intact by calculating the maxArea and minArea beforehand!
   * @param {*} max
   *
   *  */
  splitRandomlyMinMaxOriented(n, min, max) {
    // TODO: Check orientation!
    // Where

    console.log(
      "> Split Rectangle in n randomly sized splits oriented along it's longer side"
    );

    if (this._area == undefined) {
      console.error("Area is not defined! Cannot split rectangle!");
      return null;
    }

    let parts = Tools.getInstance().divideValueIntoPartsMinMax(
      this._area,
      n,
      min,
      max
    );

    console.log(
      " Splitrandomlyminmaxoriented: n:",
      n,
      " min:",
      min,
      " max:",
      max,
      " Parts: ",
      parts
    );
    // Ab hier parts Fertig
    // Now Create Rectangles by Edge splitting into parts, then applying the known algorithm

    // Parts is concrete area values! Not percentages!
    // Dependant on "horizontally" vs. "vertically", calculate subedge lengths from area and given height/width
    return this.generateSubRectsFromAreaPartsOriented(parts);
  }

  /**
   * Split with STM into n parts of random size, each part with size between min and max
   * @param {number} n
   * @param {number} minPercentage The minimum size a subrect must have, given as percentage of this rectangles area
   * @param {number} maxPercentage The maximum size a subrect must have, given as percentage of this rectangles area
   */

  //

  // TODO: Hier wird anscheinend jedes fertige STM Rectangle an dieselbe Position gepackt
  // also als ob das Parent-Rect bei 0,0 wäre oder so

  // Wird zum initialisieren denn die width/height von dem ding hier benutzt oder auch irgendwie die position?
  splitSTMMinMax(n, minPercentage, maxPercentage) {
    console.log(
      ">>> Start Rect STM for Rect: ",
      this._pos,
      this._width,
      this._height
    );

    // Define initial vertices of wall edges
    // let currentWidth = this.houseWidth;
    //let currentHeight = this.houseHeight;

    // Copy apartmentSizes list to leave the original list intact
    //currentRow.map(preAp => ({ ...preAp }));

    let apartmentSizes = Tools.getInstance().divideValueIntoPartsMinMax(
      Tools.getInstance().roundTwoDigits(this._area),
      n,
      Tools.getInstance().roundTwoDigits(minPercentage * this._area),
      Tools.getInstance().roundTwoDigits(maxPercentage * this._area)
    );

    console.log("splitSTMminmax unsorted Aps ", apartmentSizes);
    apartmentSizes.sort((a, b) => b - a);
    console.log(apartmentSizes);

    let apartmentSizesCopy = apartmentSizes.slice(0);

    /**
     * Apartment collection
     */
    let apartments = [];

    /*    console.log(
      "STM Room sizes: ",
      apartmentSizes,
      " vs whole area",
      this._area
    );
*/

    // TODO: Order apartmentSizeList
    // TODO: hier an Koordinatensystem (0,0 unten links) anpassen.

    // TODO: Übernahme von den Punkten aus this.edges statt nur width/height!
    // denn damit startet alles unten links bei 0,0

    // TODO: schauen, ob noch irgendwo anders das setzen von Punkten von
    // 0,0 abhängig ist oder ob zb bei wandverschiebungen einfach die currentwidth/height draufaddiert wird

    let leftWall = {
      a: new THREE.Vector2(0, this._height),
      b: new THREE.Vector2(0, 0),
    };

    let lowerWall = {
      a: new THREE.Vector2(0, 0),
      b: new THREE.Vector2(this._width, 0),
    };

    // Will contain PreApartments (contain area, width, height, aspectRatio)
    // let currentRow = [];

    // while hier: wiederholt zwischen den wechseln der wände. (worst ist schlechter geworden)
    //   while (apartmentSizeList.length > 0) {

    while (apartmentSizesCopy.length > 0) {
      // Reinitialize lists etc.

      // Egal wo die Punkte sind!
      let currentHeight = Tools.getInstance().distanceBetweenTwoVertices(
        leftWall.a,
        leftWall.b
      );
      let currentWidth = Tools.getInstance().distanceBetweenTwoVertices(
        lowerWall.a,
        lowerWall.b
      );
      let currentRow = [];

      // console.log("current width", currentWidth, "currentheigt", currentHeight);

      //"" currentWidth > currentHeight
      if (currentWidth > currentHeight) {
        // console.log("wider than high");
        // Wider than high: place on left wall

        // Add rooms to row until the worst of their aspect ratios worsens
        // Only add rooms to row if they are confirmed to improve the worst aspect ratio

        // While hier: durch apartmentSizes iterieren und immer versuchen, ein preApartment der nächsten Größe
        // in die Row zu packen
        while (apartmentSizesCopy.length > 0) {
          /* console.log(
            ">>>>>>>>>>>>>>>New Iteration of trying to add preApartments to left wall row"
          );
        */
          // First one's free
          if (currentRow.length == 0) {
            let firstApartmentArea = apartmentSizesCopy.shift();
            //    console.log("left apartment sizes: ", apartmentSizesCopy);
            // new PreApartment that adapts to the wall length (currentHeight)

            // TODO: Schauen, ob sich die currentHeight im Verlauf irgendwie verändert und das dann ne DeepCopy ist, die auch das preAp verändert ... ?
            //  console.log("First in Row:");
            currentRow.push(
              new PreApartment(firstApartmentArea, null, currentHeight)
            );
          }

          // Add up all areas of the apartments currently in the row
          // Braucht man das wirklich? wir wollen doch nur die schlechteste aspectRatio bekommen, und die ist schon in der
          // vorrunde berechnet worden

          // let currentRowAreaSum = currentRow.reduce((areaSum, apartment) => areaSum + apartment.area, 0);

          // Iteratively try to add new apartments to row.
          // Calculate current worst aspect ratio

          // Find max aspect ratio among the preApartments in the row

          //console.log("current row: ", currentRow);
          //console.log("current row stretched: ", ...currentRow)

          let currentRowWorstAspectRatio = Math.max(
            ...currentRow.map((preApartment) => preApartment.aspectRatio)
          );

          //console.log("current worst aspect ratio: ", currentRowWorstAspectRatio)

          //console.log("current row after stretc use ", currentRow);

          // Copy row, add next apartment, recalculate row width, set row width for each row preapartment, fetch worst aspectratio

          // When adding to the row, the size is removed from the sizeList

          let currentRowAreaSum = currentRow.reduce(
            (areaSum, apartment) => areaSum + apartment.area,
            0
          );
          let nextRowAreaSum = currentRowAreaSum + apartmentSizesCopy[0];

          // console.log("currentRowAreaSum: (should be 10) ", currentRowAreaSum)
          //console.log("nextRowAreaSum: (should be 10) ", nextRowAreaSum)
          // Calculate next row width
          let nextRowWidth = nextRowAreaSum / currentHeight;

          // Copy current row and update the contained PreApartments with the nextRowWidth, which also updates their aspectratio

          // .map to crete deep copy.
          // new PreApartment to keep the types of "PreApartment"
          // using ... (stretch) would convert the objects to plain objects
          //console.log("Copying currentRow preAp list");
          let nextRow = currentRow.map(
            (preAp) =>
              new PreApartment(preAp._area, preAp._width, preAp._height)
          );

          //console.log("copied current row = next row", nextRow)

          // Update the contained PreApartments with the nextRowWidth
          // Also updates their height and their aspect ratio
          for (let preAp of nextRow) {
            preAp.width = nextRowWidth;
          }

          //console.log("Create possible next preAp:");
          // Create possible next apartment
          let nextPreApartment = new PreApartment(
            apartmentSizesCopy[0],
            nextRowWidth,
            null
          );

          // Add next preAp to the nextRow
          nextRow.push(nextPreApartment);

          //console.log("Test: nextRow with new preApartment", nextRow);
          // Hier weiter: Auch testen.

          // calculate the new worst AP

          let nextRowWorstAspectRatio = Math.max(
            ...nextRow.map((preApartment) => preApartment.aspectRatio)
          );

          /*
          console.log(
            "Test: nextRow worst aspect Ratio",
            nextRowWorstAspectRatio,
            "vs currentRow worst aspect Ratio",
            currentRowWorstAspectRatio
          );
      */
          // If lower than the current worst AP, set currentRow = nextCurrentRow and repeat
          // If higher, Wände neu berechnen, Apartments generieren, etc.
          if (currentRowWorstAspectRatio > nextRowWorstAspectRatio) {
            // Nächste Runde
            currentRow = nextRow;
            //      console.log("aspect Ratio improved");
            apartmentSizesCopy.shift();
            //    console.log("left apartment sizes: ", apartmentSizesCopy);
          } else {
            //    console.log("aspect Ratio worsened");
            // calculate x/y positions of apartments.

            // All preAps in row have same width
            // let rowWidth  = currentRow[0].width

            // Take coords from lower vertice of left wall (starts at 0,0)
            //lW.b = (0,0)

            // Egal wo die Punkte sind! Solange die Wall stimmt
            let rowX = leftWall.b.x;
            let ySum = leftWall.b.y;

            // Von oben nach unten

            // Achtung: in die row werden die preAps von unten (y=0) nach oben hinzugefügt!
            // Die Abfragereihenfolge der Vertices für die neue leftWall muss berücksichtigt werden
            let preApCount = 1;
            for (let preAp of currentRow) {
              let newApX = rowX + preAp.width / 2;
              let newApY = ySum + preAp.height / 2;
              let apColor = new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random()
              );
              let newApartment = new Apartment(
                preAp.area,
                apColor,
                preAp.width,
                preAp.height,
                newApX,
                newApY
              );
              apartments.push(newApartment);
              ySum += preAp.height;

              // lower = first = 1

              if (preApCount == 1) {
                // Set new wall lower vertex to lower new Apartment.vertices.c

                //     console.log("set left wall b");
                leftWall.b = newApartment.vertices.b;
                lowerWall.a = newApartment.vertices.b;
              }
              // upper = last = length
              if (preApCount == currentRow.length) {
                // Set new wall upper vertex to upper new Apartment.vertices.b
                //    console.log("set left wall a");
                leftWall.a = newApartment.vertices.c;

                // Set upper wall left vertex
                //lowerWall.a = newApartment.vertices.b
              }

              preApCount++;
            }

            //    console.log("new left wall:", leftWall);
            //    console.log("new lower wall ", lowerWall);

            // "Da geht irgendwas mit den Vertices schief." ???
            // Das 18er Apartment ist unten, hat aber a bei 0,0 bzw die Vertices vom oberen. wtf?

            // Lösung: 0,0 ist unten links. X ist nach oben, Y ist nach rechts.... wtf

            // Wände neu berechnen
            // row zurücksetzen

            // TODO: does break apply to the loop directly containing it or all loops?

            // TODO: Remove return
            //
            //     console.log("fixed apartments after left wall placement:");
            for (let ap of apartments) {
              // ap.logApartment();
            }

            //     console.log(">>>>>>>>>>>>>>> END of left wall placement ");
            //return;
            break;
          }
        }
      } else {
        // Higher than wide: place on lower wall
        // TODO: Implement

        //        console.log("higher than wide");
        // Wider than high: place on left wall

        // Add rooms to row until the worst of their aspect ratios worsens
        // Only add rooms to row if they are confirmed to improve the worst aspect ratio

        // While hier: durch apartmentSizes iterieren und immer versuchen, ein preApartment der nächsten Größe
        // in die Row zu packen
        while (apartmentSizesCopy.length > 0) {
          /*
          console.log(
            "vvvvvvvvvvvvvvvvvvv New Iteration of trying to add preApartments to lower wall row"
          );
*/
          // First one's free
          if (currentRow.length == 0) {
            let firstApartmentArea = apartmentSizesCopy.shift();
            console.log("left apartment sizes: ", apartmentSizesCopy);
            // new PreApartment that adapts to the wall length (currentHeight)

            // TODO: Schauen, ob sich die currentHeight im Verlauf irgendwie verändert und das dann ne DeepCopy ist, die auch das preAp verändert ... ?
            let firstPreAp = new PreApartment(
              firstApartmentArea,
              currentWidth,
              null
            );
            currentRow.push(firstPreAp);
          }

          // Add up all areas of the apartments currently in the row
          // Braucht man das wirklich? wir wollen doch nur die schlechteste aspectRatio bekommen, und die ist schon in der
          // vorrunde berechnet worden

          // let currentRowAreaSum = currentRow.reduce((areaSum, apartment) => areaSum + apartment.area, 0);

          // Iteratively try to add new apartments to row.
          // Calculate current worst aspect ratio

          // Find max aspect ratio among the preApartments in the row

          //console.log("current row: ", currentRow);
          //console.log("current row stretched: ", ...currentRow)

          let currentRowWorstAspectRatio = Math.max(
            ...currentRow.map((preApartment) => preApartment.aspectRatio)
          );

          let currentRowAreaSum = currentRow.reduce(
            (areaSum, apartment) => areaSum + apartment.area,
            0
          );
          let nextRowAreaSum = currentRowAreaSum + apartmentSizesCopy[0];

          // console.log("currentRowAreaSum: (should be 10) ", currentRowAreaSum)
          //console.log("nextRowAreaSum: (should be 10) ", nextRowAreaSum)
          // Calculate next row width

          // rowheight = area/ currentwidth(wall width)

          let nextRowHeight = nextRowAreaSum / currentWidth;

          // Copy current row and update the contained PreApartments with the nextRowWidth, which also updates their aspectratio

          // .map to crete deep copy.
          // new PreApartment to keep the types of "PreApartment"
          // using ... (stretch) would convert the objects to plain objects
          let nextRow = currentRow.map(
            (preAp) =>
              new PreApartment(preAp._area, preAp._width, preAp._height)
          );

          //console.log("copied current row = next row", nextRow)

          // Update the contained PreApartments with the nextRowWidth
          // Also updates their height and their aspect ratio
          for (let preAp of nextRow) {
            preAp.height = nextRowHeight;
          }

          // Create possible next apartment
          let nextPreApartment = new PreApartment(
            apartmentSizesCopy[0],
            null,
            nextRowHeight
          );

          // Add next preAp to the nextRow
          nextRow.push(nextPreApartment);

          //console.log("Test: nextRow with new preApartment", nextRow);
          // Hier weiter: Auch testen.

          // calculate the new worst AP

          let nextRowWorstAspectRatio = Math.max(
            ...nextRow.map((preApartment) => preApartment.aspectRatio)
          );
          /*
          console.log(
            "Test: nextRow worst aspect Ratio",
            nextRowWorstAspectRatio,
            "vs currentRow worst aspect Ratio",
            currentRowWorstAspectRatio
          );
*/
          // If lower than the current worst AP, set currentRow = nextCurrentRow and repeat
          // If higher, Wände neu berechnen, Apartments generieren, etc.
          if (currentRowWorstAspectRatio > nextRowWorstAspectRatio) {
            // Nächste Runde
            currentRow = nextRow;
            //   console.log(" lower aspect Ratio improved");
            apartmentSizesCopy.shift();
            //  console.log("left apartment sizes: ", apartmentSizesCopy);
          } else {
            //  console.log("aspect Ratio worsened");

            // Take coords from upper vertice of left wall
            let rowY = lowerWall.a.y;
            let xSum = lowerWall.a.x;

            // Von oben nach unten

            // Achtung: in die row werden die preAps von unten nach oben hinzugefügt!
            // Die Abfragereihenfolge der Vertices für die neue leftWall muss berücksichtigt werden
            let preApCount = 1;
            for (let preAp of currentRow) {
              // Width verändert sich pro preAp.
              // height ist in der Row gleich

              // newApY ist immer rowY (start bei 0,0, also y = 0) + halbe rowheight bzw. preAp height in der row

              let newApY = rowY + preAp.height / 2;
              let newApX = xSum + preAp.width / 2;
              let apColor = new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random()
              );
              let newApartment = new Apartment(
                preAp.area,
                apColor,
                preAp.width,
                preAp.height,
                newApX,
                newApY
              );
              apartments.push(newApartment);
              xSum += preAp.width;

              // lower = first = 1
              // upper = last = length
              //     console.log("setting lower wall");
              if (preApCount == 1) {
                // Set new wall lower vertex to lower new Apartment.vertices.c
                //console.log("set left wall b")
                lowerWall.a = newApartment.vertices.d;
                leftWall.b = newApartment.vertices.d;
              }
              if (preApCount == currentRow.length) {
                // Set new wall upper vertex to upper new Apartment.vertices.b
                //console.log("set lower wall b")
                lowerWall.b = newApartment.vertices.c;
              }

              preApCount++;
            }

            /*
            console.log("new left wall:", leftWall);
            console.log("new lower wall ", lowerWall);
*/
            // "Da geht irgendwas mit den Vertices schief." ???
            // Das 18er Apartment ist unten, hat aber a bei 0,0 bzw die Vertices vom oberen. wtf?

            // Lösung: 0,0 ist unten links. X ist nach oben, Y ist nach rechts.... wtf

            // Wände neu berechnen
            // row zurücksetzen

            // TODO: does break apply to the loop directly containing it or all loops?

            //  console.log("fixed apartments after lower wall placement:");
            for (let ap of apartments) {
              //  ap.logApartment();
            }

            /*   console.log(
              "vvvvvvvvvvvvvvvvvvv END of iteration of trying to add preApartments to lower wall row"
            );
            */
            // return;
            break;
          }
        }
        // Add rooms to row until the worst of their aspect ratios worsens
      }
    }

    // Convert all apartments to Rectangles, for unified edge etc handling
    const returnRects = [];

    console.log("All Rect-STM-ed apartments: ");
    for (let ap of apartments) {
      ap.logApartment();
      returnRects.push(ap.convertToRectangle());
    }
    console.log(">>>>>> End Rect-STM ");
    return returnRects;
  }

  /**
   * Generate Subrectangles from a given set of parts of the longer one of it's edges
   * @param {List} parts List of areas of the individual parts, given as concrete Areas, not percentages
   * @returns Rectangles generated from the given area parts
   */
  generateSubRectsFromAreaPartsOriented(parts) {
    console.log("> Generate SubRects from Parts");
    let edgeParts = [];
    let newRects = [];

    // Check if parts add up to 1.0

    if (this._width > this._height) {
      // Convert areas into edge length parts
      // nur bei Random Parts nötig

      for (let p of parts) {
        // Horizontal: height ist immer gleich, teile Area durch height
        edgeParts.push(p / this._height);
      }

      //console.log("edgeParts horizontal:",edgeParts)

      // upperedge splits by parts
      // loweredge splits by parts
      let upperEdgeSplits = this.edges.upperEdge.splitIntoParts(edgeParts);
      let lowerEdgeSplits = this.edges.lowerEdge.splitIntoParts(edgeParts);

      //console.log("Part Splitting: Upper edges:");
      for (let ue of upperEdgeSplits) {
        //ue.printEdge();
      }
      //console.log("Part splitting lower edgle: ");
      // Pass edges into subedgesToRects Function
      for (let le of lowerEdgeSplits) {
        //le.printEdge();
      }

      for (let i = 0; i < parts.length; i++) {
        // For every rect:

        // ul, ur, lr, ll
        let verts = [
          upperEdgeSplits[i].vertices.vertice1,
          upperEdgeSplits[i].vertices.vertice2,
          lowerEdgeSplits[i].vertices.vertice2,
          lowerEdgeSplits[i].vertices.vertice1,
        ];

        let rect = new Rectangle().fromVertices(verts);
        newRects.push(rect);
      }

      // Pass edges into subedgesToRects Function
    } else {
      for (let p of parts) {
        // Horizontal: height ist immer gleich, teile Area durch height
        edgeParts.push(p / this._width);
      }
      //console.log("edgeParts vertical:",edgeParts)

      let leftEdgeSplits = this.edges.leftEdge.splitIntoParts(edgeParts);
      let rightEdgeSplits = this.edges.rightEdge.splitIntoParts(edgeParts);
      //console.log("Part Splitting: left edges:");
      for (let le of leftEdgeSplits) {
        //le.printEdge();
      }
      //console.log("Part splitting right edgle: ");
      // Pass edges into subedgesToRects Function
      for (let re of rightEdgeSplits) {
        //re.printEdge();
      }

      for (let i = 0; i < parts.length; i++) {
        // For every rect:

        // ol, or, ur, ul
        let verts = [
          leftEdgeSplits[i].vertices.vertice1,
          rightEdgeSplits[i].vertices.vertice1,
          rightEdgeSplits[i].vertices.vertice2,
          leftEdgeSplits[i].vertices.vertice2,
        ];

        //console.log(verts)

        let rect = new Rectangle().fromVertices(verts);
        newRects.push(rect);
      }
    }

    return newRects;
    //return parts;
  }

  // TODO: Outsource the "generate vertices" part into separate
  generateHorizontalRectangles(parts) {
    // Kann man nicht vereinen, da bei SplitEven mit den Edges gearbeitet wird
    // und bei
  }

  generateVerticalRectangles(parts) {}

  // Split into n randomly sized parts, with each part not exceeding a specified aspect ratio
  splitRandomlyAspectRatioOriented(n, maxAspectRatio) {
    // Calculate min and max from the given aspect Ratio, then same as above
  }

  // JS Optional Parameters:
  // c ist optional und per default mit null belegt
  // wenn beim function call für c "unefined" angegeben wird, wird der default-Wert verwendet!
  //
  // func(a,b,c = null)

  /**
   *
   * @returns Generates a small sphere mesh at the middle position of this rectangle
   */
  getPointHelperMesh() {
    // Create a small sphere geometry
    const spheregeometry = new THREE.SphereGeometry(0.1, 32, 16);
    const spherematerial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(spheregeometry, spherematerial);
    sphere.position.set(this._pos.x, this._pos.y, 0);

    return sphere;
  }

  /**
   * Generates a small sphere mesh at the position of each vertice of this rectangle
   * @returns {Array} Array of meshes
   */
  getVerticesPointHelperMeshes() {
    const helperMeshes = [];
    // Do not iterate, enables to set specific color for each vertice's pointHelper

    // ul: red ur: green lr: blue: ll: cyan
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff];
    let colorCount = 0;

    //  For .. in : iterates over object properties' KEYS

    // For ...  of iterates over Arrays.
    // Object.values gives an array of the values of the object
    for (let vertice of Object.values(this._vertices)) {
      console.log("vert:", vertice);
      const spheregeometry = new THREE.SphereGeometry(0.3, 32, 16);
      const spherematerial = new THREE.MeshBasicMaterial({
        color: colors[colorCount],
      });
      const sphere = new THREE.Mesh(spheregeometry, spherematerial);
      sphere.position.set(vertice.x, vertice.y, 0);
      helperMeshes.push(sphere);
      colorCount++;
    }

    return helperMeshes;
  }
  //TODO: Vertice getters
  //TODO: Edge getters
  //TODO: Vertice adjacent edgle getters

  calculateOrientation() {
    if (this._height == undefined || this._width == undefined) {
      console.error(">calculateOrientation Error: height || width not set!");
    }

    this._isHorizontal = this._width > this._height ? true : false;
  }

  get material() {
    return this._material;
  }

  get color() {
    return this._color;
  }
  get edges() {
    return this._edges;
  }

  get vertices() {
    return this._vertices;
  }

  get isHorizontal() {
    return this._isHorizontal;
  }

  get longerSideLength() {
    return this._longerSideLength;
  }

  get shorterSideLength() {
    return this._shorterSideLength;
  }
}

export default Rectangle;
