import * as THREE from "three";
import Edge from "./Edge";
import Rectangle from "./Rectangle"
import { Vector2, VertexColorNode } from "three/webgpu";
import Apartment from "./Apartment";
import House from "./House";

class Tests {
    constructor(rendering) {
        this.rendering = rendering;
    }


    testRendering() {
        const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
        const geometry2 = new THREE.BoxGeometry(4, 4, 4);
        const cube = new THREE.Mesh(geometry2, material);
        cube.position.set(0, 20, 0);
        cube.add(new THREE.AxesHelper(5));

        this.cube = cube;
        this.rendering.addToScene(cube);
    }

    testVectors() {
        console.log("Vector tests")
        let vec = new THREE.Vector2(0, 0);
        let vec2 = new THREE.Vector2(5, 5);

        // Rückwirkend geänderte Werte in logs?
        console.log("v1", vec);
        console.log("v2", vec2);

        let vec3 = vec.addScaledVector(vec2, 0.1);

        console.log("vec3", vec3);
        console.log("vec1 new? ", vec)

        let vec4 = new THREE.Vector2(10, 0);
        let vec5 = new THREE.Vector2(15, 0);

        console.log("vec4", vec4, "vec5", vec5)

        let vec6 = new THREE.Vector2();

        // Direction
        vec6.subVectors(vec5, vec4);

        console.log(" v6 = direction: ", vec6)
    }

    testEdges() {
        console.log("Edge tests")
        let edge = new Edge(new THREE.Vector2(0, 0), new THREE.Vector2(0, 5));
        console.log("Edge length", edge.length)

        let invEdge = new Edge(new THREE.Vector2(0, 5), new THREE.Vector2(0, 0));
        console.log("Inv Edge length", invEdge.length)

        let negEdge = new Edge(new THREE.Vector2(5, 0), new THREE.Vector2(2, 8));
        console.log("negEdge length", negEdge.length)

        console.log("Edge even subedges")

        let edgeToSplit = new Edge(new THREE.Vector2(15, 20), new THREE.Vector2(2, 4));
        console.log("Edge to split:");
        edgeToSplit.printEdge();


        console.log("Edge to split:", edgeToSplit, "New Edges through splitting:")
        let subedges = edgeToSplit.splitEvenly(5);

        for (let e of subedges) {

            e.printEdge();
            this.rendering.addToScene(this.rendering.generateMeshFromVertices(e.vertices, e.material));
            // shit hello
        }



        let edgeToSplit2 = new Edge(new THREE.Vector2(5, 5), new THREE.Vector2(2, 1));
        console.log("Edge subedges by length of ", edgeToSplit2, "new Edges through length splitting");
        let subedges2 = edgeToSplit2.splitByLength(edgeToSplit2.length / 3);

        for (let e of subedges2) {

            e.printEdge();

        }


    }

    testRectangles() {
        let rect = new Rectangle().fromCoords(10, 10, 0, 0);
        console.log("new rect vertices values");
        console.log("ul: ", rect.vertices.upperLeft, "ur: ", rect.vertices.upperRight, "lr", rect.vertices.lowerRight, "ll", rect.vertices.lowerLeft)

        // Make rect visible
        let rectmesh = this.rendering.generateMeshFromVertices(rect.vertices);
        //this.rendering.addToScene(rectmesh);

        //console.log(rect.color)
        //let phelper = rect.getPointHelperMesh();

        // Create new Rect from Vector2[]

        let rect2 = new Rectangle().fromVertices([new Vector2(-5, 5), new Vector2(5, 5), new Vector2(5, -5), new Vector2(-5, -5)]);
        console.log("BZZZZZZ")
        console.log("ul: ", rect2.vertices.upperLeft, "ur: ", rect2.vertices.upperRight, "lr", rect2.vertices.lowerRight, "ll", rect2.vertices.lowerLeft)

        let rect2mesh = this.rendering.generateMeshFromVertices(rect2.vertices)

        //this.rendering.addToScene(rect2mesh);
        // Edge meshing geht nicht mit shape!
        // TODO: Schauen, warum die mesh-Generierung bei Apartment klappt aber bei Rectangle nicht, und bei Rendering 
        // erst recht nicht

        // Rect from Vertices
        console.log("Now from Object")

        let vertsObject = {
            upperLeft: new Vector2(-5, 5),
            upperRight: new Vector2(10, 5),
            lowerRight: new Vector2(10, -5),
            lowerLeft: new Vector2(-5, -5),
        }

        let vertsObjectVertical = {
            upperLeft: new Vector2(-5, 10),
            upperRight: new Vector2(5, 10),
            lowerRight: new Vector2(5, -10),
            lowerLeft: new Vector2(-5, -10),
        }
        let rect3 = new Rectangle().fromVertices(vertsObject);
        let rect3mesh = this.rendering.generateMeshFromVertices(rect3.vertices,rect3.material);
        //this.rendering.addToScene(rect3mesh);

        // Test rect splitting on rect3
        let splitRects = rect3.splitEvenlyOriented(6);
        console.log("Splitted rects:" ,splitRects)

        for (rect of splitRects){
            this.rendering.addToScene(this.rendering.generateMeshFromVertices(rect.vertices,rect.material));
        }

        // TODO: Test with higher-than-wide recta
    }


    testHouses(){
       let houseRects = new House(80,null,null,null,null).simpleICorridor(2,8) || [];
        console.log("houserects",houseRects);

        for (let rect of houseRects){
            this.rendering.addToScene(this.rendering.generateMeshFromVertices(rect.vertices,rect.material));
        }
    }
}

export default Tests