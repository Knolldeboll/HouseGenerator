class Tools {
  // Private static instance to hold the singleton
  static #instance;

  // Private constructor to prevent direct instantiation
  constructor() {
    if (Tools.#instance) {
      throw new Error(
        "You can only create one instance of Tools. Use Tools.getInstance()."
      );
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

  roundTwoDigits(value) {
    //console.log("> Tools: round");
    let ret = (100 * Math.round(value)) / 100;
    //console.log("Tools: rounded", value, " to ", ret);
    return ret;
  }

  /**
   * Divide a value into n parts with random size between min and max
   * @param {number} value The value to be divided
   * @param {number} n The amount of parts to divide the value into
   * @param {number} min The minimum value of each part, as true value, not percentage
   * @param {number} max The maximum value of each part, as true value, not percentage
   * @returns An Array of the n parts of the value, each bfetween min and max
   */

  // TODO: distribution is uneven.
  // very often the first one is max, the rest is min
  // Prolly
  divideValueIntoPartsMinMax(value, n, min, max) {
    console.log("> Tools: divideValueIntoPartsMinMax", value, n, min, max);

    // Check if n* min would exceed the value or if n*max would be smaller than the value
    if (value < n * min) {
      console.error(
        "Value too small to split into n min parts. Value:",
        value,
        "n * min:",
        n * min
      );
      return null;
    }

    if (value > n * max) {
      console.error(
        "Value too large to split into n max parts. Value:",
        value,
        "n * max:",
        n * max
      );
      return null;
    }

    // Initiate a list of Parts with min values
    let parts = [];
    for (let i = 0; i < n; i++) {
      parts.push(min);
    }

    // Calculate remainder of the value that can be distributed across the parts
    let rest = value - n * min;

    // Distribute the remaining value randomly across the parts
    while (rest > 0) {
      //console.log("rest > 0", rest);
      // Iterate over every part
      for (let j = 0; j < n; j++) {
        // Check if the rest of the value is already used up
        if (rest <= 0) {
          //console.log("rest empty ", rest);
          break;
        }

        // max-p: Maximalwert für add, damit p nicht max überschreitet
        // Wenn rest kleiner, ist rest der maximalwert für add
        // eins der beiden mal random zw. 0-1

        // Maximum value to be added to the current part before it reaches the max part size
        let maxAdd = max - parts[j];

        // Calculate value between 0 and maxAdd randomly, rounded to 2 digits
        let random = Math.random() * maxAdd * 100;
        let randomRounded = Math.round(random) / 100;
        //console.log("Random rounded:", randomRounded);

        // Only add the random value if it does not exceed the remaining value (rest)
        // If so, (in the last round), add the rest instead.
        let add = Math.min(randomRounded, rest);

        parts[j] += add;

        // Round part value to 2 digits
        parts[j] = Math.round(parts[j] * 100) / 100;

        // Reduce the remaining value by the added value
        rest -= add;

        // Round rest
        rest = Math.round(rest * 100) / 100;
      }
    }

    // Return the list of n parts
    let sum = 0;
    for (let p of parts) {
      sum += p;
    }

    console.log("Tools: Sum of parts: ", sum, "vs initial value: ", value);
    console.log("Generated parts: ", parts);
    return parts;
  }
}
export default Tools;
