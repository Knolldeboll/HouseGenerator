// Immer wenn sich ein fixer Input ändert, soll geprüft werden ob diese überhaupt Sinn ergeben.
// Dann sollen automatisch immer die Thresholds und die max-Anzahl an Korridoren berechnet und angezeigt werden.

import { min } from "three/tsl";
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
  getMaxApWidthUpperLimit(width, height, corridorWidth) {
    this.houseWidth = width;
    this.houseHeight = height;
    this.calculateSides(width, height);
    return this.longerSide;
  }

  /**
   * Calculate if the given minWidth is too big to fit in one of the 1-corridor layouts, meaninng that only a Single Apartment
   * can be generated!
   * @param {*} width
   * @param {*} height
   * @param {*} corridorWidth
   * @param {*} minWidth
   */
  isMinWidthTooBigForCorridor(width, height, corridorWidth, minWidth) {
    let k1 = this.houseCalc.calculateK(width, 1, corridorWidth);
    let k2 = this.houseCalc.calculateK(height, 1, corridorWidth);

    if (k1 < minWidth && k2 < minWidth) {
      console.log(
        "> minWidth ",
        minWidth,
        "is too big for corridor, because k1: ",
        k1,
        " k2:",
        k2
      );
      return true;
    }
    return false;
  }

  /**
   * Calculate the lower limit for maxApartmentWidth based on minApWidth
   * @param {*} width
   * @param {*} height
   * @param {*} corridorWidth
   * @param {*} minApWidth
   */

  // TODO: Maybe return the limits unrounded!
  getMaxWidthLowerLimit(width, height, corridorWidth, minApWidth) {
    // Fürs maximale Korridorlayout (wo k noch > minApWidth ist) berechnen, wie viele
    // Apartments da jeweils in ein ganzes/halbes LA reinpassen!

    console.log(
      "> Get the lower max widht limit for non crashing! inputs: ",
      width,
      height,
      corridorWidth,
      minApWidth
    );

    let longerSideLength = width > height ? width : height;
    let shorterSideLength = width > height ? height : width;

    // wir brauchen also: i und side.
    let maxApsLayout = this.houseCalc.calculateMaxAparmentsLayout(
      width,
      height,
      corridorWidth,
      minApWidth
    );

    if (maxApsLayout == null) {
      console.log("max aps layout resulted in i = 0: no corridor!");
      return null;
    }

    let [longersideplacement, i, k] = maxApsLayout;

    console.log(
      "The absolute max apartment layout is: on longerside placement ",
      longersideplacement,
      "i:",
      i,
      " k for this layout",
      k
    );

    // wenn korridore entlang der longerside platziert wurden, sind die LAs so lang wie die shorterside
    let laFullLength = longersideplacement
      ? shorterSideLength
      : longerSideLength;

    let laHalfLength = (laFullLength - corridorWidth) / 2;

    let maxApsFullLa = Math.floor(laFullLength / minApWidth);
    let minimalMaxApartmentWidthFull = laFullLength / maxApsFullLa;

    let finalMinimal;
    if (i == 1) {
      console.log(
        "lower limit max ap width for 1 corridor - from Full LA:",
        minimalMaxApartmentWidthFull,
        " vs k ",
        k,
        "for this layout"
      );

      finalMinimal = Math.max(minimalMaxApartmentWidthFull, k);
      if (finalMinimal == k) {
        console.log(" the final minimal comes from k!");
      } else {
        console.log("the final minimal comes from a LA average Ap");
      }

      return Math.ceil(finalMinimal);
      // return das durchschnittsdings von ner fulllength
    } else {
      let maxApsHalfLa = Math.floor(laHalfLength / minApWidth);
      let minimalMaxApartmentWidthHalf = laHalfLength / maxApsHalfLa;

      // Return the biggest one

      console.log(
        "lower limit max ap width for",
        i,
        " corridors - from full LA:",
        minimalMaxApartmentWidthFull,

        "vs from half LA:",
        minimalMaxApartmentWidthHalf,
        " vs k ",
        k,
        "for this layout"
      );

      finalMinimal = Math.max(
        minimalMaxApartmentWidthFull,
        minimalMaxApartmentWidthHalf,
        k
      );

      if (finalMinimal == k) {
        console.log(" the final minimal comes from k!");
      } else {
        console.log("the final minimal comes from a LA average Ap");
      }
      console.log(
        "final minimal value for max Width is",
        finalMinimal,
        "rounded up: ",
        Math.ceil(finalMinimal)
      );
      return Math.ceil(finalMinimal);
    }

    // wenn korridore entlang der longerside platziert wurden, sind die las so lang wie die shorterside

    // Diese Anzahl müsste auch mit den Thresholds übereinstimmen und bei Auswahl von n = maxN auch umgesetzt werden!
    // Dann die jeweilige Breite (entgegen k) durch die Anzahl teilen
    // Das ist die durchschnittliche Breite eines Ap in einem voll ausgefüllten LA.
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
    // TODO: Anpassen, denn hier hat sich was verändert!
    // Es soll eigentlich der höchste Wert aus Thresholds kommen.

    if (thresholds.length == 1 && thresholds[0].i == 0) {
      // nur ein Element drin, und zwar "i = 0 Korridore"
      return 1;
    }
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
    return Math.max(...maxs);
  }

  /**
   * Gets the absolute min value out of the thresholds!
   * @param {*} thresholds
   * @returns
   */
  getMinN(thresholds) {
    if (thresholds.length == 1 && thresholds[0].i == 0) {
      // nur ein Element drin, und zwar "i = 0 Korridore"
      return 1;
    }

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
