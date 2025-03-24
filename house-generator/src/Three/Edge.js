// Displays Edges
import * as THREE from 'three';
class Edge{


    constructor(v1,v2){

        this._vertices = {
            vertice1: v1,
            vertice2: v2,
        }

        this._color = new THREE.Color(Math.random(),Math.random(),Math.random());
        this._material = new THREE.MeshStandardMaterial({ color: this._color, side: THREE.DoubleSide });

    }




    // Return length float
    get length(){
        return this._vertices.vertice1.distanceTo(this._vertices.vertice2)

    }

    get material(){
        return this._material;
    
    }

    get vertices(){
        return this._vertices;
    }

/**
 * Splits the Edge evenly into n parts
 * @param {} n 
 * @returns The newly generated Edges
 */
    splitEvenly(n){

        console.log("> split Edge evenly in n edges")
        let subEdges = [];
        let direction = new THREE.Vector2();

        // Has totalLength
        direction.subVectors(this._vertices.vertice2,this._vertices.vertice1);

        let previousVertice = this._vertices.vertice1;

        
        
        // Oder: addScaledVector(direction, 1/n) - modifiziert glaub den prevVector!

        for(let i = 0; i < n; i++){
            // Per step, add 1/n of the distance vector to the initial vector

            let v1 = previousVertice.clone();

            // TODO: Do manually and round... 
            let v2 = v1.clone().addScaledVector(direction,1/n)

            subEdges.push(new Edge(v1,v2));

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
    splitByLength(len){

        console.log("> Split Edge by length ")
        let newEdges = [];
        
        if(len >= this.length){
            console.error("Invalid splitting length: too long")
            return undefined;
        }

        let direction = new THREE.Vector2();
        // Has totalLength
        direction.subVectors(this._vertices.vertice2,this._vertices.vertice1);

        let splitScale = len/this.length;

        let v1 = this._vertices.vertice1;
        let v2 = v1.clone();
        v2.addScaledVector(direction,splitScale);

        let v3 = this._vertices.vertice2;

        newEdges.push(new Edge(v1,v2));
        newEdges.push(new Edge(v2,v3));

        return newEdges;

    }

    /**
     * Split Edge into specifed parts
     * @param {Parts have to be given as percentages} parts 
     * @returns The newly generated Edges
     */
    splitIntoParts(parts){

        let subEdges = [];
        let direction = new THREE.Vector2();

        // Has totalLength
        direction.subVectors(this._vertices.vertice2,this._vertices.vertice1);

        let previousVertice = this._vertices.vertice1;

        let len = this.length;
        
        // Oder: addScaledVector(direction, 1/n) - modifiziert glaub den prevVector!

        for(let i = 0; i <parts.length ; i++){
            // Per step, add 1/n of the distance vector to the initial vector

            let v1 = previousVertice.clone();

            // TODO: Do manually and round... 
            let v2 = v1.clone().addScaledVector(direction, parts[i]/len)

            subEdges.push(new Edge(v1,v2));

            previousVertice = v2;
            
            // immer so: 0,0 - 0,1  / 0,1 - 0,2  / 
        }

        return subEdges;
    }

    /**
     * Prints the Vertices of the Edge
     */
    printEdge(){
        console.log("V1: " , this._vertices.vertice1, "V2: ", this._vertices.vertice2);
    }

}

export default Edge