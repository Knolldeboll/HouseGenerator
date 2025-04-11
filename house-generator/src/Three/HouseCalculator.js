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
    /*
    console.log(
      "> Calculate k for length of",
      length,
      "divided by ",
      i,
      " corridors of width ",
      corridorWidth
    );
    */
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

  //TODO: Bums passt nicht. Da kommt voll oft 0 raus obwohls eigentlich passen sollte.
  // Vielleicht doch iterativ machen.
  calculateMaxCorridors(length, corridorWidth, minApartmentWidth) {
    // TODO: Sideways in both directions! so for length and width
    console.log(">calculateMaxCorridors");

    // wenn mit 1 nicht geht, return 0
    if (this.calculateK(length, 1, corridorWidth) <= minApartmentWidth) {
      console.log("Max Corridors: 0");
      return 0;
    }

    let maxI = 0;
    while (this.calculateK(length, maxI, corridorWidth) >= minApartmentWidth) {
      maxI++;
    }

    // console.log("Max Corridors: ", maxI);
    return maxI;
    /*
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
    
*/
  }

  /**
   * Calculate a list of apartment count thresholds for [0,1,...,maxCorridors] which needs swapping to one more corridor
   * 0 corridors: 1 apartment
   *
   * @param {} length The side along which the corridors should be placed
   * @param {*} houseWidth
   * @param {*} houseHeight
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   * @returns
   */
  calculateCorridorThresholds(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth
  ) {
    let length = houseWidth > houseHeight ? houseWidth : houseHeight;

    console.log(">calculateCorridorThresholds");

    // Wir gehen davon aus, dass die max-anzahl an Korridoren dann entlang der längeren Seite platziert werden.
    // Da passen schließlich ja auch mehr rein als andersrum.
    let maxCorridors = this.calculateMaxCorridors(
      length,
      corridorWidth,
      minApartmentWidth
    );

    // 0 Corridors: 1 Apartment.
    let thresholds = [1];

    for (let i = 1; i <= maxCorridors; i++) {
      // Hier wird dann automatisch bei i = 1 entlang der kurzen Seite, bei i > 1 entlang der Längeren Seite platziert

      const currentMaxAps = this.calculateMaxAparmentsCounted(
        houseWidth,
        houseHeight,
        corridorWidth,
        minApartmentWidth,
        i
      );
      thresholds.push(currentMaxAps);
      console.log("Max Aps for ", i, " corridors: ", currentMaxAps);
    }

    return thresholds;
  }

  /**
   * Calculate max Apartments for a given LA rect
   * @param {} laRect The Living Apartment Rect the max Apartment amount should be calculated for
   * @param {} minApartmentWidth The min width for apartments
   */
  calculateMaxApartmentsLivingArea(laRect, minApartmentWidth) {
    return Math.floor(laRect.longerSideLength / minApartmentWidth);
  }

  // TODO: Handle 1 corridor
  /**
   * Calculates the max amount of Apartments for the max amount of corridors, which is computed here.
   *
   * To be used in Limit calculation, as only user inputs are needed for this!
   * @param {float} houseWidth
   * @param {float} houseHeight
   * @param {float} corridorWidth
   * @param {float} minApartmentWidth
   */
  calculateMaxAparmentsAbsolute(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth
  ) {
    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let maxCorridors = this.calculateMaxCorridors(
      longerSide,
      corridorWidth,
      minApartmentWidth
    );

    return this.calculateMaxAparmentsCounted(
      houseWidth,
      houseHeight,
      corridorWidth,
      minApartmentWidth,
      maxCorridors
    );
  }

  /**
   * Calculates the max amount of Apartments, which will be close to minimal size
   * for the given corridor layout (amount of corridors placed along the longer side of the poop)
   * is also able to handle 1 corridor, as then no half living areas are counted
   *
   * To be used in Limit calculation, as only user inputs are needed for this!
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
  calculateMaxAparmentsCounted(
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
    // When i = 1, this is 0
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

  // TODO: Min Max based. Currenlty only minbased

  // TODO: Distribution orientation: Bigger LAs can be more likely to be spread than smaller ones?
  // or would this be autofixed by maxbasing?

  /**
   * Calculates a number of apartments for each specified living area.
   * Guaranteed to not exceed the max amount of apartments per Living area!
   * @param {} livingAreaRects
   * @param {*} n
   * @param {*} minApartmentWidth
   * @returns Array of numbers representing the amount of apartments per livng area, ordered according to the input LA's
   */
  calculateRandomNDivisions(livingAreaRects, n, minApartmentWidth) {
    console.log(
      "> Calc N Divisions for Living Areas inputs",
      livingAreaRects,
      n,
      minApartmentWidth
    );
    let nSplits = [];

    if (livingAreaRects.length > n) {
      console.error(
        "calcNDivisions error: n",
        n,
        " too small! each of the ",
        livingAreaRects.length,
        " la must at least have one apartment"
      );

      return [];
    }

    // TODO: Check if the n given fits into the max amount of apartments per Living area!
    // So that the inputs are correct!
    // should be correct if the Limit's are applied properly in the SettingsTabs or InputChecker

    // 1. Max out every corridor rect's apartment count
    for (let la of livingAreaRects) {
      nSplits.push(
        this.calculateMaxApartmentsLivingArea(la, minApartmentWidth)
      );
    }

    console.log("calcNDivs max nSplits:", nSplits);

    // Sum the initial
    const summedMax = nSplits.reduce((acc, val) => acc + val, 0);
    console.log(" sums up to ", summedMax);
    console.log("now you want to split it into n: ", n, " apartments");

    if (n > summedMax) {
      console.error(" n too high! cant divide in so many apartments");
      return [];
    }

    // If n is maximum, return the maxed out nSplits
    if (n == summedMax) {
      return nSplits;
    }

    // If there are less wanted apartments (n) than total max apartments,

    // Remove one apartment per random living area one by one randomly,
    // but keep at least 1 apartment in each living area

    // Repeat until the remaining number of desired apartments == 0

    // DEADLOCK möglich:
    // wenn n = livingAreas bekommt jede livingArea genau 1 apartment
    // wenn n > livingAreas, bekommt jedes livingArea durchschnittlich mehr als 1 apartment

    // wenn n < livingAreas, bekommt jedes LA durchschn. WENIGER als 1 apartment1
    // Hier läuft die While aber endlos weiter, wenn alle schon 1 haben und noch min. 1 abgezogen werden soll!

    let endlessMitigationCounter = 0;

    while (nSplits.reduce((acc, val) => acc + val, 0) != n) {
      // Choose random LA to be decremented of one apartment
      let currentNSplitIndex = Math.floor(Math.random() * nSplits.length);
      // Keep each la at least at 1 apartment

      // when n = maxAps, every La has its  maxApartments
      if (nSplits[currentNSplitIndex] > 1) {
        nSplits[currentNSplitIndex]--;
      }

      endlessMitigationCounter++;

      if (endlessMitigationCounter > 100) {
        console.error("ENDLESSMITIGATION in calculateRandomNDivisions");
        return [];
      }
    }

    console.log("calculateNDivisions produced following splits:", nSplits);

    return nSplits;
  }

  // TODO: Method for Splitting the N apartments Evenly over the Living areas!
  // The amount of the apartments per LA should correspond to the width of the LA!
  // So maybe do this per percentage of the whole width or smth.
  // For Example: LA Rect width percentages are 0.3,0.2.,0.2,0.3
  // N =  14, so spreads would be 4.2, 2.8, 2.8, 4.2

  // -> Bringt das überhaupt so viel? Vielleicht macht das gar keinen Sinn...
  // Weil glaub die Verteilung der Anzahl an aps pro LA war schon ok, viel
  // Schlimmer war die Größe der aps
  // Andererseits: Wenn nur ein ap pro LA, wird dieses Ap schon immer hässlich..
  // Also vielleicht doch so wie's hier gedacht war, und der rest wird dann zu den großen LAs aufgeteilt oder so

  /**
   * Calculates the amount of apartments that shall be given to each Living area, corresponding to their actual size!
   *
   * @param {} livingAreaRects
   * @param {*} n
   * @param {*} minApartmentWidth
   * @returns
   */
  calculateEvenNDivisions(livingAreaRects, n, minApartmentWidth) {
    console.log("> calculateEvenNDivisions");
    let nSplits = [];

    // TODO: Can also k be longerSideLength?
    // This actually needs the opposite side of the side that is k long!
    // So the length shared with the corridor.

    // Gesamte Länge/"Größe", die für alle LA's zur Verfügung steht
    const totalLALength = livingAreaRects.reduce(
      (acc, rect) => acc + rect.longerSideLength
    );

    const LAPercentages = [];

    // Berechne die Gewichtungen der LA's im Bezug auf die Gesamtbreite aller LA's
    // Also konkret: Wieviel Prozent der Gesamtbreite hat jedes LA?
    for (const laRect of livingAreaRects) {
      LAPercentages.push(laRect.longerSideLength / totalLALength);
    }

    // Berechne aufgrund der Gewichtungen, wie viele Aps in jedes LA kommen.
    // Aber abgerundet, damit Ganzzahlige Anzahlen

    // Rest sollte auch immer auf Ganzzahl rauskommen, oder?
    // Denn wenn man ne beliebige Ganzzahlige Nummer in andere, kleinere ganzzahlige Nummern aufteilt
    // ist die summe dieser nummern auch ne Ganzzahl.
    // Der Rest somit auch.

    let rest = 0;

    for (const perc of LAPercentages) {
      // Berechne float Anzahl an Aps pro LA
      const apsWhole = perc * n;
      // Berechne dasselbe Abgerundet
      const apsRounded = Math.floor(perc * n);

      // Rest berechnen
      rest += apsWhole - apsRounded;
      // Abrunden, Rest speichern
      // nSplits beinhaltet nun die Abgerundete Anzahl an Aps pro Dings.
      nSplits.push(apsRounded);
    }

    rest = Math.round(rest);
    console.log("Rounded even divisions: ", nSplits, " rounded rest ", rest);

    // TODO: Möglicherweise rest auf Ganzzahl runden wegen  float Rechenfehlern
    while (rest != 0) {}

    return (nSplits = []);
  }
}

export default HouseCalculator;
