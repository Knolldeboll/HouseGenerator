
// Vite should automatically only import one instance of three.js

import * as THREE from 'three';
import Edge from './Edge';
import ShapeObject
    from './ShapeObject';
import Tools from './Tools';


//TODO: Getters/Setters

class Rectangle {

    constructor() {


        // Random between 0x000000 and 0xffffff
        // TODO: Fix... even though rgb have values, its white. Maybe cap to integer
        //this._color =  new THREE.Color(0xffff00);
        // Warum kommt hier immer weiße farbe?
        this._color = new THREE.Color(Math.random(), Math.random(), Math.random());

        this._material = new THREE.MeshStandardMaterial({ color: this._color, side: THREE.DoubleSide });

        this._width = undefined;
        this._height = undefined;
        this._area = undefined;
        this._pos = undefined;

        
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


    // 2nd constructors
    // Verts must be given in clockwise order, starting at upper left
    fromVertices(verts) {
        console.log("> Rectangle from verts")


        let values = verts;

        // If Object given, transform to array

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

        this._width = this._vertices.upperLeft.distanceTo(this._vertices.upperRight);
        this._height = this._vertices.upperLeft.distanceTo(this._vertices.lowerLeft);

        
        this._area = this._width * this._height;

        //console.log("Set area to " ,this._width , " x ",this._height," = ",this._area)

        // Generate Position
        let x = this._vertices.upperLeft.x + this._width / 2;
        let y = this._vertices.lowerLeft.y + this._height / 2;
        this._pos = {
            x: x,
            y: y,
        }

        // Generate Edges
        this.generateEdges();

        return this;
    }

    fromCoords(width, height, x, y) {
        console.log("> Rectangle from verts")
        this._width = width;
        this._height = height;
        this._area = this._width * this._height;
        //console.log("Set area to " ,this._width , " x ",this._height," = ",this._area)
        this._pos = {
            x: x,
            y: y,
        }

        // Generate Vertices and Edges
        this.generateVertices();
        this.generateEdges();
        return this;
    }


    /**
     * Generate the vertices from the position and height/width
     Vertice naming redefined to speaking names.  
     * 
     */ 

    generateVertices() {

        let upperLeft = new THREE.Vector2((this._pos.x - this._width / 2), (this._pos.y + this._height / 2));
        let upperRight = new THREE.Vector2((this._pos.x + this._width / 2), (this._pos.y + this._height / 2));
        let lowerRight = new THREE.Vector2((this._pos.x + this._width / 2), (this._pos.y - this._height / 2));
        let lowerLeft = new THREE.Vector2((this._pos.x - this._width / 2), (this._pos.y - this._height / 2));

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

        console.log("> Generate Edges from Vertices")
        if(this._vertices == undefined ){
            console.error("Cannot Generate Edges, vertices are not defined for this rect!");
        }

        // v1 immer links/obe
        // v2 immer rechts/unten 
        let upperEdge = new Edge(this._vertices.upperLeft, this._vertices.upperRight);
        let rightEdge = new Edge(this._vertices.upperRight, this._vertices.lowerRight);
        let lowerEdge = new Edge(this._vertices.lowerLeft, this._vertices.lowerRight);
        let leftEdge = new Edge(this._vertices.upperLeft, this._vertices.lowerLeft);

        this._edges = {
            upperEdge,
            rightEdge,
            lowerEdge,
            leftEdge,
        }
        
    }


    /**
     * Generates a ShapeMesh from the vertices of this rectangle
     * @returns 
     */
    generateShapeMesh() {
        shape = new THREE.Shape();

        const values = Object.values(this._vertices);
        // Set currentPoint to point 0 ?? 
        shape.moveTo(values[0].x, values[0].y);
        // Set lines in the Shape object
        // Problem liegt hier!


        values.slice(1).forEach(vert => {
            // console.log("line to "+  vert.x +vert.y)
            shape.lineTo(vert.x, vert.y)
        }
        )

        // Save shape
        this._shape = shape;

        geometry = new THREE.ShapeGeometry(shape);

        /*
                // Test for the shape: (so klappts!)
                this.shape.moveTo(0, 0);
                this.shape.lineTo(5, 0);
                this.shape.lineTo(2.5, 5);
                this.shape.lineTo(0, 0);
        */

        // Create ShapeGeometry from shape (will be 2D)
        this._geometry = geometry;

        mesh = new THREE.Mesh(this._geometry, this._material);
        //console.log("geometry debug:" + this.geometry.attributes.position.count);

        // Create Mesh from geometry and material
        this._mesh = mesh;

        return this._mesh;


    }


    // Split into Random Sections with area between min, max
    splitRandomlyMinMax(n, min, max){

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
  
        console.log("> Split Rectangle evenly oriented along the longer side")
        //console.log("split w / h",this.width,this.height)
        if(this._width > this._height){
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
                lowerEdgeSplits[i].vertices.vertice1
                ]

                let rect = new Rectangle().fromVertices (verts)
                newRects.push(rect);
            }


        }else{

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
                leftEdgeSplits[i].vertices.vertice2
                ]

                //console.log(verts)

                let rect = new Rectangle().fromVertices (verts)
                newRects.push(rect);
            }


        }


        return newRects;
        // Return (pieces) * new Rectangle
    }


    /**
     * Split into n randomly sized parts, each part with size between min and max
     * Oriented along the longer Edge
     * Can be used to keep AR intact by calculating the maxArea and minArea beforehand!
     * @param {*} max 
     * 
     *  */ 
    splitRandomlyMinMaxOriented(n, min, max){

        console.log("> Split Rectangle in n randomly sized splits oriented along it's longer side")
        // 1. Check if Shit is hitting the fan with the given parameters:
        if(this._area < n*min){
            console.error("rect of ",this._area, " can't be split with min ", min , " max ", max ,":")
            return;
        }
        if(this._area > n*max){
            console.error("rect of " ,this._area, "can't be split with max ", min , " max ", max ,":")
            return;
        }

        // 2. initialize all parts with min

        let parts = [];
        for(let i = 0; i < n; i++){
            parts.push(min)
        }

        //console.log("area",this._area,"n*min",n*min)


        // 3. calculate rest of the Area to this._area
        let rest = this._area - (n*min)

        // Calculate Value that can be added per part to reach max 

        // 4.
        
        while (rest > 0){
            
            for (let j = 0; j < n; j++){

                if(rest <=0){
                    //console.log("rest empty ", rest)
                    break;
                }

                // max-p: Maximalwert für add, damit p nicht max überschreitet
                // Wenn rest kleiner, ist rest der maximalwert für add
                // eins der beiden mal random zw. 0-1

                // Maximum value to be added to the part before it reaches max size
                let maxAdd = max-parts[j]

                // Round Random
                let random = Math.random()* maxAdd * 100
                let randomRounded = Math.round(random)/100
                //console.log("Random rounded:", randomRounded);

               let add = Math.min(randomRounded, rest);

                parts[j] += add;

                // Round part
                parts[j] = Math.round(parts[j]*100)/100
                
                rest -= add;

                // Round rest 
                rest = Math.round(rest * 100 )/100;

            }
         
        }

        // Ab hier parts Fertig
        // Now Create Rectangles by Edge splitting into parts, then applying the known algorithm

        // Parts is areas. 
        // Dependant on "horizontally" vs. "vertically", calculate subedge lengths from area and given height/width

  
        return this.generateSubRectsFromParts(parts);

    }


    /**
     * Generate Subrectangles from a given set of parts of one of it's edges
     * @param {} parts 
     * @returns 
     */
    generateSubRectsFromParts(parts){

        console.log("> Generate SubRects from Parts")
        let edgeParts = [];
        let newRects = [];


        if(this._width > this._height){       
           
            // Convert areas into edge length parts 
            // nur bei Random Parts nötig

            for (let p of parts){
                // Horizontal: height ist immer gleich, teile Area durch height
                edgeParts.push(p/this._height);
            }
    
           //console.log("edgeParts horizontal:",edgeParts)
            
            // upperedge splits by parts
            // loweredge splits by parts
            let upperEdgeSplits = this.edges.upperEdge.splitIntoParts(edgeParts);
            let lowerEdgeSplits= this.edges.lowerEdge.splitIntoParts(edgeParts);

            //console.log("Part Splitting: Upper edges:");
            for (let ue of upperEdgeSplits){
                //ue.printEdge();
            }
            //console.log("Part splitting lower edgle: ");
            // Pass edges into subedgesToRects Function
            for (let le of lowerEdgeSplits){
                //le.printEdge();
            }


            for (let i = 0; i < parts.length; i++) {
                // For every rect: 

                // ul, ur, lr, ll
                let verts = [
                upperEdgeSplits[i].vertices.vertice1,
                upperEdgeSplits[i].vertices.vertice2,
                lowerEdgeSplits[i].vertices.vertice2,
                lowerEdgeSplits[i].vertices.vertice1
                ]

                let rect = new Rectangle().fromVertices (verts)
                newRects.push(rect);
            }

            // Pass edges into subedgesToRects Function
        }else{

            for (let p of parts){
                // Horizontal: height ist immer gleich, teile Area durch height
                edgeParts.push(p/this._width);
            }
            //console.log("edgeParts vertical:",edgeParts)

            let leftEdgeSplits = this.edges.leftEdge.splitIntoParts(edgeParts);
            let rightEdgeSplits = this.edges.rightEdge.splitIntoParts(edgeParts);
            //console.log("Part Splitting: left edges:");
            for (let le of leftEdgeSplits){
                //le.printEdge();
            }
            //console.log("Part splitting right edgle: ");
            // Pass edges into subedgesToRects Function
            for (let re of rightEdgeSplits){
                //re.printEdge();
            }


            for (let i = 0; i < parts.length; i++) {
                // For every rect: 

                // ol, or, ur, ul
                let verts = [
                leftEdgeSplits[i].vertices.vertice1,
                rightEdgeSplits[i].vertices.vertice1,
                rightEdgeSplits[i].vertices.vertice2,
                leftEdgeSplits[i].vertices.vertice2
                ]

                //console.log(verts)

                let rect = new Rectangle().fromVertices (verts)
                newRects.push(rect);
            }



        }
        
        return newRects;
        //return parts;
    }
    // TODO: Outsource the "generate vertices" part into separate 

    generateHorizontalRectangles(parts){

    // Kann man nicht vereinen, da bei SplitEven mit den Edges gearbeitet wird 
    // und bei 
    }

    generateVerticalRectangles(parts){

    }

    // Split into n randomly sized parts, with each part not exceeding a specified aspect ratio
    splitRandomlyAspectRatioOriented(n, maxAspectRatio){
    // Calculate min and max from the given aspect Ratio, then same as above 
    }

    // areaList: List of areas that this rectangle should be divided into. 
    // Must add up to the rectangle's total area
    // orientation: if the division should be 
    divideDefined(areaList, orientation = null, divideAlongLongerSide = null) {



    }

    // JS Optional Parameters:
    // c ist optional und per default mit null belegt
    // wenn beim function call für c "unefined" angegeben wird, wird der default-Wert verwendet!  
    //
    // func(a,b,c = null)


    getPointHelperMesh() {
        // Create a small sphere geometry
        const spheregeometry = new THREE.SphereGeometry(0.1, 32, 16);
        const spherematerial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(spheregeometry, spherematerial);
        sphere.position.set(this._pos.x, this._pos.y, 0);

        return sphere;
    }
    //TODO: Vertice getters
    //TODO: Edge getters
    //TODO: Vertice adjacent edgle getters


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

    get edges() {
        return this._edges;
    }

}

export default Rectangle