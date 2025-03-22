class Tools {


    // Private static instance to hold the singleton
    static #instance;

    // Private constructor to prevent direct instantiation
    constructor() {
        if (Tools.#instance) {
            throw new Error("You can only create one instance of Tools. Use Tools.getInstance().");
        }
        Tools.#instance = this;

        // Initialize any properties here
        this.name = "Utility Tools";
    }

    // Static method to access the singleton instance
    static getInstance() {
        if (!Tools.#instance) {
            new Tools(); // Create the instance if it doesn't exist
        }
        return Tools.#instance;
    }

    distanceBetweenTwoVertices(vertice1, vertice2) {
        var subX = vertice1.x - vertice2.x;
        var subY = vertice1.y - vertice2.y;
        return Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));
    }



    logMessage(message) {
        console.log(`[Tools]: ${message}`);
    }


}

export default Tools