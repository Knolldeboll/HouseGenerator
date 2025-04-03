import House from "./House";

class HouseCalculator {
  // Private static instance to hold the singleton
  static #instance;

  // Private constructor to prevent direct instantiation
  constructor() {
    if (HouseCalculator.#instance) {
      throw new Error(
        "You can only create one instance of HouseCalculator. Use HouseCalculator.getInstance()."
      );
    }
    HouseCalculator.#instance = this;

    // Initialize any properties here
    this.name = "House Calculator";
  }

  // Static method to access the singleton instance
  static getInstance() {
    if (!HouseCalculator.#instance) {
      new HouseCalculator(); // Create the instance if it doesn't exist
    }
    return HouseCalculator.#instance;
  }

  // TODO: Method for calculating threshold apartment counts for swapping to next i of corridors

  /**
   * Calculates k (height of the living areas) for a building when divided by i main corridors
   * @param {float} length Length of the house side PERPENDICULAR to the main corridors, usually the longer side
   * @param {integer} i The amount of corridors
   * @param {float} corridorWidth The width of the corridors
   */

  // Passt!
  calculateK(length, i, corridorWidth) {
    console.log(
      "> Calculate k for length of",
      length,
      "divided by ",
      i,
      " corridors of width ",
      corridorWidth
    );
    // k = (h-b*i)/2i
    // h = length
    // 2i = 2 living areas per corridor
    let k = (length - corridorWidth * i) / (2 * i);

    return k;
  }

  /**
   * checks how many corridors can be placed next to each other widthout lowering k below minApartmentWidth
   * tries placing along the longer side of the building
   * @param {} length Length of the house side PERPENDICULAR to the main corridors, usually the longer side
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   */
  calculateMaxCorridors(length, corridorWidth, minApartmentWidth) {
    // return imax
    console.log(
      "> calculate Max Corridors for length ",
      length,
      " corridirwidth ",
      corridorWidth,
      " minApWidth ",
      minApartmentWidth
    );

    // Formula of k solved for maximum i under the condition k >= minApartmentWidth
    let imax = Math.floor(length / (corridorWidth + 2 * minApartmentWidth));
    console.log("Max Corridors: ", imax);
    return imax;
  }

  /**
   * Calculates the max amount of Apartments, which will be close to minimal size
   * for the given corridor layout (amount of corridors placed along the longer side of the poop)
   * @param {float} houseWidth
   * @param {float} houseHeight
   * @param {float} corridorWidth
   * @param {float} minApartmentWidth
   * @param {int} corridorCount The amount of corridors to be used, not necessarily the max amount of corridors
   * @returns
   */

  // TODO: when Corridor = 1, treat it as "placed along the shorter side"
  // TODO better: always calculate for placelement along the longer AND shorter side and return the max amount for
  // the direction!
  // TODO: also notify (return?) the caller of the placement direction of the corridors!
  calculateMaxAparments(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth,
    corridorCount
  ) {
    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let shorterSide = houseWidth > houseHeight ? houseHeight : houseWidth;
    console.log(
      "> Calc max Apartment Size, longer side",
      longerSide,
      " shorter side",
      shorterSide
    );

    // 2. calculate max amount of apartments that fit in this corridor layout
    // 2.1 calc max amount of aps per whole living area
    let maxApartmentsWholeLivingArea = Math.floor(
      shorterSide / minApartmentWidth
    );
    // 2.2 calc max amount of aps per half living area
    let maxApartmentsHalfLivingArea = Math.floor(
      ((shorterSide - corridorWidth) * 0.5) / minApartmentWidth
    );

    // Calculate the amount of half living areas, which is dependent of the
    // Hii hii
    let halfLivingAreaCount = (corridorCount - 1) * 2;

    return (
      2 * maxApartmentsWholeLivingArea +
      halfLivingAreaCount * maxApartmentsHalfLivingArea
    );
  }
}
export default HouseCalculator;
