import * as THREE from "three";
import Edge from "./Edge";
import Rectangle from "./Rectangle";
import { Vector2, VertexColorNode } from "three/webgpu";
import Apartment from "./Apartment";
import House from "./House";
import HouseCalculator from "./HouseCalculator";
import { render } from "react-dom";
import InputChecker from "./InputChecker";

class Tests {
  constructor(rendering) {
    // Type unknown, so no info on rendering
    this.rendering = rendering;
    this.isRandom = false;

    // Keep house instance the same!
    this.testHouse = new House();
  }

  testTests() {
    console.log("Tests work!");
  }

  testRendering() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff6347,
      wireframe: true,
    });
    const geometry2 = new THREE.BoxGeometry(4, 4, 4);
    const cube = new THREE.Mesh(geometry2, material);
    cube.position.set(0, 20, 0);
    cube.add(new THREE.AxesHelper(5));

    this.cube = cube;
    this.rendering.addToScene(cube);
  }

  testVectors() {
    console.log("Vector tests");
    let vec = new THREE.Vector2(0, 0);
    let vec2 = new THREE.Vector2(5, 5);

    // Rückwirkend geänderte Werte in logs?
    console.log("v1", vec);
    console.log("v2", vec2);

    let vec3 = vec.addScaledVector(vec2, 0.1);

    console.log("vec3", vec3);
    console.log("vec1 new? ", vec);

    let vec4 = new THREE.Vector2(10, 0);
    let vec5 = new THREE.Vector2(15, 0);

    console.log("vec4", vec4, "vec5", vec5);

    let vec6 = new THREE.Vector2();

    // Direction
    vec6.subVectors(vec5, vec4);

    console.log(" v6 = direction: ", vec6);
  }

  testEdges() {
    console.log("Edge tests");
    let edge = new Edge(new THREE.Vector2(0, 0), new THREE.Vector2(0, 5));
    console.log("Edge length", edge.length);

    let invEdge = new Edge(new THREE.Vector2(0, 5), new THREE.Vector2(0, 0));
    console.log("Inv Edge length", invEdge.length);

    let negEdge = new Edge(new THREE.Vector2(5, 0), new THREE.Vector2(2, 8));
    console.log("negEdge length", negEdge.length);

    console.log("Edge even subedges");

    let edgeToSplit = new Edge(
      new THREE.Vector2(15, 20),
      new THREE.Vector2(2, 4)
    );
    console.log("Edge to split:");
    edgeToSplit.printEdge();

    console.log("Edge to split:", edgeToSplit, "New Edges through splitting:");
    let subedges = edgeToSplit.splitEvenly(5);

    for (let e of subedges) {
      e.printEdge();
      this.rendering.addToScene(
        this.rendering.generateMeshFromVertices(e.vertices, e.material)
      );
      // shit hello
    }

    let edgeToSplit2 = new Edge(
      new THREE.Vector2(5, 5),
      new THREE.Vector2(2, 1)
    );
    console.log(
      "Edge subedges by length of ",
      edgeToSplit2,
      "new Edges through length splitting"
    );
    let subedges2 = edgeToSplit2.splitByLength(edgeToSplit2.length / 3);

    for (let e of subedges2) {
      e.printEdge();
    }

    let edgeToSplit3 = new Edge(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 10)
    );
    console.log(
      "Edge subedges by parts of ",
      edgeToSplit3,
      "new Edges through parts splitting"
    );
    let subedges3 = edgeToSplit3.splitIntoParts([2, 3, 2, 1, 2]);
    for (let e of subedges3) {
      e.printEdge();
      console.log("=", e.length);
    }
  }

  testEdgeRectSpawn() {
    let mainColor = new THREE.Color(255, 0, 0);
    let newColor = new THREE.Color(0, 255, 0);
    let rect = new Rectangle().fromCoords(10, 5, 10, 10).setColor(mainColor);

    let newRectLeft = rect.edges.leftEdge
      .spawnRectangle(5, new Vector2(-1, 0))
      .setColor(newColor);

    let newRectRight = rect.edges.rightEdge
      .spawnRectangle(5, new Vector2(1, 0))
      .setColor(newColor);

    let newRectTop = rect.edges.upperEdge
      .spawnRectangle(5, new Vector2(0, 1))
      .setColor(newColor);

    let newRectBottom = rect.edges.lowerEdge
      .spawnRectangle(5, new Vector2(0, -1))
      .setColor(newColor);

    let rects = [rect, newRectLeft, newRectRight, newRectTop, newRectBottom];

    for (let r of rects) {
      console.log(r);
    }

    this.rendering.addAllToScene(rects.map((r) => r.generateShapeMesh()));
  }

  testRectangles() {
    let rect = new Rectangle().fromCoords(10, 10, 0, 0);
    console.log("new rect vertices values");
    console.log(
      "ul: ",
      rect.vertices.upperLeft,
      "ur: ",
      rect.vertices.upperRight,
      "lr",
      rect.vertices.lowerRight,
      "ll",
      rect.vertices.lowerLeft
    );

    // Make rect visible
    let rectmesh = this.rendering.generateMeshFromVertices(rect.vertices);
    //this.rendering.addToScene(rectmesh);

    //console.log(rect.color)
    //let phelper = rect.getPointHelperMesh();

    // Create new Rect from Vector2[]

    let rect2 = new Rectangle().fromVertices([
      new Vector2(-5, 5),
      new Vector2(5, 5),
      new Vector2(5, -5),
      new Vector2(-5, -5),
    ]);
    console.log("BZZZZZZ");
    console.log(
      "ul: ",
      rect2.vertices.upperLeft,
      "ur: ",
      rect2.vertices.upperRight,
      "lr",
      rect2.vertices.lowerRight,
      "ll",
      rect2.vertices.lowerLeft
    );

    let rect2mesh = this.rendering.generateMeshFromVertices(rect2.vertices);

    //this.rendering.addToScene(rect2mesh);
    // Edge meshing geht nicht mit shape!
    // TODO: Schauen, warum die mesh-Generierung bei Apartment klappt aber bei Rectangle nicht, und bei Rendering
    // erst recht nicht

    // Rect from Vertices
    console.log("Now from Object");

    let vertsObject = {
      upperLeft: new Vector2(-5, 5),
      upperRight: new Vector2(10, 5),
      lowerRight: new Vector2(10, -5),
      lowerLeft: new Vector2(-5, -5),
    };

    let vertsObjectVertical = {
      upperLeft: new Vector2(-5, 10),
      upperRight: new Vector2(5, 10),
      lowerRight: new Vector2(5, -10),
      lowerLeft: new Vector2(-5, -10),
    };
    let rect3 = new Rectangle().fromVertices(vertsObject);
    let rect3mesh = this.rendering.generateMeshFromVertices(
      rect3.vertices,
      rect3.material
    );
    //this.rendering.addToScene(rect3mesh);

    // Test rect splitting on rect3
    let splitRects = rect3.splitEvenlyOriented(6);
    console.log("Splitted rects:", splitRects);

    for (rect of splitRects) {
      // this.rendering.addToScene(this.rendering.generateMeshFromVertices(rect.vertices, rect.material));
    }

    // TODO: Test with higher-than-wide recta

    // Test random rect splitting

    // Failing min:

    let r4w = 5;
    let r4h = 10;
    let rect4 = new Rectangle().fromCoords(r4w, r4h, 0, 0);

    // Failing min:
    rect4.splitRandomlyMinMaxSizeOriented(5, 12, 15);

    //Failing max:
    rect4.splitRandomlyMinMaxSizeOriented(5, 5, 8);

    //Correct splitting:
    console.log("----splitRandomlyMinMaxOriented");
    let splits = rect4.splitRandomlyMinMaxSizeOriented(5, 5, 15);

    console.log("Split sizes: ", splits);

    let splitSum = 0;

    for (let s of splits) {
      splitSum += s._area;
    }

    console.log("Splitsum ", splitSum, " should be", r4h * r4w);
    console.log("Visualise Random Splitting ");

    for (let rect of splits) {
      this.rendering.addToScene(
        this.rendering.generateMeshFromVertices(rect.vertices, rect.material)
      );
    }
  }

  testRectangleColors() {
    // Warum checkt der das nicht, wenn 3 Farben angegeben werden?

    let rect1 = new Rectangle().fromCoords(5, 5, 0, 0);
    //  .setColor(new THREE.Color(0xff0efe));
    //.setColor(new THREE.Color(255, 255, 22));

    rect1.setColor(0xffff00);
    console.log(rect1.generateShapeMesh());
    this.rendering.addToScene(rect1.generateShapeMesh());
  }
  testRectangleHelpers() {
    const vertsObject = {
      upperLeft: new Vector2(-5, 5),
      upperRight: new Vector2(10, 5),
      lowerRight: new Vector2(10, -5),
      lowerLeft: new Vector2(-5, -5),
    };
    const rect = new Rectangle().fromVertices(vertsObject);
    const rectmesh = rect.generateShapeMesh();

    this.rendering.addToScene(rectmesh);

    const pointHelper = rect.getPointHelperMesh();
    this.rendering.addToScene(pointHelper);

    const verticeHelpers = rect.getVerticesPointHelperMeshes();

    this.rendering.addAllToScene(verticeHelpers);
  }

  testRectangleSTMSplitting() {
    const vertsObject = {
      upperLeft: new Vector2(0, 10),
      upperRight: new Vector2(15, 10),
      lowerRight: new Vector2(15, 0),
      lowerLeft: new Vector2(0, 0),
    };
    const rect = new Rectangle().fromVertices(vertsObject);
    console.log(
      "Rect upperedge: ",
      rect.edges.upperEdge.length,
      "rect rightEdge: ",
      rect.edges.rightEdge.length
    );

    const rectmesh = rect.generateShapeMesh();
    // x: red y: green z: blue
    rectmesh.add(new THREE.AxesHelper(5));
    this.rendering.addToScene(rectmesh);

    const verticeHelpers = rect.getVerticesPointHelperMeshes();
    this.rendering.addAllToScene(verticeHelpers);

    // Returns apartments, should return rects
    let subrects = rect.splitSTMMinMax(5, 0.1, 0.4);
    let roomMeshes = [];
    for (let s of subrects) {
      roomMeshes.push(s.generateShapeMesh());
    }

    console.log("STM APARMTENT MESHES", roomMeshes);
    this.rendering.addAllToScene(roomMeshes);

    //TODO: Call STM Split method
  }

  testRectangleRandomWidthSplitting() {
    let rect = new Rectangle().fromCoords(20, 10, 0, 0);
    let subRects = rect.splitRandomlyMinMaxWidthOriented(5, 3);

    this.rendering.addAllToScene([
      rect.generateShapeMesh(),
      ...subRects.flatMap((rect) => rect.generateShapeMesh()),
    ]);
  }

  testHouses(n, corridorWidth) {
    console.log("House test with ", n, "apartments");
    //let houseRects = new House(80, null, null, null, null).simpleICorridor(2, 8) || [];

    let house = new House(80, null, null, null, null).randomizedICorridor(
      n,
      corridorWidth
    );

    // STM requires apartmentSizes, which requires house parameters: n, minSize, maxSize
    // let house1 = new House(80,null,8,8,12);
    // house1.generateRandomApartmentSizes();
    // house1.squarifiedTreeMap();

    console.log("house", house, "houserects", house.totalRects);

    //return;
    // Rendering works by converting each house rectangle to a mesh
    // the main house rectangle is not rendered

    // now only render rooms and corridor, not apartments
    for (let rect of house.mainCorridorRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }

    for (let rect of house.apartmentRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }
  }

  testHouseWithSTMRooms(n, corridorWidth) {
    console.log("House test with ", n, "apartments");
    //let houseRects = new House(80, null, null, null, null).simpleICorridor(2, 8) || [];

    let house = new House(80, null, null, null, null).randomizedICorridor(
      n,
      corridorWidth
    );
    //   .fillApartmentsWithSTMRooms(5, 0.2, 0.4);

    // STM requires apartmentSizes, which requires house parameters: n, minSize, maxSize
    // let house1 = new House(80,null,8,8,12);
    // house1.generateRandomApartmentSizes();
    // house1.squarifiedTreeMap();

    // console.log("house", house, "houserects", house.totalRects);

    //return;
    // Rendering works by converting each house rectangle to a mesh
    // the main house rectangle is not rendered
    for (let rect of house.apartmentRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }

    for (let rect of house.roomRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }
    for (let rect of house.mainCorridorRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }
  }

  testHouseCalculator(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth
  ) {
    const houseCalc = HouseCalculator.getInstance();

    let maxCorridors = houseCalc.calculateMaxCorridors(
      houseWidth,
      corridorWidth,
      minApartmentWidth
    );

    console.log(
      "maxCorridors for hw ",
      houseWidth,
      " hh ",
      houseHeight,
      " cw ",
      corridorWidth,
      " minApW ",
      minApartmentWidth
    );
    console.log(">>", maxCorridors);

    return;
    //length, i, corridorWidth

    // Test with house Width, maxI and
    let k = houseCalc.calculateK(houseWidth, maxCorridors, corridorWidth);

    console.log("k for ", maxCorridors, " corridors: ", k);

    let maxApsAbsolute = houseCalc.calculateMaxAparmentsAbsolute(
      houseWidth,
      houseHeight,
      corridorWidth,
      minApartmentWidth
    );

    console.log(
      "Max Aps for house of width ",
      houseWidth,
      " height ",
      houseHeight,
      " width corridor width of ",
      corridorWidth,
      " and min apartment width of ",
      minApartmentWidth
    );
    console.log(">>>", maxApsAbsolute, "<<<");

    console.log("testing Thresholds: ");

    for (let i = maxCorridors; i > 0; i--) {
      console.log(
        "Max Aps for ",
        i,
        " corridors: ",
        houseCalc.calculateMaxAparments(
          houseWidth,
          houseHeight,
          corridorWidth,
          minApartmentWidth,
          i
        )
      );
    }

    console.log("Testing random n division");

    let minWidth = 3;
    let testLArects = [
      new Rectangle().fromCoords(15, minWidth, 0, 0),
      new Rectangle().fromCoords(15, minWidth, 0, 0),
      new Rectangle().fromCoords(8, minWidth, 0, 0),
      new Rectangle().fromCoords(8, minWidth, 0, 0),
      new Rectangle().fromCoords(8, minWidth, 0, 0),
      new Rectangle().fromCoords(8, minWidth, 0, 0),
    ];

    houseCalc.calculateRandomNDivisions(testLArects, 15, minWidth);
  }

  // Passt soweit erstmal Kollegen
  testHouseDefinedShape(houseWidth, houseHeight) {
    let house = new House(
      houseWidth * houseHeight,
      null,
      null,
      houseWidth,
      houseHeight,
      null,
      null
    );

    this.rendering.addToScene(house.getHouseMesh());
  }

  testMultiCorridorHouse(
    houseWidth,
    houseHeight,
    corridorWidth,
    corridorCount
  ) {
    // Get house with defined house shape by passing  house width and height
    // then generate multi corridors

    console.log("> testMultiCorridorHouse");
    let house = new House(
      houseWidth * houseHeight,
      null,
      null,
      houseWidth,
      houseHeight,
      null,
      null
    );

    // TODO: Da funzt irgendwas mit der Platzierung nicht gescheid.
    // Richtige Anzahl an Korridoren passt aber!

    let houseCorridorRects = house.multiCorridorLayout(
      corridorWidth,
      corridorCount
    ).mainCorridorRects;

    console.log("multi corridor rects:", houseCorridorRects);
    this.rendering.addToScene(house.getHouseMesh());

    for (let rect of houseCorridorRects) {
      this.rendering.addToScene(rect.generateShapeMesh());
    }
  }

  testLivingAreaGeneration(
    houseWidth,
    houseHeight,
    corridorWidth,
    corridorCount
  ) {
    let house = new House(
      houseWidth * houseHeight,
      null,
      null,
      houseWidth,
      houseHeight,
      null,
      null
    )
      .multiCorridorLayout(corridorWidth, corridorCount)
      //.randomizedICorridor(6, corridorWidth)
      .generateLivingAreaRects();

    //console.log("House with living area rects", house);

    //return;
    let houseCorridorRects = house.mainCorridorRects;
    let houseConnectorRects = house.connectorRects;
    let houseApartmentRects = house.apartmentRects;
    let houseLARects = house.livingAreaRects;

    console.log(
      "CRECTS",
      houseCorridorRects,
      "houseConnectorRects",
      houseConnectorRects,
      "HLARECTS",
      houseLARects,
      "APRECTS",
      houseApartmentRects
    );

    this.rendering.addAllToScene(
      houseCorridorRects
        .concat(houseLARects)
        .concat(houseConnectorRects)
        .map((r) => r.generateShapeMesh())
    );
  }

  testLivingAreaApartmentFilling(
    houseWidth,
    houseHeight,
    corridorWidth,
    corridorCount,
    n
  ) {
    console.log("------ Test livingAreaApartmentFilling");
    let house = new House()
      .definedHouseShape(houseWidth, houseHeight)
      .multiCorridorLayout(corridorWidth, corridorCount)
      .generateLivingAreaRects()
      .fillLivingAreasWithApartments(n, 3);

    console.log("Testhouse", house);

    return;
    this.rendering.addAllToScene([
      ...house.mainCorridorRects.flatMap((mcr) => mcr.generateShapeMesh()),
      ...house.connectorRects.flatMap((cr) => cr.generateShapeMesh()),
      ...house.livingAreaRects.flatMap((la) => la.generateShapeMesh()),
      ...house.apartmentRects.flatMap((ap) => ap.generateShapeMesh()),
    ]);
  }

  // TODO: Check Input Datatypes.
  // Den shit hats nämlich seit den InputField-Inputs zerrupft und da stehen Strings drinnen und keine numbers
  // TODO: Apply "isRandom"-Flag.
  // if isRandom: normal machen.
  // if !isRandom: nonRandomAdaptive
  testAdaptiveMultiCorridorLayout(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApWidth,
    n
  ) {
    console.log(">testAdaptiveMultiCorridorLayout");

    console.log("Removed all previous per scene");
    this.rendering.clearScene();
    // remove all from scene!

    let house = new House()
      .definedHouseShape(houseWidth, houseHeight)
      .adaptiveMultiCorridorLayout(corridorWidth, minApWidth, n)
      .generateLivingAreaRects()
      .fillLivingAreasWithApartments(n, minApWidth);

    console.log("adaptive corr house: ", house);

    //return;
    this.rendering.addAllToScene([
      house.houseRect.generateShapeMesh(),
      ...house.mainCorridorRects.flatMap((mcr) => mcr.generateShapeMesh()),
      ...house.connectorRects.flatMap((cr) => cr.generateShapeMesh()),
      /*...house.livingAreaRects.flatMap((la) =>
        la.shapeAndVerticesPointHelperMesh()
      ),*/
      //...house.livingAreaRects.flatMap((la) => la.generateShapeMesh()),
      ...house.apartmentRects.flatMap((ar) => ar.generateShapeMesh()),
    ]);
  }

  testMinMaxAdaptiveMultiCorridorLayout(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApWidth,
    maxApWidth,
    n
  ) {
    // TODO: Keep house instance. Only redo .definedHouse if width/height/ changed
    // Only redo generateThresholds when cw, minapw, maxapw changed.
    let house = new House()
      .definedHouseShape(houseWidth, houseHeight)
      .generateThresholds(corridorWidth, minApWidth, maxApWidth)
      .adaptiveMinMaxMultiCorridorLayout(
        corridorWidth,
        minApWidth,
        maxApWidth,
        n
      )
      .generateLivingAreaRects()
      // unevenly!
      .fillLivingAreasWithApartments(n, minApWidth, maxApWidth);

    console.log("generated test house", house);
    this.rendering.clearScene();
    //return;
    this.rendering.addAllToScene([
      //house.houseRect.generateShapeMesh(),
      ...house.mainCorridorRects.flatMap((mcr) => mcr.generateShapeMesh()),
      ...house.connectorRects.flatMap((cr) => cr.generateShapeMesh()),
      /* ...house.livingAreaRects.flatMap((la) =>
          la.shapeAndVerticesPointHelperMesh()
        ),
        */
      //
      //...house.livingAreaRects.flatMap((la) => la.generateShapeMesh()),
      ...house.apartmentRects.flatMap((ar) => ar.generateShapeMesh()),
    ]);
  }

  testNonrandomMinMaxAdaptiveMultiCorridorLayout(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApWidth,
    maxApWidth,
    n
  ) {
    // TODO: Keep house instance. Only redo .definedHouse if width/height/ changed
    // Only redo generateThresholds when cw, minapw, maxapw changed.

    // Was geht ab? Alle Parameter annehmen!
    // Dann Grundfläche(width,height) -> Thresholds: wie viele Aps min/max pro Layout (width,height,cw,min,max)
    // -> adaptiveCorridorlayout (cw, min, max, n) -> Living Areas -> Apartments(n, min, max)

    let house = new House()
      .definedHouseShape(houseWidth, houseHeight)
      .generateThresholds(corridorWidth, minApWidth, maxApWidth)
      .adaptiveMinMaxMultiCorridorLayout(
        corridorWidth,
        minApWidth,
        maxApWidth,
        n
      ); //

    if (house == null) {
      console.log("No House Produced, so no filling etc.!");
      // TODO: Zeig das irgendwie an oder so!
      return;
    }

    house
      .generateLivingAreaRects()
      .fillLivingAreasWithApartmentsEvenly(n, minApWidth, maxApWidth);
    console.log("generated test house", house);
    this.rendering.clearScene();
    this.rendering.addAllToScene([
      //house.houseRect.generateShapeMesh(),
      ...house.mainCorridorRects.flatMap((mcr) => mcr.generateShapeMesh()),
      ...house.connectorRects.flatMap((cr) => cr.generateShapeMesh()),
      /* ...house.livingAreaRects.flatMap((la) =>
            la.shapeAndVerticesPointHelperMesh()
          ),
          */
      //
      //...house.livingAreaRects.flatMap((la) => la.generateShapeMesh()),
      ...house.apartmentRects.flatMap((ar) => ar.generateShapeMesh()),
    ]);
  }
  // TODO: Den Shit von hier in ThreeCanvas direkt bringen und ausführen!
  // Der kann dann z.B. auch das House behalten und bei Änderungen von n nur die Corridors/Apartments neu generieren!

  testNonrandomAdaptiveMultiCorridorLayout(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApWidth,
    n
  ) {
    console.log(">testAdaptiveMultiCorridorLayout");

    console.log("Removed all previous per scene");
    this.rendering.clearScene();
    // remove all from scene!

    let house = new House()
      .definedHouseShape(houseWidth, houseHeight)
      .adaptiveMultiCorridorLayout(corridorWidth, minApWidth, n);
    if (house == null) {
      console.log("No House Produced, so no filling etc.!");
      return;
      // TODO: Zeig das irgendwie an oder so!
    }

    house
      .generateLivingAreaRects()
      .fillLivingAreasWithApartmentsEvenly(n, minApWidth);
    //.fillLivingAreasWithApartments(n, minApWidth);

    // Funktioniert auch beides nachträglich! Man kann also auch die Aps neu generieren!

    console.log("adaptive corr house: ", house);

    // Testing houseCalc even n Divisons

    //return;
    this.rendering.addAllToScene([
      //house.houseRect.generateShapeMesh(),
      ...house.mainCorridorRects.flatMap((mcr) => mcr.generateShapeMesh()),
      ...house.connectorRects.flatMap((cr) => cr.generateShapeMesh()),
      /* ...house.livingAreaRects.flatMap((la) =>
        la.shapeAndVerticesPointHelperMesh()
      ),
      */
      //...house.livingAreaRects.flatMap((la) => la.generateShapeMesh()),
      ...house.apartmentRects.flatMap((ar) => ar.generateShapeMesh()),
    ]);
  }

  // Passt!
  testNewHouseConstructor(houseWidth, houseHeight) {
    let house = new House().definedHouseShape(houseWidth, houseHeight);

    this.rendering.addToScene(house.houseRect.generateShapeMesh());
    console.log("House: ", house);
  }

  /** Test calc stuff related to providing a max width of apartments  */

  testHouseCalcMaxApWidth() {
    // Test for the example of 40 x 30, cw 1, min 5, max 10 which has a manually calculated solution

    console.log("pop");
    let houseWidth = 40;
    let houseHeight = 30;
    let corridorWidth = 1;
    let minApartmentWidth = 5;
    let maxApartmentWidth = 10;

    let testRect = new Rectangle().fromCoords(houseHeight, houseWidth, 0, 0);

    let houseCalc = HouseCalculator.getInstance();

    // Passt!
    /*
    let res = houseCalc.calculateMinCorridorsOriented(
      testRect.shorterSideLength,
      corridorWidth,
      maxApartmentWidth
    );
    */

    let thresholds = houseCalc.calculateMinMaxCorridorThresholds(
      houseWidth,
      houseHeight,
      corridorWidth,
      minApartmentWidth,
      maxApartmentWidth
    );

    console.log(">>>> THRESHODELS", thresholds);

    // Test min amount of corridors to keep k small enough so maxwidth fits in
    //...
  }

  testCalcMaxAps(width, height, corr, minAp) {}

  unitTests() {
    // Test multiple times with random parameters if those are sufficiently processed.

    // Test for:
    // width/height
    // corridorWidth
    // min/maxApWidth
    // n

    let inputChecker = new InputChecker();

    // 1. Create new House with completely random w/h, boundary random cW, boundary random minWidth/maxWidth, boundary random N

    // do Random w/h, at least 1
    let width = Math.ceil(Math.random() * 40);
    let height = Math.ceil(Math.random() * 40);

    // do Random corridorWidth based on width/height
    // at least 1
    // ist die kleinere Seite des houseRects und
    // NICHT die kleinere Seite eines LA Rects bei nem singleCorridor

    // TODO: Kann der Algo das handeln, wenn keine Thresholds kommen?
    let corridorLimit = inputChecker.getMaxCorridorWidth(width, height);

    let corridorWidth = Math.ceil(Math.random() * corridorLimit);
  }

  // TODO: unit tests that generate a whole house and tests it's properties, not just single methods!

  widthHeightUnitTest() {
    console.log(">>>>>>>>>> Width / Height unit test");
    let house = new House();

    let tests = 100;

    // Array of results: 0 if fail, 1 if ok!
    let results = [];
    // create "tests" * houses and check if the width/height is ok
    for (let i = 0; i < tests; i++) {
      // do Random w/h

      let width = Math.round(Math.random() * 40);
      let height = Math.round(Math.random() * 40);
      // get houseRect
      let houseRect = house.definedHouseShape(width, height).houseRect;

      if (houseRect._width == width && houseRect._height == height) {
        results.push(1);
      } else {
        console.log(
          "w h unit test Failed for houseRect ",
          houseRect,
          " and w/h ",
          width,
          height
        );
        results.push(0);
      }
    }

    let resultSum = results.reduce((acc, val) => acc + val, 0);
    console.log("Tests successful: ", resultSum, " / ", tests);
  }

  corridorWidthUnitTest() {
    let tests = 100;

    // Array of results: 0 if fail, 1 if ok!
    let results = [];
    // create "tests" * houses and check if the width/height is ok
    for (let i = 0; i < tests; i++) {
      // do Random w/h
      let width = Math.round(Math.random() * 40);
      let height = Math.round(Math.random() * 40);

      // do Random corridorWidh within
    }
  }

  apartmentWidthUnitTest() {}

  nUnitTest() {}

  /**
   * Setter for the "isRandom" Flag
   */
  setIsRandom(value) {
    this.isRandom = value;
  }
}

export default Tests;
