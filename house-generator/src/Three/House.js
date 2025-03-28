import * as THREE from "three";
import Apartment from "./Apartment";
import ShapeObject from "./ShapeObject";
import PreApartment from "./PreApartment";
import Rectangle from "./Rectangle";

import Tools from "./Tools";

// TODO: Create ShapeObject interface and make House and Apartment implement this.
// They inherit the ability to create a THREE.Shape from vertices.

class House {
  // TODO: Parametrize width/height
  // TODO: Parametrize other stuff
  /**
   * Generates a House from the given parameters and automatically
   * generates the outer walls (calls generateHouseShape)
   * Everything else must be done by decorator methods
   */
  constructor(
    houseArea,
    gardenArea,
    apartmentCount,
    minApartmentSize,
    maxApartmentSize
  ) {
    this.houseArea = houseArea;
    this.gardenArea = gardenArea;
    this.apartmentCount = apartmentCount;
    this.houseWidth = null;
    this.houseHeight = null;
    /**
     * The rects from the Apartments, corridor and rooms
     */
    this.totalRects = [];
    this.apartmentRects = [];
    this.corridorRects = [];
    this.roomRects = [];

    // a: upper left
    // b: upper right
    // c: lower left
    // d: lower right

    // TODO: Define edge mappings for vertices, so for say "upperEdge" = a and b
    // so that we can say apartment1.upperEdge = apartment2.lowerEdge = a and b for placing apartment1 below apartment2
    // Otherwise the vertices have to be called separately, so

    // TODO: Doublecheck vertex order
    /**
     * a: upper left
     * b: upper right
     * c: lower left
     * d: lower right
     *
     */
    this.vertices = {
      a: null,
      b: null,
      c: null,
      d: null,
    };

    this.minApartmentSize = minApartmentSize;
    this.maxApartmentSize = maxApartmentSize;

    // List of Apartment ShapeObjects
    this.apartments = [];

    this.apartmentSizes = [];

    // ShapeObject of Garden area
    this.gardenShapeObject = null;

    // ShapeObject of house base shape
    this.houseShapeObject = null;

    this.calculateRandomHouseShape();
    // this.calculateRooms();
  }

  /**
   * Wrapper Method for the construction process
   */
  calculateRooms() {
    this.calculateRandomHouseShape(); // Mirahmadi Step 1/
    this.setFixedApartmentSizes(); // Placeholder for calculateApartmentSizes

    //this.calculateApartmentSizes();
    //this.calculateFloorPlan(); // Squarified Tree Map

    // Area: 50
    //let apartmentSizes = [18, 12, 10, 10]
    //let apartmentSizes = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

    console.log("--------------------STM START-----------------------");
    //this.squarifiedTreeMap(this.apartmentSizes, this.houseWidth, this.houseHeight);
    // this.calculateFloorPlan();
    console.log("--------------------STM END -----------------------");
    // Test of distanceBetweenTwoVertices:

    console.log("simple rectangle floor start");
    this.simpleRectangleFloor();
    console.log("simple rectangle floor end");

    /*var vertA = new Vector2(0, 0);
        var vertB = new Vector2(0, 8);

        console.log(this.distanceBetweenTwoVertices(vertA, vertB));
        */
  }

  /**
   * Calculate House Rectangle shape,
   */
  calculateDefinedHouseShape() {}

  /**  Calculates Random House Rectangle Shape with aspect ratio from 0.8 to 1.2, without any appartments placed in the floor
   */

  calculateRandomHouseShape() {
    // TODO: Parametrize min/max Aspect Ratio of House
    // TODO: Parametrize width/height of House

    // Rectangle Area A = a*b

    // Randomly generate side a, in Aspect Ratio between 1/1 and 0.8/1
    // amin = 0.8*b
    // b = area/a  ->   amin = 0.8 *(area/a)
    // umformen zu amin = sqrt(0.8*area)

    // TODO: Redo Aspect Ratio calculation according to Mirahmadi: max (w/h, h/w)

    var aspectRatio = 0.6 + 0.8 * Math.random(); // AR zw. 0.6 und 1.4

    console.log("random aspect ratio " + aspectRatio);
    // aspectratio = a/b
    // a = aspectratio/b

    /*
        var aMin = Math.sqrt(0.8*this.houseArea)  // gives Aspect Ratio of 0.8 POOPCODE
        var aMax = Math.sqrt(1.2*this.houseArea);     // gives Aspect Ratio of 1.2 
*/

    // 0.4 = maxAspectRatio - minAspectRatio
    var width = Math.sqrt(this.houseArea * aspectRatio);
    var height = this.houseArea / width;

    this.houseWidth = width;
    this.houseHeight = height;

    this.position = {
      x: width / 2,
      y: height / 2,
    };
    console.log(
      "width " +
        width +
        "height " +
        height +
        " aspect ratio later " +
        width / height
    );

    // Calculate the vertices from w/h and
    this.calculateHouseVertices();

    const shapeVertices = [
      this.vertices.a,
      this.vertices.b,
      this.vertices.c,
      this.vertices.d,
    ];

    // TODO: Specify housecolor
    // TODO: Somehow bums that shit.
    // ShapeObject war gedacht für tatsächliche Shapes.
    // Apartment ist gedacht zum unterscheiden von House und Apartments, da

    // Create Shape from vertices and color
    this.houseShapeObject = new ShapeObject(shapeVertices, 0xffff11);
  }

  /**
   * calculates the House's corner vertices from width and height and stores them in this.vertices
   *
   */
  calculateHouseVertices() {
    if (this.houseWidth == undefined || this.houseHeight == undefined) {
      console.error(
        "Error calculating house vertices! HouseWidth or height not defined!"
      );
    }

    //Save Vertices as this.a (upper left), this.b (upper right), this.c(lower left), this.d(lower right)
    // What the fuck
    this.vertices.a = new THREE.Vector2(0, 0);
    this.vertices.b = new THREE.Vector2(this.houseWidth, 0);
    this.vertices.c = new THREE.Vector2(this.houseWidth, this.houseHeight);
    this.vertices.d = new THREE.Vector2(0, this.houseHeight);
  }

  // Attention: ggf. müssen die Apartments nach Area (groß nach klein) sortiert sein!
  // With houseArea = 50, divide into 5 fixed areas that add up to 50
  setFixedApartmentSizes() {
    // Push apartments with unitialized vertices

    // TODO: Set Apartment sizes as numbers in a list, not as Apartment Objects
    /*
        this.apartments.push(new Apartment(15, 0xff0011));
        this.apartments.push(new Apartment(11, 0x00ff22));
        this.apartments.push(new Apartment(10, 0xff00dd));
        this.apartments.push(new Apartment(9, 0x0000dd));
        this.apartments.push(new Apartment(5, 0xffff00));
        */

    this.apartmentSizes = [15, 13, 12, 6, 2, 2];
  }

  // Divide houseArea into "number of apartments" random sized Pieces, with minimum and Maximum Room Sizes
  generateRandomApartmentSizes() {
    console.log(" ----- CALCULATE APARTMENT SIZES");

    if (
      this.apartmentCount == null ||
      this.minApartmentSize == null ||
      this.maxApartmentSize == null
    ) {
      console.log("ERROR: Missing data for generateRandomApartmentSizes");
    }

    // TODO: Fertigstellen, vielleicht mit "keep value around zero"
    // Alternativ so, dass die Raumgrößen immer um max/minimal denselben wert um den Mean fluktuieren.
    //
    // Ganz alternativ so, dass vielleicht die Raumgröße mit max/min auswählbar ist, dafür dann aber die Grundstücksgröße nicht

    // Auch ne Idee: wie ursprünglich gedacht: immer wenn Sum kleiner null, beim nächsten was dazu addieren.
    // Für die nächsten so lange machen, bis wieder die 0-Grenze über/unterschritten wurde.
    // Darauf achten, dass nie unter die Minimal/Maximalgrenze addiert/subtrahiert wird.
    //
    // Der letzte muss so sein, dass man mit einem Wert innerhalb der Raumgrenzen des Minimums (minimal Kleiner Raum)
    // ein Area-Plus ausgleichen kann -  bsp. minimumgrenze = -1,  maximum +5
    // -> letzter Stand der Sum darf maximal 1 sein, beim minimum ists hier egal - ein Raum mit +1 kann immer aufgefüllt werden

    // TODO: Constrain the apartment min/max size constraints to guarantee the filling of the houseArea with n apartments
    // Macht das überhaupt Sinn?

    // -> wenn min gewählt, muss max so groß sein, dass alle bis auf 1 apartment bei größe "min" durch ein letztes von größe
    // "max" ausgeglichen werden kann? kp

    var meanApartmentSize = this.houseArea / this.apartmentCount;
    // If all apartments have a size of meanApartmentSize, the houseArea can be filled completely

    // The amount of area that can be subtracted or added to each apartment while keeping the min/max apartment size constraints.
    var diffToMinApartmentSize = meanApartmentSize - this.minApartmentSize;
    var diffToMaxApartmentSize = this.maxApartmentSize - meanApartmentSize;

    console.log("Desired house area:" + this.houseArea);
    console.log(
      "Min apartment size:" +
        this.minApartmentSize +
        " Max apartment size: " +
        this.maxApartmentSize
    );
    console.log("Mean apartmenz size: " + meanApartmentSize);
    console.log(
      " Min negative difference between Mean and Min apartment size:" +
        -diffToMinApartmentSize
    );
    console.log(
      "Max positive difference between Mean and Max apartment size: " +
        diffToMaxApartmentSize
    );

    var apartmentSizes = []; //new Array(this.apartmentCount);

    //remove
    //return;

    // The random amount the apartments differ in size from the mean apartment size, constrained to min and max apartment sizes
    // random(0,1) * (range between min and max)

    // Can be between (-)diffmin  and (+)diffmax

    // TODO: Schauen, ob die Wahrscheinlichkeiten hier gut verteilt sind.
    // Wenn min. jetzt -1 ist und max jetzt 15, wird doch viel wahrscheinlicher immer was dazu addiert. Macht das denn Sinn?

    var randomAreaDifference =
      Math.random() * (diffToMaxApartmentSize - -diffToMinApartmentSize) +
      -diffToMinApartmentSize;
    var variationSum = 0;
    variationSum += randomAreaDifference;

    // TODO: Nochmal neu. Was ich ja nur will ist eine liste von Variation Values, die je zwischen difftomin und difftomax liegen und in summe 0 ergeben.
    // Jedes mal ein temp min/max berechnen, welches sich darauf bezieht,
    //was passieren würde wenn man von nun an jedes mal den maximal/minimalwert dazuaddieren würde.

    // Fill with all but 1 sizes
    for (var i = 0; i < this.apartmentCount - 1; i++) {
      // Jedes Mal random wert (constrained, sodass nicht in einem mal die Raumgrenzen überschritten werden können)
      // dazu addieren oder subtrahieren

      // Wenn dieser Vorgang die Grenzen überschreiten würde: Neue Zahl generieren, bis diese passt.1
      // TODO: unsauber?

      // Generate new Area difference value
      randomAreaDifference =
        Math.random() * (diffToMaxApartmentSize - -diffToMinApartmentSize) +
        -diffToMinApartmentSize;

      // While sum of new random area difference and past variation sum would break the min/max difference constraints, generate a new value
      // TODO: negiertes || ist ja ein &&, ich dödels
      while (
        variationSum + randomAreaDifference < -diffToMinApartmentSize ||
        variationSum + randomAreaDifference > diffToMaxApartmentSize
      ) {
        randomAreaDifference =
          Math.random() * (diffToMaxApartmentSize - -diffToMinApartmentSize) +
          -diffToMinApartmentSize;
      }

      variationSum += randomAreaDifference;
      console.log("intermediate variation sum " + variationSum);

      // Add apartment, whose size randomly fluctuates around the meanApartmentSize, to the list.
      //apartmentSizes.push((meanApartmentSize + randomAreaDifference));

      // For Testing: only add meanApartmentSize size
      apartmentSizes.push(meanApartmentSize);
    }

    // Last Step: Add Apartment with size of mean + variationSum to last index, so that the sum of the apartment sizes adds
    // up to the desired house area.

    // TODO: Das geht so nicht! Denn wenn die Grenzen +4 und - 1 sind und beim letzten +4 gemacht wird,
    // kann der letzte das mit nur -1 nicht mehr ausgleichen!
    apartmentSizes.push(-variationSum + meanApartmentSize);

    console.log("random apartment sizes: " + apartmentSizes);

    var testApartmentSizeSum = 0;

    // TODO: for primitive values: use in or of?

    // TODO: Test with unevenly distributed min/max constraints.

    for (var ap of apartmentSizes) {
      testApartmentSizeSum += ap;
    }

    console.log("sum of random apartment sizes:" + testApartmentSizeSum);

    this.apartmentSizes = apartmentSizes;

    // Nun einmalig random was abziehen oder hinzufügen: bei abziehen immer random wert bis max. diffToMin, bei hinzufügen random wert bis max. difftomax
    // Summe der additionen/subtraktionen-Werte speichern.
    // Wenn die aktuell - ist, beim nächsten mal was hinzufügen. Wenn die + ist, beim nächsten mal was abziehen.

    // Dann beim nächsten mal die andere Operation machen:
  }

  //Simple Algorithm for filling the floor with one staircase/corridor and n apartments of various sizes
  //

  // Calculate remaining free areas, split them up into the n rooms

  // Do not use preApartments, calc sizes directly.

  // If wider than high:
  // - place corridor in the middle (this.coords?), stretch it
  // - calculate middle areas, side areas
  // - fill middle areas:
  // - divide middle area corridor side through n-4 /2
  // - fill side areas:
  // - divide

  // TODO: Implement Rectangle Class/Interface
  // TODO: Has "divide" Function, which returns n subrectangles of thss

  // Generate a simple Building with an I-Shaped Corridor, connecting both sides of the Building
  // with n Apartments
  simpleICorridor(corridorHeight, n) {
    // x/y = width/height /2

    // TODO: Move houseRect generation to generateHouseShape()
    // TODO: Look what to do with uneven n's - Maybe just throw an error

    if (this.houseWidth > this.houseHeight) {
      //let totalRects = [];

      let houseRect = new Rectangle().fromCoords(
        this.houseWidth,
        this.houseHeight,
        this.position.x,
        this.position.y
      );

      // Achtung: Da wird irgendwas mit NaN befüllt. hö
      let corridor = new Rectangle().fromCoords(
        this.houseWidth,
        corridorHeight,
        this.position.x,
        this.position.y
      );

      console.log("corridor:", corridor);
      // Da war immer houseRect auch drin, aber sieht kaka aus
      this.totalRects.push(corridor);

      let upperRectVertices = [
        houseRect.vertices.upperLeft,
        houseRect.vertices.upperRight,
        corridor.edges.upperEdge.vertices.vertice2,
        corridor.edges.upperEdge.vertices.vertice1,
      ];

      console.log("Constructing Rect from Vertices");
      let upperRect = new Rectangle().fromVertices(upperRectVertices);

      let lowerRectVertices = [
        corridor.edges.lowerEdge.vertices.vertice1,
        corridor.edges.lowerEdge.vertices.vertice2,
        houseRect.vertices.lowerRight,
        houseRect.vertices.lowerLeft,
      ];

      let lowerRect = new Rectangle().fromVertices(lowerRectVertices);

      // Now Divide the Rects into n/2 Rooms each
      let upperRooms = upperRect.splitEvenlyOriented(n / 2);
      let lowerRooms = lowerRect.splitEvenlyOriented(n / 2);

      this.totalRects = this.totalRects.concat(upperRooms, lowerRooms);
      return this.totalRects;
    } else {
      //let totalRects =[];
      let houseRect = new Rectangle().fromCoords(
        this.houseWidth,
        this.houseHeight,
        this.position.x,
        this.position.y
      );
      let corridor = new Rectangle().fromCoords(
        corridorHeight,
        this.houseHeight,
        this.position.x,
        this.position.y
      );

      this.totalRects.push(corridor);

      let leftRectVertices = [
        houseRect.vertices.upperLeft,
        corridor.vertices.upperLeft,
        corridor.vertices.lowerLeft,
        houseRect.vertices.lowerLeft,
      ];

      let leftRect = new Rectangle().fromVertices(leftRectVertices);

      let rightRectVertices = [
        corridor.vertices.upperRight,
        houseRect.vertices.upperRight,
        houseRect.vertices.lowerRight,
        corridor.vertices.lowerRight,
      ];

      let rightRect = new Rectangle().fromVertices(rightRectVertices);

      let leftRooms = leftRect.splitEvenlyOriented(n / 2);
      let rightRooms = rightRect.splitEvenlyOriented(n / 2);

      this.totalRects = this.totalRects.concat(leftRooms, rightRooms);
      return this.totalRects;
    }

    //1. Place Corridor with defined width.
    //2. Generate Rectangles from Corridor Vertices and House Vertices
    //3. Subdivide the Rectangles
    //4. Happyness
  }

  // TODO: Unify randomizedICorridor / simpleICorridor by parametrizing for the split method!
  // TODO: Use the min/max apartment sizes from either direct parameters ore from class fields
  // TODO: Extract the corridor generation method from the splitting method, so that
  // it could be called multiple times to generate new rectangle splits

  /**
   * Generates a House with a simple I-Corridor and n Apartments of random Size
   *
   * @param {} corridorWidth
   * @param {*} n
   * @returns
   */
  randomizedICorridor(n, corridorWidth) {
    // x/y = width/height /2

    // TODO: Error for Both corridor Types! when using uneven numbers <=5
    // "cannot read xy from vertices"
    // Some of the Rectangles are probably not generated correctly

    // TODO: Move houseRect generation to generateHouseShape()
    // TODO: Look what to do with uneven n's

    // -> divide n by the amount of available living area rectangles scaled by their size
    // for example: four LA-rects: each one has a part of 1.0 of the total area
    // one has 0.4, one has 0.4, one has 0.1, one has 0.1
    // n = 15, so the division is ~ 6, 6, 2, 1 or maybe 6,5,2,2
    // -> Look at all the raw n-splits the la-rects would get when multiplied by their area ratio
    // then select those where rounding up/down would cause the least divergence (but in percent!) from their raw
    // n-split value. Choose those to go below their value for dividing uneven n's

    if (this.houseWidth > this.houseHeight) {
      console.log("Horizontal Corridor!");

      /**
       * All rects that will be passed to rendering
       */
      //let totalRects = [];

      let houseRect = new Rectangle().fromCoords(
        this.houseWidth,
        this.houseHeight,
        this.position.x,
        this.position.y
      );

      // Achtung: Da wird irgendwas mit NaN befüllt. hö
      let corridor = new Rectangle().fromCoords(
        this.houseWidth,
        corridorWidth,
        this.position.x,
        this.position.y
      );

      console.log("corridor:", corridor);
      // Da war immer houseRect auch drin, aber sieht kaka aus
      this.totalRects.push(corridor);

      let upperRectVertices = [
        houseRect.vertices.upperLeft,
        houseRect.vertices.upperRight,
        corridor.edges.upperEdge.vertices.vertice2,
        corridor.edges.upperEdge.vertices.vertice1,
      ];

      console.log("Constructing Rect from Vertices");
      let upperRect = new Rectangle().fromVertices(upperRectVertices);

      let lowerRectVertices = [
        corridor.edges.lowerEdge.vertices.vertice1,
        corridor.edges.lowerEdge.vertices.vertice2,
        houseRect.vertices.lowerRight,
        houseRect.vertices.lowerLeft,
      ];

      let lowerRect = new Rectangle().fromVertices(lowerRectVertices);

      // Now Divide the Rects into n/2 Rooms each
      // If n uneven, do fuck

      // TODO: Use proper min/max values calculated from maxAR or smth.
      // average room size =  lowerRect / (n/2)

      // TODO: Use parameter for divergence of average area
      // TODO: Adjust to actual n of the LA
      let avg = lowerRect._area / (n / 2);

      // TODO: Extract and to this for every Living Area Rectangle
      let nUpper;
      let nLower;
      let avgUpper;
      let avgLower;

      // If n uneven, divide n per Living Area
      // Currently only 2 areas.

      if (n % 2 != 0) {
        // Calculate upper and lower n
        nUpper = Math.floor(n / 2);
        nLower = Math.ceil(n / 2);
      } else {
        // Calculate upper and lower n
        nUpper = n / 2;
        nLower = n / 2;
      }

      // Calculate avg room size for the upper and lower rect
      avgUpper = upperRect._area / nUpper;
      avgLower = lowerRect._area / nLower;

      // TODO: Extract min/max Area calculation for
      // Living Areas in General

      // Calculate min/max area values for upper rect
      let minUpper = avgUpper - 3;
      let maxUpper = avgUpper + 3;

      // Calculate min/max area values for lower rect
      let minLower = avgLower - 3;
      let maxLower = avgLower + 3;

      // Calculate Subrectanles/Apartments for the upper/lower Living Area
      let upperRoomsRects = upperRect.splitRandomlyMinMaxOriented(
        nUpper,
        minUpper,
        maxUpper
      );
      let lowerRoomsRects = lowerRect.splitRandomlyMinMaxOriented(
        nLower,
        minLower,
        maxLower
      );

      this.totalRects = this.totalRects.concat(
        upperRoomsRects,
        lowerRoomsRects
      );

      return this.totalRects;
    } else {
      console.log("Vertical Corridor!");

      //let totalRects =[];
      let houseRect = new Rectangle().fromCoords(
        this.houseWidth,
        this.houseHeight,
        this.position.x,
        this.position.y
      );
      let corridor = new Rectangle().fromCoords(
        corridorWidth,
        this.houseHeight,
        this.position.x,
        this.position.y
      );

      this.totalRects.push(corridor);

      let leftRectVertices = [
        houseRect.vertices.upperLeft,
        corridor.vertices.upperLeft,
        corridor.vertices.lowerLeft,
        houseRect.vertices.lowerLeft,
      ];

      let leftRect = new Rectangle().fromVertices(leftRectVertices);

      let rightRectVertices = [
        corridor.vertices.upperRight,
        houseRect.vertices.upperRight,
        houseRect.vertices.lowerRight,
        corridor.vertices.lowerRight,
      ];

      let rightRect = new Rectangle().fromVertices(rightRectVertices);

      // TODO: Extract and to this for every Living Area Rectangle
      let n1;
      let n2;

      if (n % 2 != 0) {
        n1 = Math.floor(n / 2);
        n2 = Math.ceil(n / 2);
      } else {
        n1 = n / 2;
        n2 = n / 2;
      }

      // TODO: Check why splitEvenlyOriented is used here
      // Is "splitEvenlyMinMaxOriented" not ready for vertical corridor?

      // Why not use "splitRandomlyMinMaxOriented" here?
      let leftRoomsRects = leftRect.splitEvenlyOriented(n1);
      let rightRoomsRects = rightRect.splitEvenlyOriented(n2);

      this.totalRects = this.totalRects.concat(leftRoomsRects, rightRoomsRects);
      // Return corridor + left rooms + right rooms
      return this.totalRects;
    }

    //1. Place Corridor with defined width.
    //2. Generate Rectangles from Corridor Vertices and House Vertices
    //3. Subdivide the Rectangles
    //4. Happyness
  }

  // Implementation of Squarified Treemap. Randomization by differing the Areas of the rooms (here: appartments)
  // Goal: Define Apartment Vertices.
  // Inputs: List of predefined apartmentSizes, width/height of house

  // TODO: in manchen fällen wird nur ein sehr langes apartment in die row gepackt. warum ?
  // TODO: Auf Rectangles anwendbar machen!

  // TODO: Ensure return of Rectangles at the end!
  squarifiedTreeMap(apartmentSizes) {
    console.log("Start STM");

    if (this.apartmentSizeList == []) {
      console.error("ERROR: STM requires apartmentSizeList");
    }

    // Define initial vertices of wall edges
    // let currentWidth = this.houseWidth;
    //let currentHeight = this.houseHeight;

    // Copy apartmentSizes list to leave the original list intact
    //currentRow.map(preAp => ({ ...preAp }));
    let apartmentSizeList = apartmentSizes.slice(0);

    // TODO: Order apartmentSizeList

    // TODO: hier an Koordinatensystem (0,0 unten links) anpassen.
    let leftWall = {
      a: new THREE.Vector2(0, this.houseHeight),
      b: new THREE.Vector2(0, 0),
    };

    let lowerWall = {
      a: new THREE.Vector2(0, 0),
      b: new THREE.Vector2(this.houseWidth, 0),
    };

    // Will contain PreApartments (contain area, width, height, aspectRatio)
    // let currentRow = [];

    // while hier: wiederholt zwischen den wechseln der wände. (worst ist schlechter geworden)
    //   while (apartmentSizeList.length > 0) {

    while (apartmentSizeList.length > 0) {
      // Reinitialize lists etc.

      let currentHeight = Tools.getInstance().distanceBetweenTwoVertices(
        leftWall.a,
        leftWall.b
      );
      let currentWidth = Tools.getInstance().distanceBetweenTwoVertices(
        lowerWall.a,
        lowerWall.b
      );
      let currentRow = [];

      console.log("current width", currentWidth, "currentheigt", currentHeight);

      //"" currentWidth > currentHeight
      if (currentWidth > currentHeight) {
        console.log("wider than high");
        // Wider than high: place on left wall

        // Add rooms to row until the worst of their aspect ratios worsens
        // Only add rooms to row if they are confirmed to improve the worst aspect ratio

        // While hier: durch apartmentSizes iterieren und immer versuchen, ein preApartment der nächsten Größe
        // in die Row zu packen
        while (apartmentSizeList.length > 0) {
          console.log(
            ">>>>>>>>>>>>>>>New Iteration of trying to add preApartments to left wall row"
          );

          // First one's free
          if (currentRow.length == 0) {
            let firstApartmentArea = apartmentSizeList.shift();
            console.log("left apartment sizes: ", apartmentSizeList);
            // new PreApartment that adapts to the wall length (currentHeight)

            // TODO: Schauen, ob sich die currentHeight im Verlauf irgendwie verändert und das dann ne DeepCopy ist, die auch das preAp verändert ... ?
            console.log("First in Row:");
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
          let nextRowAreaSum = currentRowAreaSum + apartmentSizeList[0];

          // console.log("currentRowAreaSum: (should be 10) ", currentRowAreaSum)
          //console.log("nextRowAreaSum: (should be 10) ", nextRowAreaSum)
          // Calculate next row width
          let nextRowWidth = nextRowAreaSum / currentHeight;

          // Copy current row and update the contained PreApartments with the nextRowWidth, which also updates their aspectratio

          // .map to crete deep copy.
          // new PreApartment to keep the types of "PreApartment"
          // using ... (stretch) would convert the objects to plain objects
          console.log("Copying currentRow preAp list");
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

          console.log("Create possible next preAp:");
          // Create possible next apartment
          let nextPreApartment = new PreApartment(
            apartmentSizeList[0],
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
          console.log(
            "Test: nextRow worst aspect Ratio",
            nextRowWorstAspectRatio,
            "vs currentRow worst aspect Ratio",
            currentRowWorstAspectRatio
          );

          // If lower than the current worst AP, set currentRow = nextCurrentRow and repeat
          // If higher, Wände neu berechnen, Apartments generieren, etc.
          if (currentRowWorstAspectRatio > nextRowWorstAspectRatio) {
            // Nächste Runde
            currentRow = nextRow;
            console.log("aspect Ratio improved");
            apartmentSizeList.shift();
            console.log("left apartment sizes: ", apartmentSizeList);
          } else {
            console.log("aspect Ratio worsened");
            // calculate x/y positions of apartments.

            // All preAps in row have same width
            // let rowWidth  = currentRow[0].width

            // Take coords from lower vertice of left wall (starts at 0,0)
            //lW.b = (0,0)

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
              this.apartments.push(newApartment);
              ySum += preAp.height;

              // lower = first = 1

              if (preApCount == 1) {
                // Set new wall lower vertex to lower new Apartment.vertices.c

                console.log("set left wall b");
                leftWall.b = newApartment.vertices.b;
                lowerWall.a = newApartment.vertices.b;
              }
              // upper = last = length
              if (preApCount == currentRow.length) {
                // Set new wall upper vertex to upper new Apartment.vertices.b
                console.log("set left wall a");
                leftWall.a = newApartment.vertices.c;

                // Set upper wall left vertex
                //lowerWall.a = newApartment.vertices.b
              }

              preApCount++;
            }

            console.log("new left wall:", leftWall);
            console.log("new lower wall ", lowerWall);

            // "Da geht irgendwas mit den Vertices schief." ???
            // Das 18er Apartment ist unten, hat aber a bei 0,0 bzw die Vertices vom oberen. wtf?

            // Lösung: 0,0 ist unten links. X ist nach oben, Y ist nach rechts.... wtf

            // Wände neu berechnen
            // row zurücksetzen

            // TODO: does break apply to the loop directly containing it or all loops?

            // TODO: Remove return
            //
            console.log("fixed apartments after left wall placement:");
            for (let ap of this.apartments) {
              ap.logApartment();
            }

            console.log(">>>>>>>>>>>>>>> END of left wall placement ");
            //return;
            break;
          }
        }
      } else {
        // Higher than wide: place on lower wall
        // TODO: Implement

        console.log("higher than wide");
        // Wider than high: place on left wall

        // Add rooms to row until the worst of their aspect ratios worsens
        // Only add rooms to row if they are confirmed to improve the worst aspect ratio

        // While hier: durch apartmentSizes iterieren und immer versuchen, ein preApartment der nächsten Größe
        // in die Row zu packen
        while (apartmentSizeList.length > 0) {
          console.log(
            "vvvvvvvvvvvvvvvvvvv New Iteration of trying to add preApartments to lower wall row"
          );

          // First one's free
          if (currentRow.length == 0) {
            let firstApartmentArea = apartmentSizeList.shift();
            console.log("left apartment sizes: ", apartmentSizeList);
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
          let nextRowAreaSum = currentRowAreaSum + apartmentSizeList[0];

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
            apartmentSizeList[0],
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
          console.log(
            "Test: nextRow worst aspect Ratio",
            nextRowWorstAspectRatio,
            "vs currentRow worst aspect Ratio",
            currentRowWorstAspectRatio
          );

          // If lower than the current worst AP, set currentRow = nextCurrentRow and repeat
          // If higher, Wände neu berechnen, Apartments generieren, etc.
          if (currentRowWorstAspectRatio > nextRowWorstAspectRatio) {
            // Nächste Runde
            currentRow = nextRow;
            console.log(" lower aspect Ratio improved");
            apartmentSizeList.shift();
            console.log("left apartment sizes: ", apartmentSizeList);
          } else {
            console.log("aspect Ratio worsened");

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
              this.apartments.push(newApartment);
              xSum += preAp.width;

              // lower = first = 1
              // upper = last = length
              console.log("setting lower wall");
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

            console.log("new left wall:", leftWall);
            console.log("new lower wall ", lowerWall);

            // "Da geht irgendwas mit den Vertices schief." ???
            // Das 18er Apartment ist unten, hat aber a bei 0,0 bzw die Vertices vom oberen. wtf?

            // Lösung: 0,0 ist unten links. X ist nach oben, Y ist nach rechts.... wtf

            // Wände neu berechnen
            // row zurücksetzen

            // TODO: does break apply to the loop directly containing it or all loops?

            console.log("fixed apartments after lower wall placement:");
            for (let ap of this.apartments) {
              ap.logApartment();
            }

            console.log(
              "vvvvvvvvvvvvvvvvvvv END of iteration of trying to add preApartments to lower wall row"
            );
            // return;
            break;
          }
        }
        // Add rooms to row until the worst of their aspect ratios worsens
      }
    }
  }

  // Interessant: Beim Wechsel aufs nächstkleinere freie Subrectangle kann variiert werden:
  // Bei breiter-als-hoch spielt es vom Platz her eig. keine Rolle, ob an die linke oder Rechte Wand gebaut wird.
  // Bei höher-als-breit auch so mit unten/oben
  // TODO: einfacher ansatz mit: immer unten bzw. immer links.
  // TODO: gemischterer einsatz mit: random links/rechts bzw. random oben/unten

  getHouseMesh() {
    return this.houseShapeObject.getMesh();
  }

  getAllMeshes() {
    let allMeshes = [this.getHouseMesh()];
    // Move houseMesh to Background
    allMeshes[0].position.add(new THREE.Vector3(0, 0, -0.1));
    for (let apartment of this.apartments) {
      allMeshes.push(apartment.mesh);
    }
    return allMeshes;
  }

  getPointHelperMesh(x, y) {
    // Create a small sphere geometry
    const spheregeometry = new THREE.SphereGeometry(0.1, 32, 16);
    const spherematerial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(spheregeometry, spherematerial);
    sphere.position.set(x, y, 0);

    return sphere;
  }

  calculateFloorPlan() {
    // TODO: Rekursiv machen, nach Anleitung vom Paper.
    // Andere Leute habens auch schon geschafft.
    // Aber kann man da die Vertices rausziehen? Basically bei jedem "fix Row" können die berechnet werden.

    // Vertices: a upper left, b upper right, c lower right, d lower left

    var leftWall = [this.vertices.a, this.vertices.c];
    var leftWallRooms = [];
    var upperWall = [this.vertices.a, this.vertices.b];
    var upperWallRooms = [];
    var rightWall = [this.vertices.b, this.vertices.c];
    var rightWallRooms = [];
    var lowerWall = [this.vertices.c, this.vertices.d];
    var lowerWallRooms = [];

    // Erstmal einfach:
    // Raum zu leftWallList. hinzufügen.
    // Vertices aller Räume davon setzen!
    // Dabei wird die AspectRatio berechnet.

    // 1. Berechne Breite des RaumBlocks (alle Räume aufeinander gestapelt)
    // 2. Berechne Höhe der Räume im RaumBlock: Anteilig an der Länge der Wand
    // 3. Setze die Vertices der Räume anhand ihrer Breite+Höhe!
    // Test mit 3 Räumen:

    // Berechne Länge der Platzier-Wand
    //let placementWallLength = this.distanceBetweenTwoVertices(leftWall[0], leftWall[1]);

    // Hole die 3 Räume
    // Ohne Push! sonst [ [r1,r2,r3] ]
    // Wir wollen aber direkt [r1,r2,r3]
    leftWallRooms = this.apartments.slice(0, 3);
    console.log("Räume 1-3:", leftWallRooms);

    let roomBlockAreaSum = leftWallRooms.reduce(
      (areasum, apartment) => areasum + apartment.area,
      0
    );
    console.log("Räume 1-3 Area sum: ", roomBlockAreaSum);

    // Berechne Breite des aktuellen Roomblocks aus Wandlänge und Fläche des Roomblocks
    // Breite = roomblockarea/höhe
    let roomBlockWidth = roomBlockAreaSum / placementWallLength;

    // Test: Berechnen der Höhe/Breite des RoomBlocks.
    console.log(
      "roomblockwidth: ",
      roomBlockWidth,
      "wall length: ",
      placementWallLength,
      " roomblock area sum redone: ",
      roomBlockWidth * placementWallLength
    );

    // Nun Vertices platzieren: Unten anfangen.
    // Für jeden Raum bei Vertice A anfangen, dann im Uhrzeigersinn.

    // Fall 1: Linke Wand:
    //      1. Raum.a = placementWall[0].x | placementWall[0].y - 1.raum.anteilAnDerPlacementWall
    //      1. Raum.b = 1.Raum.a.x + roomblockwidth | 1.raum.a.y
    //      1. Raum.c = 1.raum.a.x + roomblockwidth | 1.raum.a.y + 1.raum.anteilanderplacementWall
    //      1. Raum.c = placementWall[0]

    // - Das macht absolut keinen Sinn das so zu machen, oder?
    //   Das wird ein einziges "if/else" - Spezialfall-Geficke und setzen von einzelnen Punkten.
    //   Lieber https://github.com/nicopolyptic/treemap/blob/master/src/main/ts/squarifier.ts

    // Repeatedly try to place rooms (biggest ones first) on the start wall
    //(left wall if width>height, upper wall if width < height)

    // Hier

    // Step 1: Schauen ob width oder height größer ist.
    // wenn width größer, platziere das erste apartment auf der linken seite
    // -> vertex a = house.a  vertex c = house.c
    // die anderen berechnen sich aus fläche = width*height  -> width = fläche/height
    // -> vertex b = vertex a + width   vertex d =  vertex c + width

    // wenn height größer, platziere das erste apartment auf der oberen seite:
    // a = house.a,  b = house.b ,  c = house.a + fläche/width

    // Step 2:
    // Wenn houseWidth > houseHeight (links platziert):
    // Platziere den nächsten Raum über dem vorigen Raum, sodass diese dieselbe Höhe haben.

    // Wenn houseWidth <  houseHeight (oben Platziert: )
    // Platziere den nächsten Raum rechts davon.

    // Wenn der NEUE

    // TODO: Rausfinden, wie man Räume über/neben andere Räume platziert, sodass die Gesamtform ein Rectangle innerhalb
    // der Grundfläche bleibt.
    // Was sind die länge/breite/ Vertices dann?

    // Lösung:
    // Wall-orientiert arbeiten, eine Liste pro Wall.
    // Immer die Remaining Free Area aus den Vertices der Walls berechenbar machen

    // Erst anfangen mit Wall left (0,0) bis (0,h)
    // An die dann ein apartment nach dem anderen platzieren, sodass die Höhe aller aneinandergereihten Apartments
    // immer der Höhe der Wand entspricht. Dann breite so rausfinden, dass diese Kombiniert mit der Höhe
    // die Area der addierten Apartment-Flächen fassen kann.

    // Beispiel: Linke Wand Höhe 10.
    // Apartment 1 Area 5, Apartment 2 Area 4
    // Höhe AP1 + AP 2 = 10
    // Fläche AP1+AP2 = 9
    // Fläche = Breite * Höhe
    // Breite AP1+AP2 = Fläche/Höhe = 9/10
    //
    // Nun Höhe der einzelnen Apartments rausfinden:
    // Gesamthöhe anteilig der Fläche der Apartments aufteilen
    //
    // Beispiel: Gesamthöhe = 10
    // Höhe AP1 = Flächenanteil AP1 * 10
    // Flächenanteil AP1 = Fläche AP1 / (Fläche AP1+ Fläche AP2)

    // -> Flächenanteil AP1 = 5 / 9
    // Höhe AP1 = 5/9 *10  = 5,555

    //

    // Nach Schritt "Aspect Ratio verschlechtert sich": undo des Hinzufügens des neuen Apartments an die Wand
    // Setze die Wand-Koordinaten dann neu auf vertex b des oberen und vertex d des unteren Apartments.
  }
}

export default House;
