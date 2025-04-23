// Immer wenn sich ein fixer Input ändert, soll geprüft werden ob diese überhaupt Sinn ergeben.
// Dann sollen automatisch immer die Thresholds und die max-Anzahl an Korridoren berechnet und angezeigt werden.

import HouseCalculator from "./HouseCalculator";

class InputChecker {
  constructor(houseWidth, houseHeight, corridorWidth, minApartmentWidth) {
    // Diese fixen Inputs sind essenziell, daraus wird dann die max-Anzahl an Wohnungen berechnet
    // houseWidth/height sind immer safe.
    // corrWidth ist nur safe, wenn <= shorterSide.

    // minApartmentWidth hat als Limit immer shorterSide!
    // mit shorterSide wäre dann n immer 1

    // maxN wird dann später berechnet
    this.houseWidth = undefined;
    this.houseHeight = undefined;
    this.corridorWidth = corridorWidth;
    this.minApartmentWidth = minApartmentWidth;
    this.houseCalc = HouseCalculator.getInstance();

    this.longerSide = undefined;
    this.shorterSide = undefined;
    this.calculateSides();
    this.checkCorridorWidth();
  }

  // Hier machen wir für die Limits alles mit gettern und für die Settings alles mit Settern.
  // Überall werden die relevanten Werte erneut eingegeben, sodass man bei Eingabe von Settings direkt den
  // neuen Wert für die Limits abfragen kann.

  // Machts nicht mehr Sinn, einfach eine Methode zu machen wo man alle Änderungen optional reingibt?
  // Dann werden direkt die Limits berechnet und zurückgegeben.
  // Das wird aber eh nur bei Änderung eines Wertes ausgeführt, weil die Verarbeitung ja Instant ist.. oder?
  //
  // So wie's jetzt ist muss man in jedem Spezialfall die richtigen getter für die Limits aufrufen
  // aber eigentlich nur alle einmal einzeln für jedes Limit eben

  /**
   * Returns the max corridor width for given width/height
   * Also updates this. width/height and sides
   * @param {*} width
   * @param {*} height
   * @returns
   */

  getMaxCorridorWidth(width, height) {
    // let longerSide = width > height ? width : height;
    this.houseWidth = width;
    this.houseHeight = height;
    this.calculateSides(width, height);

    return this.longerSide - 1;
  }

  /**
   * calcultes the maximum minApartmentWidth that can fit into the building with the least amount of corridors
   * -> May also be the shorter side of the building, which will result in n = 1
   * @param {*} width
   * @param {*} height
   * @returns
   */

  // TODO: somehow also respond to the current corridorWidth,
  // return Math.min (k for corridorWidth and min # of corrs, shorterSide)
  // -> Width of biggest square that can fit into the living area

  // Quadrat, welches in ne Living Area von nem singleCorridor passt?
  // oder Quadrat, welches in LA von 0 corridors passt? (= houseRect)

  /**
   * Return the upper limit for "minApWidth"
   * @param {*} width
   * @param {*} height
   * @param {*} corridorWidth
   * @returns
   */
  getMaxMinApWidth(width, height, corridorWidth) {
    this.houseWidth = width;
    this.houseHeight = height;
    this.calculateSides(width, height);
    //console.log("maxmin", width, height, this.longerSide, this.shorterSide);
    return this.shorterSide;
    // solange minApWidth > als k ist wird n immer 1 sein.
    // Erst wenn minApWidh = k kann man einen Korridor machen, was mindestens zu n = 2 führt.
  }

  /**
   * Return the lower limit for "maxApWidth"
   * @param {*} width
   * @param {*} height
   * @param {*} corridorWidth
   * @returns
   */
  getMinMaxApWidth(width, height, corridorWidth) {
    this.houseWidth = width;
    this.houseHeight = height;
    this.calculateSides(width, height);
    return this.longerSide;
  }
  /**
   * Calculates the absolute max of apartments that fit.
   * @param {} width
   * @param {*} height
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   * @returns
   */
  getMaxN(thresholds) {
    console.log("getMaxN threshold input:", thresholds);
    // TODO: Anpassen, denn hier hat sich was verändert!

    // Es soll eigentlich der höchste Wert aus Thresholds kommen.

    let maxs = [];

    // Collect all mins
    for (let ts of thresholds) {
      if (ts.shorter != null) {
        maxs.push(ts.shorter.max);
      }
      if (ts.longer != null) {
        maxs.push(ts.longer.max);
      }
    }

    // get the lowest of mins
    console.log("Trhesholds from getMaxN", thresholds);
    return Math.max(...maxs);
  }

  /**
   * Gets the absolute min value out of the thresholds!
   * @param {*} thresholds
   * @returns
   */
  getMinN(thresholds) {
    console.log("getMinN threshold input:", thresholds);
    let mins = [];

    // Collect all mins
    for (let ts of thresholds) {
      if (ts.shorter != null) {
        mins.push(ts.shorter.min);
      }
      if (ts.longer != null) {
        mins.push(ts.longer.min);
      }
    }

    // get the lowest of mins
    console.log("Trhesholds from getMinN", thresholds);
    return Math.min(...mins);
    // Return the min of both
  }

  // is called when trying to enter width? macht aber keinen sinn.
  // Lieber ne settermethode, die fehlschlägt wenn man shit eingibt.
  checkCorridorWidth(width, height, corridorWidth) {
    this.calculateSides(width, height);
    if (this.corridorWidth >= this.longerSide) {
      console.error("Corridor too big to fit into the building");
      return false;
    }
    return true;
  }

  setWidth() {}
  // TODO: Handle every error with exceptions!

  calculateSides(width, height) {
    this.longerSide = width > height ? width : height;
    this.shorterSide = width < height ? width : height;
  }
  /**
   * Calculates the max amount of Apartments and the thresholds for new corridors for the given configuration
   * and returns them as []
   *
   * WIRD NICHT VERWENDET
   */
  getNRange() {
    // Berechnet k - wenn minApWidth > k, muss n = 1 sein.

    if (this.minApartmentWidth > shorterSide) {
      // ins Gebäude passt überhaupt kein Dings!
      console.error("MinApartmentWidth exceeds shorter side of the building!");
      return [];
    }

    // Kanns dann auch sein, dass k > als die Breite der Shorter side ist?
    // Weil dann wäre diese nämlich der limitierende Faktor und nicht k...

    // Eigentlich müsste man folgendes ausrechnen:
    // Ziehe Korridor in der Mitte und mach zwei Living Areas.
    // Schau dir die shorter Side der Living Areas an, das kann entweder k oder breite sein!
    // Dies ist der limitierende Faktor!

    let k1 = this.houseCalc.calculateK(shorterSide, 1, this.corridorWidth);
    let k2 = this.houseCalc.calculateK(longerSide, 1, this.corridorWidth);

    console.log("k1 shorter side:", k1);
    console.log("k2 longer side:", k2);
    let maxK = k1 > k2 ? k1 : k2;
    console.log("maxK: ", maxK);

    if (this.minApartmentWidth > maxK) {
      console.log("only one apartment with no corridors possible!");
      return [1];
    }

    // as minApWidth <= k: one or more corrs possible!

    let maxCorridors1 = this.houseCalc.calculateMaxCorridors();
    let maxCorridors2 = this.houseCalc.calculateMaxCorridors();
  }
}
export default InputChecker;
