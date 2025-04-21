import * as THREE from "three";
import Apartment from "./Apartment";
import ShapeObject from "./ShapeObject";
import PreApartment from "./PreApartment";
import Rectangle from "./Rectangle";
import Edge from "./Edge";

import Tools from "./Tools";
import HouseCalculator from "./HouseCalculator";
import { IndirectStorageBufferAttribute, Vector2 } from "three/webgpu";
import { color, cos } from "three/tsl";

// TODO: Use new House constructor everywhere

class House {
  /**
   * Generates an empty house object.
   * Fill or redefine with decorator methods.
   */
  constructor() {
    // House Area wird eig nur in randomShape verwendet glaub
    this.houseArea = undefined;

    /**
     * current n
     */
    this.apartmentCount = undefined;

    /**
     * width of building
     */
    this.houseWidth = undefined;

    /**
     * height of building
     */
    this.houseHeight = undefined;
    /**
     * current height of living areas
     */
    this.k = undefined;
    /**
     * current amount of corridors
     */
    this.i = undefined;

    this.corridorWidth = undefined;
    this.corridorThresholds = [];

    this.corridorsHorizontal = undefined;

    /**
     * The rects from the Apartments, corridor and rooms
     */
    this.houseRect = undefined;

    // TotalRects macht eigentlich nie Sinn, oder?
    this.totalRects = [];
    this.apartmentRects = [];
    this.roomRects = [];
    this.mainCorridorRects = [];
    this.connectorRects = [];
    this.livingAreaRects = [];

    this.corridorColor = new THREE.Color(0xffff00);
    this.livingAreaColor = new THREE.Color(0xff00c8);
    this.apartmentColors = [
      new THREE.Color(0x6eb7d4),
      new THREE.Color(0x43a9d1),
      new THREE.Color(0x1e9ed1),
      new THREE.Color(0x008bc2),
      new THREE.Color(0x00638a),
    ];

    // a: upper left
    // b: upper right
    // c: lower left
    // d: lower right

    // Edges and stuff are done in house-Rectangle creation

    // TODO: Doublecheck vertex order
    /**
     * a: upper left
     * b: upper right
     * c: lower left
     * d: lower right
     *
     */

    // TODO: Maybe remove this, as this is also done in Rectangle
    this.vertices = {
      a: null,
      b: null,
      c: null,
      d: null,
    };

    /*
    this.minApartmentSize = minApartmentSize;
    this.maxApartmentSize = maxApartmentSize;
*/
    // List of Apartment ShapeObjects

    // Apartments for STM Room generation
    // Möglicherweise auch obsolete mittlerweile, da alles in Rectangles gemacht werden kann.
    this.apartments = [];

    // Größen (Area) der einzelnen Apartments -
    // Wird eigentlich auch nirgends verwendet, außer vielleicht in STM
    this.apartmentSizes = [];

    // ShapeObject of house base shape
    this.houseShapeObject = null;

    // Utilities
    this.houseCalc = HouseCalculator.getInstance();

    // this.calculateRooms();
  }

  /**
   * Wrapper Method for the construction process
   * - Obsolete?
   */
  calculateRooms() {
    this.randomHouseShape(); // Mirahmadi Step 1/
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
   *
   */

  definedHouseShape(width, height) {
    if (width == null || height == null) {
      console.error(
        ">calculateDefinedHouseShape: House width or height not specified!"
      );
      return;
    }

    this.corridorThresholds = [];

    this.houseWidth = width;
    this.houseHeight = height;

    this.houseArea = width * height;

    this.position = {
      x: this.houseWidth / 2,
      y: this.houseHeight / 2,
    };

    // this.houseRect only changes here, if width and height are changed
    this.houseRect = new Rectangle().fromCoords(
      this.houseWidth,
      this.houseHeight,
      this.position.x,
      this.position.y
    );

    this.calculateHouseVertices();

    // Calculate Shape object
    // TODO: obsolete?
    const shapeVertices = [
      this.vertices.a,
      this.vertices.b,
      this.vertices.c,
      this.vertices.d,
    ];
    // TODO: Specify housecolor

    // Create Shape from vertices and color
    // Shape ist sowas wie Rectangle, aber älter
    this.houseShapeObject = new ShapeObject(shapeVertices, 0xffff11);

    return this;
  }

  /**  Calculates Random House Rectangle Shape with aspect ratio from 0.8 to 1.2,
   *   with defined area
   * sets house position and vertices and shapeobject
   */

  randomHouseShape(houseArea) {
    var aspectRatio = 0.6 + 0.8 * Math.random(); // AR zw. 0.6 und 1.4

    //  console.log("random aspect ratio " + aspectRatio);
    // aspectratio = a/b
    // a = aspectratio/b

    /*
        var aMin = Math.sqrt(0.8*this.houseArea)  // gives Aspect Ratio of 0.8 POOPCODE
        var aMax = Math.sqrt(1.2*this.houseArea);     // gives Aspect Ratio of 1.2 
*/

    // 0.4 = maxAspectRatio - minAspectRatio
    var width = Math.sqrt(houseArea * aspectRatio);
    var height = houseArea / width;

    return this.definedHouseShape(width, height);
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

  // Generate a simple Building with an I-Shaped Corridor, connecting both sides of the Building
  // with n Apartments
  simpleICorridor(corridorHeight, n) {
    this.corridorWidth = corridorHeight;
    // x/y = width/height /2

    this.resetRects();
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
    }

    return this;

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
   * The Apartments are then accessible through apartmentRects
   * The Corridor is then accessible through corridorRects
   *
   * @param {} corridorWidth
   * @param {*} n
   * @returns
   */

  // TODO: Bei Vertical sind alle Räume gleich groß...
  randomizedICorridor(n, corridorWidth) {
    this.corridorWidth = corridorWidth;
    console.log("> RandomizedICorridor");

    this.resetRects();
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
      /**
       * All rects that will be passed to rendering
       */
      //let totalRects = [];

      this.totalRects = [];

      this.k = (this.houseHeight - corridorWidth) / 2;
      console.log("Horizontal Corridor! with k", this.k);
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

      this.mainCorridorRects.push(corridor);
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
      let upperRoomsRects = upperRect.splitRandomlyMinMaxSizeOriented(
        nUpper,
        minUpper,
        maxUpper
      );
      let lowerRoomsRects = lowerRect.splitRandomlyMinMaxSizeOriented(
        nLower,
        minLower,
        maxLower
      );

      // Add apartments
      this.apartmentRects = this.apartmentRects.concat(
        upperRoomsRects,
        lowerRoomsRects
      );

      this.totalRects = this.totalRects.concat(
        upperRoomsRects,
        lowerRoomsRects
      );
    } else {
      this.k = (this.houseWidth - corridorWidth) / 2;
      console.log("Vertical Corridor! with k:", this.k);
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

      // Add corridorRects
      this.mainCorridorRects.push(corridor);
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

      this.apartmentRects = this.apartmentRects.concat(
        leftRoomsRects,
        rightRoomsRects
      );
      this.totalRects = this.totalRects.concat(leftRoomsRects, rightRoomsRects);
    }

    return this;
  }

  /**
   * Better implemenentation of "simpleICorridor" without apartments or living areas
   */

  singleCorridor(corridorWidth, horizontalPlacement) {
    // TODO: Checkt LAGeneration das? ja.
    console.log(">singleCorridor");

    // HorizontalPlacement: Platziere entlang der x-Achse, also vertikal!
    if (horizontalPlacement) {
      this.mainCorridorRects.push(
        new Rectangle()
          .fromCoords(
            corridorWidth,
            this.houseHeight,
            this.houseWidth / 2,
            this.houseHeight / 2
          )
          .setColor(this.corridorColor)
      );
    } else {
      this.mainCorridorRects.push(
        new Rectangle()
          .fromCoords(
            this.houseWidth,
            corridorWidth,
            this.houseWidth / 2,
            this.houseHeight / 2
          )
          .setColor(this.corridorColor)
      );
    }

    return this;
  }

  // TODO: exctract method for filling living area rectangles/ rectangles in general along their longer side
  // TODO: Handle "1" as corridorCount input

  // TODO: Extract methods for (multicorridor-horizontal and /-vertical), then let this method
  // decide which split direction shall be used
  // TODO: Think about which is the best corridor placement direction... heheheheheheh

  // TODO: Use this in the real world case of
  // "generate corridors for the specified amount of corridors according to the specified n"

  /**
   * Places multiple corridors along the specified side (shorter/longer, which ever this may be) of the house
   * corridorCount and orientation must be calculated before and can be anything
   * @param {*} corridorWidth
   * @param {*} corridorCount
   * @param {*} onShorterSide If true:
   * @returns
   */
  multiCorridorLayout(corridorWidth, corridorCount, onShorterSide) {
    this.resetRects();

    this.k = undefined;

    console.log(">multiCorridorLayout on shorterside: ", onShorterSide);
    this.corridorWidth = corridorWidth;
    let longerSide =
      this.houseWidth > this.houseHeight ? this.houseWidth : this.houseHeight;
    let shorterSide =
      this.houseWidth > this.houseHeight ? this.houseHeight : this.houseWidth;

    let placementSide = onShorterSide ? shorterSide : longerSide;
    let nonPlacementSide = onShorterSide ? longerSide : shorterSide;

    console.log(
      "multicorr placementSide: ",
      placementSide,
      " nonplacement ",
      nonPlacementSide
    );

    if (corridorCount == 0) {
      // livingAreaGeneration can handle this!
      console.error("No Corridors!");
      this.k = shorterSide;
      return this;
    }

    // TODO: Check if the placementSide (shorter or longer) is horizontal or vertical

    // wenn rect horizontal und onShorterSide: vertical (y++)
    // wenn rect horiziontal und onLongerSide: horizontal (x++)

    // wenn rect vertical und onShorterSide: horizontal (x++)
    // wenn rect vertical und onLongerside: vertical (y++)

    // HorizontalPlacement bedeutet: Entlang der x-Achse platzieren, nicht dass die
    // Corridors Horizontal sind!

    let horizontalPlacement =
      (this.houseRect.isHorizontal && !onShorterSide) ||
      (!this.houseRect.isHorizontal && onShorterSide)
        ? true
        : false;

    console.log(
      horizontalPlacement ? "horizontalplacement" : "verticalplacement"
    );

    // Kommt calcK mit 1 corridor klar?
    // möglicherweise nicht!

    if (corridorCount == 1) {
      let k = this.houseCalc.calculateK(
        // TODO: Remove quick fix
        // Hier einfach Quick fix, da k für 1 Korridor falsch berechnet wird warum auch immer
        //nonPlacementSide,
        placementSide,
        corridorCount,
        corridorWidth
      );

      this.k = k;
      this.i = 1;
      // console.error("Multicorr not implemented for 1 corr");

      // TODO: reimplement simpleCorridorLayout and use it here
      // --- Along which side?
      // needs "orientation Parameter!"

      return this.singleCorridor(corridorWidth, horizontalPlacement);
    }

    let k = this.houseCalc.calculateK(
      placementSide,
      corridorCount,
      corridorWidth
    );

    // From here on: Placement always horizontally!
    // TODO: Check if placementSide is horizontal or vertical!
    // calculate k
    // longer side,i, corrwidth
    // K passt!

    //console.log("k:", k);

    // Place corridorCount* corridor rects along longer side with k + corridorWidth/2 distance to each other
    // x =
    // y = shorterside/2

    let corridorRects = [];
    let connectorRects = [];

    if (horizontalPlacement) {
      // TODO: platzierung ist nicht immer nach K!
      // nur beim ersten ist die k. danach immer 2k

      // Hier passiert eigentlich nur: nimm das K und platziere neue corridorRects entlang der
      // x-Achse
      // Generating the main corridors
      let currentX = k + corridorWidth / 2;
      let firstRect = new Rectangle()
        .fromCoords(
          corridorWidth,
          nonPlacementSide,
          currentX,
          nonPlacementSide / 2
        )
        .setColor(this.corridorColor);

      corridorRects.push(firstRect);

      // The corridors are added from left to right/ from top to bottom
      for (let currentI = 2; currentI <= corridorCount; currentI++) {
        currentX = currentX + 2 * k + corridorWidth;
        let currentRect = new Rectangle()
          .fromCoords(
            corridorWidth,
            nonPlacementSide,
            currentX,
            nonPlacementSide / 2
          )
          .setColor(this.corridorColor);
        corridorRects.push(currentRect);
      }

      // Connectors:
      // width 2k
      // height corridorWidth
      // y shorterSide/2
      // x: Start at 2k+ corridorWidth, then always +  (2k+corridorWidth)

      // Add connectors
      //let currentConX =
      for (let f = 1; f <= corridorCount - 1; f++) {
        let currentConX = f * (2 * k + corridorWidth);
        let currentConRect = new Rectangle()
          .fromCoords(2 * k, corridorWidth, currentConX, nonPlacementSide / 2)
          .setColor(this.corridorColor);
        connectorRects.push(currentConRect);
      }

      this.k = k;
      this.i = corridorCount;
      this.mainCorridorRects = corridorRects;
      this.connectorRects = connectorRects;
      //this.generateLivingAreaRects(k);

      // Return this with corridorRects generated
    } else {
      // vertical placement

      // start at y0 + stuff
      let currentY = k + corridorWidth / 2;
      let firstRect = new Rectangle()
        .fromCoords(
          nonPlacementSide,
          corridorWidth,
          nonPlacementSide / 2,
          currentY
        )
        .setColor(this.corridorColor);

      corridorRects.push(firstRect);

      // The corridors are added from left to right/ from top to bottom
      for (let currentI = 2; currentI <= corridorCount; currentI++) {
        currentY = currentY + 2 * k + corridorWidth;
        let currentRect = new Rectangle()
          .fromCoords(
            nonPlacementSide,
            corridorWidth,
            nonPlacementSide / 2,
            currentY
          )
          .setColor(this.corridorColor);
        corridorRects.push(currentRect);
      }

      // Connectors:
      // width 2k
      // height corridorWidth
      // y shorterSide/2
      // x: Start at 2k+ corridorWidth, then always +  (2k+corridorWidth)

      // Add connectors
      //let currentConX =
      for (let f = 1; f <= corridorCount - 1; f++) {
        let currentConY = f * (2 * k + corridorWidth);
        let currentConRect = new Rectangle()
          .fromCoords(corridorWidth, 2 * k, nonPlacementSide / 2, currentConY)
          .setColor(this.corridorColor);
        connectorRects.push(currentConRect);
      }

      this.k = k;
      this.i = corridorCount;
      this.mainCorridorRects = corridorRects;
      this.connectorRects = connectorRects;
    }

    return this;

    // TODO: set this.livingAreaRects, this.totalRects
  }

  /**
   * Must be executed upon change of these paramsies. But not with every change of n
   * @param {*} corridorWidth
   * @param {*} minApWidth
   * @param {*} maxApWidth
   */
  generateThresholds(corridorWidth, minApWidth, maxApWidth) {
    this.corridorThresholds = this.houseCalc.calculateMinMaxCorridorThresholds(
      this.houseWidth,
      this.houseHeight,
      corridorWidth,
      minApWidth,
      maxApWidth
    );
    return this;
  }

  /**
   * Generate 0,1 or multi corridor layout where the amount of corridors adapts to the
   * desired amount of apartments (n) and chooses the minimal amount of corridors
   */
  adaptiveMultiCorridorLayout(corridorWidth, minApartmentWidth, n) {
    // this.corridorWidth = corridorWidth;
    // this.minApartmentWidth = minApartmentWidth;
    this.resetRects();
    console.log(">adaptiveMultiCorridorLayout");
    // TODO: Recall saved Thresholds. Can only be done if only n changed and the other stuff is the same!

    if (n == 1) {
      return this.multiCorridorLayout(corridorWidth, 0);
    }

    if (this.corridorThresholds == []) {
      // Only generate if not generated before!
      // Achtung: corridorThresholds enthält jetzt sowas wie [1, {vertical:13,horizontal:15}, {vertical:20,horizontal:25},]
      console.error("No thresholds generated beforehand! Do it now!");
      this.corridorThresholds = this.houseCalc.calculateCorridorThresholds(
        this.houseWidth,
        this.houseHeight,
        corridorWidth,
        minApartmentWidth
      );
    }

    console.log("New Thresholds: ", this.corridorThresholds);

    // 1. Calculate the needed amount of corridors for the inputs - iterate through thresholds and find the correct index.

    // fetch the value out of the threshold array's threshold sets, that is either == n or the smallest that is >n

    // TODO: Welches corridorlayout wird präferiert?

    // !! auf jeden Fall das mit weniger Korridoren, da weniger Korridorfläche = mehr platz für Wohnraum.
    //
    // bei n = 30 , i =  x und shorter = 38 / longer = 40

    // 1. das präferieren, wo n genauer reinpasst, also shorter 38?
    // -> genauer reinpassen bedeutet: weniger Random spielraum für Wohnungen!
    // -> ungenauer reinpassen bedeutet: mehr Random spielraum für Wohnungen!
    // oder
    // 2. das präferieren, wo Weniger korridorfläche? als longer

    let corridors = 1;
    let isShorter;
    for (let ts of this.corridorThresholds) {
      //   if()
      // Wir gehen frech davon aus dass die Dinger sortiert sind und dass nicht
      // bei höheren Korridoren nochmal bessere Elemente kommen

      if (ts.longer >= n) {
        isShorter = false;
        console.log("the best threshold is ", ts.longer, " and on longer side");
        break;
      }

      // Check if the threshold fits perfectly or is the first one that is bigger than n
      if (ts.shorter >= n) {
        isShorter = true;
        console.log(
          "the best threshold is ",
          ts.shorter,
          " and on shorter side"
        );
        break;
      }

      corridors++;
    }

    console.log(
      "adapted to amount of corridors: ",
      corridors,
      " and ",
      isShorter ? " shorter" : " longer"
    );

    // 2. generate multi corridor layout with the found amount of apartments
    return this.multiCorridorLayout(corridorWidth, corridors, isShorter);
  }

  /**
   *  */
  //  TODO: Irgendwie dumm, hier für jedes neue n neue Thresholds zu berechnen.
  // Die muss man eig nur bei Änderungen von width/height,corrWidth,min/maxWidth neu berechnen!

  adaptiveMinMaxMultiCorridorLayout(
    corridorWidth,
    minApartmentWidth,
    maxApartmentWidth,
    n
  ) {
    // this.corridorWidth = corridorWidth;
    // this.minApartmentWidth = minApartmentWidth;
    this.resetRects();
    console.log(">adaptiveMultiCorridorLayout");
    // TODO: Recall saved Thresholds. Can only be done if only n changed and the other stuff is the same!

    if (n == 1) {
      return this.multiCorridorLayout(corridorWidth, 0);
    }

    // Achtung: corridorThresholds enthält jetzt sowas wie [1, {vertical:13,horizontal:15}, {vertical:20,horizontal:25},]
    this.corridorThresholds = this.houseCalc.calculateMinMaxCorridorThresholds(
      this.houseWidth,
      this.houseHeight,
      corridorWidth,
      minApartmentWidth,
      maxApartmentWidth
    );

    console.log("New Thresholds: ", this.corridorThresholds);

    // 1. Calculate the needed amount of corridors for the inputs - iterate through thresholds and find the correct index.

    // fetch the value out of the threshold array's threshold sets, that is either == n or the smallest that is >n

    // TODO: Welches corridorlayout wird präferiert?

    // !! auf jeden Fall das mit weniger Korridoren, da weniger Korridorfläche = mehr platz für Wohnraum.
    //
    // bei n = 30 , i =  x und shorter = 38 / longer = 40

    // 1. das präferieren, wo n genauer reinpasst, also shorter 38?
    // -> genauer reinpassen bedeutet: weniger Random spielraum für Wohnungen!
    // -> ungenauer reinpassen bedeutet: mehr Random spielraum für Wohnungen!
    // oder
    // 2. das präferieren, wo Weniger korridorfläche? als longer

    // Thresholds:

    /*
    let thresholdSet = {
        i: i,
        shorter: null | {min:x , max:y},
        longer: null | {min:x , max:y}
      };

      */

    let i = null;
    let isShorter;

    for (let ts of this.corridorThresholds) {
      //   if()
      // Wir gehen frech davon aus dass die Dinger sortiert sind und dass nicht
      // bei höheren Korridoren nochmal bessere Elemente kommen

      // Achtung: Thesholds jetzt immer so:

      if (ts.longer != null && ts.longer.min <= n && ts.longer.max >= n) {
        // longer config is feasible and n fits in its limits!
        isShorter = false;
        i = ts.i;
        console.log(
          "the best threshold is ",
          ts.longer,
          " for ",
          i,
          " corridors on longer side"
        );

        break;
      }

      // Check if the threshold fits perfectly or is the first one that is bigger than n
      if (ts.shorter != null && ts.shorter.min <= n && ts.shorter.max >= n) {
        isShorter = true;
        i = ts.i;
        console.log(
          "the best threshold is ",
          ts.shorter,
          " for ",
          i,
          " corridors on shorter side"
        );
        break;
      }
    }

    if (i == null) {
      console.error(
        "ERROR: no house could be produced for this exact value of n"
      );
      return this;
    }
    console.log(
      "adapted to amount of corridors: ",
      i,
      " and ",
      isShorter ? " shorter" : " longer"
    );

    // TODO: Save if corridors are placed horizontally (along x) or vertically (along y)
    //return;

    // 2. generate multi corridor layout with the found amount of apartments
    return this.multiCorridorLayout(corridorWidth, i, isShorter);
  }

  /**
   * Generates rect's for the current corridor Layout's living areas
   * @returns
   */

  // TODO: Handle i = 0 as one living area
  // TODO: Handle i = 1 as two big living areas

  // TODO: Orientation
  generateLivingAreaRects() {
    // i is given from this.corridorRects.length
    // NO! denn da sind alle Rects drinnen!

    // Reset LA rects only.
    // Corridors are generated before and in these methods, every other rect array is reset

    console.log(">generateLivingAreaRects");

    let livingAreaColor = this.livingAreaColor;
    this.livingAreaRects = [];
    const i = this.mainCorridorRects.length;

    if (this.k == undefined) {
      console.error(">LA Generation error: corridor generation was skipped!");
      return this;
    }

    // 1. Take the first two corridor rects, which are the first two in the corridor list
    // Exception: if corridor is only one

    if (i == 0) {
      console.log("0 corridors: 1 Living Area");
      this.livingAreaRects.push(this.houseRect);
      return this;
      // TODO: one Living Area, is the house rectange
      // also is the only apartment.
    }

    if (i == 1) {
      let corr = this.mainCorridorRects[0];
      if (corr.isHorizontal) {
        // upper/lower
        let upperFullLivingArea = corr.edges.upperEdge
          .spawnRectangle(this.k, new Vector2(0, 1))
          .setColor(livingAreaColor);

        let lowerFullLivingArea = corr.edges.lowerEdge
          .spawnRectangle(this.k, new Vector2(0, -1))
          .setColor(livingAreaColor);

        this.livingAreaRects.push(upperFullLivingArea, lowerFullLivingArea);
      } else {
        // left right
        let leftFullLivingArea = corr.edges.leftEdge
          .spawnRectangle(this.k, new Vector2(-1, 0))
          .setColor(livingAreaColor);
        let rightFullLivingArea = corr.edges.rightEdge
          .spawnRectangle(this.k, new Vector2(1, 0))
          .setColor(livingAreaColor);

        this.livingAreaRects.push(leftFullLivingArea, rightFullLivingArea);
      }
      return this;
    }

    // For this.corridors.length >1
    // Die main corridors werden nacheinander in this.corridorRects gepackt!
    // d.H. die outers sind bei [0] und [i-1]

    // Generate full height/width living areas
    // First the two outer ones

    // Horizontal heißt hier: äußerer Korridor ist tatsächlich horizontal, also vertikale Platzierung
    let horizontal = this.mainCorridorRects[0].isHorizontal;

    if (horizontal) {
      // Outer up
      console.log("LArects: horizontal corridors");
      const lowerFullLivingArea = this.mainCorridorRects[0].edges.lowerEdge
        .spawnRectangle(this.k, new Vector2(0, -1))
        .setColor(livingAreaColor);
      // Outer down
      const upperFullLivingArea = this.mainCorridorRects[
        this.i - 1
      ].edges.upperEdge
        .spawnRectangle(this.k, new Vector2(0, 1))
        .setColor(livingAreaColor);

      this.livingAreaRects.push(upperFullLivingArea, lowerFullLivingArea);
    } else {
      console.log("LArects: vertical corridors");
      // Outer left
      const leftFullLivingArea = this.mainCorridorRects[0].edges.leftEdge
        .spawnRectangle(this.k, new Vector2(-1, 0))
        .setColor(livingAreaColor);
      // Outer right
      const rightFullLivingArea = this.mainCorridorRects[
        this.i - 1
      ].edges.rightEdge
        .spawnRectangle(this.k, new Vector2(1, 0))
        .setColor(livingAreaColor);
      this.livingAreaRects.push(leftFullLivingArea, rightFullLivingArea);
    }

    // Generate half living areas next to connectors

    // TODO: Longersidelength vs lower/rightsidelength
    // Das ist der Fehler!
    // hier muss man einfach die LAs nicht an der längeren Seite platzieren, sondern
    // wenn vertikal: an der oberen/unteren seite

    //const connectorHorizontal = this.connectorRects[0].isHorizontal;
    const laLength =
      (this.mainCorridorRects[0].longerSideLength - this.corridorWidth) / 2;

    // wenn mainCorridor vertikal, platziere an ober/unterEdge
    if (!horizontal) {
      // Collect all upper/lower Edges
      const upperEdges = this.connectorRects.flatMap((con) =>
        con.edges.upperEdge.splitEvenly(2)
      );
      const lowerEdges = this.connectorRects.flatMap((con) =>
        con.edges.lowerEdge.splitEvenly(2)
      );

      for (const ue of upperEdges) {
        this.livingAreaRects.push(
          ue
            .spawnRectangle(laLength, new Vector2(0, 1))
            .setColor(livingAreaColor)
        );
      }
      for (const le of lowerEdges) {
        this.livingAreaRects.push(
          le
            .spawnRectangle(laLength, new Vector2(0, -1))
            .setColor(livingAreaColor)
        );
      }
    } else {
      // wenn mainCorridor horiziontal, platzieren an left/rightedge
      // Collect all left/right edges
      const leftEdges = this.connectorRects.flatMap((con) =>
        con.edges.leftEdge.splitEvenly(2)
      );
      const rightEdges = this.connectorRects.flatMap((con) =>
        con.edges.rightEdge.splitEvenly(2)
      );
      for (const le of leftEdges) {
        this.livingAreaRects.push(
          le
            .spawnRectangle(laLength, new Vector2(-1, 0))
            .setColor(livingAreaColor)
        );
      }
      for (const re of rightEdges) {
        this.livingAreaRects.push(
          re
            .spawnRectangle(laLength, new Vector2(1, 0))
            .setColor(livingAreaColor)
        );
      }
    }

    console.log("laRects:  ", this.livingAreaRects);

    return this;
    // Generate half height/width living areas next to connectors
  }
  // TODO: Extract method for generating living area rects
  // TODO: Extract method for filling living area rects with n apartments
  //

  /**
   * Divides the living areas in n total Apartments
   *
   * @param {} n
   */

  // TODO: check this with the max amount of apartments /thresholds per specified i
  // the n specified here can't be higher than the current i's upper threshold

  // TODO: Can this handle one Corridor?!?!?

  // TODO: Auch mit max machen.
  fillLivingAreasWithApartments(n, minApWidth, maxApWidth) {
    // Generate splits  for livingAreaRects
    this.apartmentRects = [];
    console.log("> fillLivingAreasWithRooms");

    if (this.livingAreaRects == undefined) {
      console.error("fillLivingAreasWithRooms error: no living areas present!");
      return;
    }

    if (this.livingAreaRects.length == 1) {
      // one living Area: one apartment
      console.log("1 living area: 1 room");
      this.apartmentRects.push(this.houseRect);
      return this;
    }
    // Divide n over all livingAreas
    // Does only calculate how many apartments are present for each living Area

    //

    let livingAreaSplits;

    // if maxWidth given, so special N Divisions

    // Split LA's horizontally, if corridors are horizontally
    // Split LA's vertically, if corridors are vertically

    // If Corridors are aligned horizontally, split the LAs horizontally
    let splitHorizontally = this.mainCorridorRects[0].isHorizontal;
    if (maxApWidth) {
      console.log("do fillings n-Splitting considering MIN MAX");

      // Wenn Korridor horizontal, ist corridorPlacement vertikal!
      // Dann müssen die LA's horizontal gesplittet werden. - Also entlang der Lowerside
      livingAreaSplits = this.houseCalc.calculateRandomNDivisionsMinMax(
        this.livingAreaRects,
        n,
        minApWidth,
        maxApWidth,
        splitHorizontally
      );
    } else {
      console.log("do fillings n-Splitting only considering MIN");
      livingAreaSplits = this.houseCalc.calculateRandomNDivisions(
        this.livingAreaRects,
        n,
        minApWidth
      );
    }

    console.log("Random Living area Splits: ", livingAreaSplits);
    console.log(
      "sum: ",
      livingAreaSplits.reduce((acc, val) => acc + val, 0)
    );

    this.livingAreaRects.forEach((laRect, index) => {
      // split each LA randomly min max WIDTH oriented into corresponding n apartments
      // push to apartments
      // console.log("split ", laRect, " into ", livingAreaSplits[index]);

      // Hier die Orientation rein, in die die LAs gesplittet werden sollen.
      this.apartmentRects.push(
        ...laRect.splitRandomlyMinMaxWidthOriented(
          livingAreaSplits[index],
          minApWidth,
          maxApWidth,
          splitHorizontally
        )
      );
    });

    this.recolorApartments();
    // console.log(this.apartmentRects);

    return this;
  }

  fillLivingAreasWithApartmentsEvenly(n, minApWidth, maxApWidth) {
    // Generate splits  for livingAreaRects
    this.apartmentRects = [];
    console.log("> fillLivingAreasWithAps evenly");

    if (this.livingAreaRects == undefined) {
      console.error("fillLivingAreasWithRooms error: no living areas present!");
      return;
    }

    if (this.livingAreaRects.length == 1) {
      // one living Area: one apartment
      console.log("1 living area: 1 room");
      this.apartmentRects.push(this.houseRect);
      return this;
    }
    // Divide n over all livingAreas
    // Does only calculate how many apartments are present for each living Area

    //TODO: implement Even N Divisions

    let splitHorizontally = this.mainCorridorRects[0].isHorizontal;

    // Calculate the Splits for each living area
    let livingAreaSplits;
    if (maxApWidth) {
      console.log(" split n evenly MINMAX");
      livingAreaSplits = this.houseCalc.calculateEvenNDivisionsMinMax(
        this.livingAreaRects,
        n,
        minApWidth,
        maxApWidth,
        splitHorizontally
      );
    } else {
      console.log(" split n evenly regular");
      livingAreaSplits = this.houseCalc.calculateEvenNDivisions(
        this.livingAreaRects,
        n,
        minApWidth
      );
    }

    console.log("Even Living area Splits: ", livingAreaSplits);
    console.log(
      "sum: ",
      livingAreaSplits.reduce((acc, val) => acc + val, 0)
    );

    this.livingAreaRects.forEach((laRect, index) => {
      this.apartmentRects.push(
        ...laRect.splitEvenlyOriented(
          livingAreaSplits[index],
          splitHorizontally
        )
      );
    });

    // Recolor for better visibility!

    this.recolorApartments();

    //console.log(this.apartmentRects);

    return this;
  }

  recolorApartments() {
    let i = 0;
    for (let rect of this.apartmentRects) {
      rect.changeColor(this.apartmentColors[i]);
      i++;

      if (i > this.apartmentColors.length - 1) i = 0;
    }
  }

  /**
   * Fills the Apartment rects with sub-Rectangles generated through STM
   * Rooms are accessible through roomRects
   */

  //TODO: Der Bums wird irgendwie immer an dieselbe Stelle generiert1
  // Deshalb sieht's immer so aus als ob
  fillApartmentsWithSTMRooms(roomN, roomMinPercentage, roomMaxPercentage) {
    console.log("> Rect-STM for apartmentRects:  ", this.apartmentRects);
    let counter = 0;
    let number = 2;
    //TODO: Irgendwie macht der nur eins richtig

    // TODO: alle einzeln ausprobieren, dann checken
    //console.log("> STMRooms for Apartment ", number);

    let rooms = this.apartmentRects[number].splitSTMMinMax(
      roomN,
      roomMinPercentage,
      roomMaxPercentage
    );

    this.roomRects = rooms;

    //TODO: Remove
    //return this;

    for (let apartmentRect of this.apartmentRects) {
      console.log("STMing Apartment no. ", counter);
      let rooms = apartmentRect.splitSTMMinMax(
        roomN,
        roomMinPercentage,
        roomMaxPercentage
      );
      this.roomRects = this.roomRects.concat(rooms);
      this.totalRects = this.totalRects.concat(rooms);
      counter++;
    }

    return this;
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

  // TODO: Legacy method
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

  // Alter STM versuch..
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

  /**
   * Alle Rects löschen
   */
  resetRects() {
    this.totalRects = [];
    this.apartmentRects = [];
    this.roomRects = [];
    this.mainCorridorRects = [];
    this.connectorRects = [];
    this.livingAreaRects = [];
  }
}

export default House;
