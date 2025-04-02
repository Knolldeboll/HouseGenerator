import House from "./House";

class HouseCalculator {
  constructor() {}

  // TODO: Method for calculating threshold apartment counts for swapping to next i of corridors

  /**
   * checks how many corridors can be placed next to each other widthout lowering k below minApartmentWidth
   * tries placing along the longer side of the building
   * @param {} houseWidth
   * @param {*} houseHeight
   * @param {*} corridorWidth
   */
  calculateMaxCorridors(length, corridorWidth, minApartmentWidth) {
    // return imax
    return Math.floor(length / (corridorWidth + 2 * minApartmentWidth));
  }

  calculateMaxAparments(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth
  ) {
    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let shorterSide = houseWidth > houseHeight ? houseHeight : houseWidth;
    console.log(
      "> Calc max Apartment Size, longer side",
      longerSide,
      " shorter side",
      shorterSide
    );

    // 1. get max amount of corridors for this
    let iMax = this.calculateMaxCorridors(
      length,
      corridorWidth,
      minApartmentWidth
    );

    console.log("Max Corridors: ", iMax);
    // 2. calculate max amount of apartments that fit in this corridor layout
    // 2.1 calc max amount of aps per whole living area
    let maxApartmentsWholeLivingArea = Math.floor(
      shorterSide / minApartmentWidth
    );
    // 2.2 calc max amount of aps per half living area
    let maxApartmentsHalfLivingArea = Math.floor(
      ((shorterSide - corridorWidth) * 0.5) / minApartmentWidth
    );
    let halfLivingAreaCount = (iMax - 1) * 2;

    return (
      2 * maxApartmentsWholeLivingArea +
      halfLivingAreaCount * maxApartmentsHalfLivingArea
    );
  }
}
export default HouseCalculator;
