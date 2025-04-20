import { max } from "three/tsl";

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
   * tries placing along the specified side of the building
   * @param {} length Length of the house side PERPENDICULAR to the main corridors, which they are placed along
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   */

  // Da war was mit geprüfter Eingabe "101", da hat der irgendwie falsch aufgeteilt oder so.
  calculateMaxCorridorsOriented(length, corridorWidth, minApartmentWidth) {
    console.log(">calculateMaxCorridors");

    // wenn mit 1 nicht geht, return 0
    if (this.calculateK(length, 1, corridorWidth) <= minApartmentWidth) {
      console.log("Max Corridors: 0");
      return 0;
    }

    let maxI = 0;

    // Hier irgendwie fehlerhaft!
    // Aha! Fehler ist der, dass beim letzten korrekten mal auch nochmal hochgezählt wird!

    // Iterativ i hochzählen und K berechnen, schauen wie hoch i maximal sein kann!
    while (
      this.calculateK(length, maxI + 1, corridorWidth) >= minApartmentWidth
    ) {
      maxI++;
    }

    /*
    console.log(
      "Max Corridors: ",
      maxI,
      " for side ",
      length,
      " corridorWidth ",
      corridorWidth,
      " minapwidth",
      minApartmentWidth,
      "final k: ",
      this.calculateK(length, maxI, corridorWidth)
    );
    */

    return maxI;
  }

  /** checks how many corridors must be placed next to each other along (perpendicular) the length-side,
   * so that k is smaller or equal to maxApartmentWidth
   * along the specified side of the building
   */

  // TODO: Test
  // BRBRBRBRBRBRBRB
  calculateMinCorridorsOriented(length, corridorWidth, maxApartmentWidth) {
    // TODO: bei maxCors gibts irgend ne abbruchbedingung am Anfang schonmal.
    //
    // Checken, ob k mit 0 Corrs klein genug ist!
    // length: länge der Seite, an der SENKRECHT platziert wird.

    // Kann mit 0 Korridoren ein maxAp entlang der length-Seite platziert werden?
    if (length <= maxApartmentWidth) {
      console.log("no cor needed!");
      return 0;
    }

    let minI = 1;

    // So lange mehr Korridore, und damit so lange k verkleinern, bis es nicht mehr größer als maxWidth ist
    // Am Anfang ist k zu groß, dass ein Ap von länge "maxApartmentWidth" reinpassen würde.
    // Deshalb erhöhe i und verkleinere somit k.
    // solange k größer als maxWidth ist, füge nen Korridor hinzu um k zu verkleinern!
    while (this.calculateK(length, minI, corridorWidth) > maxApartmentWidth) {
      minI++;
    }
    return minI;
  }

  /**
   * Calculate a list of threshold sets for each possible corridor layout with i corridors and for both orientations
   *
   *
   * @param {} length The side along which the corridors should be placed
   * @param {*} houseWidth
   * @param {*} houseHeight
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   * @returns List of threshold sets, each one containing the thresholds for both orientations of the layout of i corridors
   */

  // TODO:

  // Für jede konfig aus i + shorter/longer muss ein maxN und ein minN berechnet werden!
  // manchmal kommts vor, dass ein maxN existiert aber kein minN

  // Vielleicht kann der Bums schon eingeschränkt werden, indem man zusätzlich zu
  // maxKorridors für Shorter/longer auch minKorridors für Shorter/Longer einbezieht.
  // So muss man nicht immer bei i = 0 starten, wenns keinen Sinn macht!

  calculateCorridorThresholds(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth
  ) {
    // TODO alles bitte

    console.log(">calculateCorridorThresholds");

    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let shorterSide = houseWidth < houseHeight ? houseWidth : houseHeight;

    // Wir gehen davon aus, dass die max-anzahl an Korridoren dann entlang der längeren Seite platziert werden.
    // Da passen schließlich ja auch mehr rein als andersrum.

    // TODO: für beide Seiten berechnen,
    // also einmal maxCorridors horizontal, einmal maxCorridors vertika

    // Sowas wie [1, {vertical:13,horizontal:15}, {vertical:20,horizontal:25},
    //  {vertical:30,horizontal:35}, {vertical:40,horizontal:XX}]
    // Soll rauskommen!

    // Wie viele Korridore können minAp-Safe entlang der  längeren Seite platziert werden?
    // Sodass k nicht > minApartmentWidth

    // MaxCorridors passt soweit!
    let maxCorridorsLongerSide = this.calculateMaxCorridorsOriented(
      longerSide,
      corridorWidth,
      minApartmentWidth
    );

    // Wie viele Korridore können minAp-Safe entlang der  längeren Seite platziert werden?
    let maxCorridorsShorterSide = this.calculateMaxCorridorsOriented(
      shorterSide,
      corridorWidth,
      minApartmentWidth
    );

    // Absolute Anzahl an Corridors
    let maxCorridors =
      maxCorridorsLongerSide > maxCorridorsShorterSide
        ? maxCorridorsLongerSide
        : maxCorridorsShorterSide;

    let thresholds = [];

    // Jede generell mögliche Anzahl von corridors bekommt ein
    // Threshold-Set.
    // Diese haben 2 einträge, da die i corridore immer an der langen oder kurzen seite platziert werden können
    // Pro i wird dann für jede corridor-orientierung die maxApartment anzahl ausgerechnet.
    //
    // Manchmal können i corridore nur an einer von beiden seiten platziert werden, da bei der anderen dann das k zu klein wäre!
    // wenn das der Fall ist, kommt in den entsprechenden eintrag "null" rein.

    for (let i = 1; i <= maxCorridors; i++) {
      // Hier wird dann automatisch bei i = 1 entlang der kurzen Seite, bei i > 1 entlang der Längeren Seite platziert

      // Check if k  would be smaller than minApSize for i and the current side. If so, no
      // Aps possible for i and specified side!

      let thresholdSet = { shorter: null, longer: null };

      // Schau was passiert, wenn man i Korridore entlang der kürzeren Seite
      // platzieren würde. Erhöhe i bis zu maxCors

      const shorterK = this.calculateK(shorterSide, i, corridorWidth);

      // Wenn k ok bei den i Korridoren ok wäre, berechne die maxAps
      if (shorterK >= minApartmentWidth) {
        //  console.log("so do maxaps");
        const currentMaxApsShorter = this.calculateMaxApartmentsCountedOriented(
          corridorWidth,
          minApartmentWidth,
          i,
          longerSide
        );

        //  console.log(">>>>>>  maxAps calculated: ", currentMaxApsShorter);
        thresholdSet.shorter = currentMaxApsShorter;
      }
      const longerK = this.calculateK(longerSide, i, corridorWidth);
      //  console.log(" k would be ", longerK);
      if (longerK >= minApartmentWidth) {
        //   console.log("so do maxaps");
        const currentMaxApsLonger = this.calculateMaxApartmentsCountedOriented(
          corridorWidth,
          minApartmentWidth,
          i,
          shorterSide
        );

        //  console.log(">>>>>>  maxAps calculated: ", currentMaxApsLonger);
        thresholdSet.longer = currentMaxApsLonger;
      }

      thresholds.push(thresholdSet);
    }

    return thresholds;
  }

  /**
   * Calculates the Thresholds for all feasible values of i (where minApWidth >=k <= maxApWidth)
   *
   * For each i, for each orientation (perpendicular to shorter/longer side), calculate the min amount of apartments and the max amount of apartments
   *
   *
   * @param {} houseWidth
   * @param {*} houseHeight
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   * @param {*} maxApartmentWidth
   * @returns
   */

  calculateMinMaxCorridorThresholds(
    houseWidth,
    houseHeight,
    corridorWidth,
    minApartmentWidth,
    maxApartmentWidth
  ) {
    // TODO einmal alles bitte

    /**
     * Am Ende soll sowas rauskommen wie:
     * (shorter: (min:5) (max:10),longer)
     */

    console.log(">calculateCorridorThresholds");

    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let shorterSide = houseWidth < houseHeight ? houseWidth : houseHeight;

    // Wir gehen davon aus, dass die max-anzahl an Korridoren dann entlang der längeren Seite platziert werden.
    // Da passen schließlich ja auch mehr rein als andersrum.

    // TODO: für beide Seiten berechnen,
    // also einmal maxCorridors horizontal, einmal maxCorridors vertika

    // Sowas wie [1, {vertical:13,horizontal:15}, {vertical:20,horizontal:25},
    //  {vertical:30,horizontal:35}, {vertical:40,horizontal:XX}]
    // Soll rauskommen!

    // Wie viele Korridore können minAp-Safe entlang der  längeren Seite platziert werden?
    // Sodass k nicht > minApartmentWidth

    // MaxCorridors passt soweit!
    let maxCorridorsLongerSide = this.calculateMaxCorridorsOriented(
      longerSide,
      corridorWidth,
      minApartmentWidth
    );

    // Wie viele Korridore können minAp-Safe entlang der  längeren Seite platziert werden?
    let maxCorridorsShorterSide = this.calculateMaxCorridorsOriented(
      shorterSide,
      corridorWidth,
      minApartmentWidth
    );

    // Absolute Anzahl an Corridors
    let maxCorridors =
      maxCorridorsLongerSide > maxCorridorsShorterSide
        ? maxCorridorsLongerSide
        : maxCorridorsShorterSide;

    // Calc the min amount of corridors that must be placed to keep k small enough so maxApartmentWidth fits in!

    // Hiermit könnte man direkt die Korridor-Konfigs ausschließen, bei denen k zu groß für max wäre!
    // man berechnet also keine irrelevanten threshold sets

    let minCorridorsShorterSide = this.calculateMinCorridorsOriented(
      shorterSide,
      corridorWidth,
      maxApartmentWidth
    );
    let minCorridorsLongerSide = this.calculateMinCorridorsOriented(
      longerSide,
      corridorWidth,
      maxApartmentWidth
    );

    let minCorridors =
      minCorridorsLongerSide < minCorridorsShorterSide
        ? minCorridorsLongerSide
        : minCorridorsShorterSide;

    let thresholds = [];

    // Jede generell mögliche Anzahl von corridors bekommt ein
    // Threshold-Set.
    // Diese haben 2 einträge, da die i corridore immer an der langen oder kurzen seite platziert werden können
    // Pro i wird dann für jede corridor-orientierung die maxApartment anzahl ausgerechnet.
    //
    // Manchmal können i corridore nur an einer von beiden seiten platziert werden, da bei der anderen dann das k zu klein wäre!
    // wenn das der Fall ist, kommt in den entsprechenden eintrag "null" rein.

    /*
    console.log(
      "calcing thresholds for i = ",
      minCorridors,
      " - ",
      maxCorridors
    );
*/
    // nur von minCorridors bis maxCorridors rechnen, da
    // alles darunter ein k erzeugen würde welches zu groß für maxWidth wäre und
    // alles darüber ein k erzeugen würde welches zu klein für minWidth wäre
    for (let i = minCorridors; i <= maxCorridors; i++) {
      // Hier wird dann automatisch bei i = 1 entlang der kurzen Seite, bei i > 1 entlang der Längeren Seite platziert

      // Check if k  would be smaller than minApSize for i and the current side. If so, no
      // Aps possible for i and specified side!

      let thresholdSet = {
        i: i,
        shorter: null,
        longer: null,
      };

      // Calculate k for corridor placement along shorter side.

      const shorterK = this.calculateK(shorterSide, i, corridorWidth);
      //console.log(" k would be ", shorterK);

      // Wenn für i und side das k weder zu groß für maxWidth noch zu klein für minWidth ist,
      // berechne die thresholds min und max -apartments. Sonst machts keinen Sinn.
      if (shorterK >= minApartmentWidth && shorterK <= maxApartmentWidth) {
        // Calculate
        const currentMaxApsShorter = this.calculateMaxApartmentsCountedOriented(
          corridorWidth,
          minApartmentWidth,
          i,
          longerSide
        );

        const currentMinApsShorter = this.calculateMinApartmentsCountedOriented(
          corridorWidth,
          maxApartmentWidth,
          i,
          longerSide
        );

        thresholdSet.shorter = {
          min: currentMinApsShorter,
          max: currentMaxApsShorter,
        };
      }

      const longerK = this.calculateK(longerSide, i, corridorWidth);
      //console.log(" k would be ", longerK);
      if (longerK >= minApartmentWidth && longerK <= maxApartmentWidth) {
        //console.log("so do maxaps");
        const currentMaxApsLonger = this.calculateMaxApartmentsCountedOriented(
          corridorWidth,
          minApartmentWidth,
          i,
          shorterSide
        );

        const currentMinApsShorter = this.calculateMinApartmentsCountedOriented(
          corridorWidth,
          maxApartmentWidth,
          i,
          shorterSide
        );

        thresholdSet.longer = {
          min: currentMinApsShorter,
          max: currentMaxApsLonger,
        };
      }

      thresholds.push(thresholdSet);
    }

    return thresholds;
  }

  /**
   * Calculate max Apartments for a given LA rect
   * @param {} laRect The Living Apartment Rect the max Apartment amount should be calculated for
   * @param {} minApartmentWidth The min width for apartments
   * @param {} splitHorizontally If the LAs should be split horizontally or not
   */

  // TODO: do specify split orientation instead of always splitting along longer side!
  calculateMaxApartmentsLivingArea(
    laRect,
    minApartmentWidth,
    splitHorizontally
  ) {
    if (splitHorizontally) {
      return Math.floor(laRect.edges.lowerEdge.length / minApartmentWidth);
    } else {
      return Math.floor(laRect.edges.rightEdge.length / minApartmentWidth);
    }
  }

  /**
   * calculate minimum amount of Apartments for a given LA Rect
   * @param {} laRect
   * @param {*} maxApartmentWidth
   * @param {} splitHorizontally If the LAs should be split horizontally or not
   */
  calculateMinApartmentsLivingArea(
    laRect,
    maxApartmentWidth,
    splitHorizontally
  ) {
    console.log(">calculate min aps for LA ", laRect, maxApartmentWidth);

    if (splitHorizontally) {
      return Math.ceil(laRect.edges.lowerEdge.length / maxApartmentWidth);
    } else {
      return Math.ceil(laRect.edges.rightEdge.length / maxApartmentWidth);
    }
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
    // TODO: Fix this by iterating over every possible i!
    //
    // Because: Sometimes lower i produces better maxAps!
    // not always the last of the thresholds (with highest i) is the most maxAps!

    let longerSide = houseWidth > houseHeight ? houseWidth : houseHeight;
    let shorterSide = houseWidth < houseHeight ? houseWidth : houseHeight;

    let maxCorridorsLonger = this.calculateMaxCorridorsOriented(
      longerSide,
      corridorWidth,
      minApartmentWidth
    );

    let maxCorridorsShorter = this.calculateMaxCorridorsOriented(
      shorterSide,
      corridorWidth,
      minApartmentWidth
    );

    // max aps für beide Höchstanzahlen an Korridoren verwenden
    // denn wenn maxcorrs1 < maxcorrs2, dann hat maxcorrs2 wahrsch. mehr aps.
    // aber wenn maxcorrs1 = maxcorrs2, dann kann mans nicht sagen!

    // TODO: Sind die aps bei maxCorridors wirklich immer die besten?
    // nein, nicht unbedingt!
    // Noch abändern, um n gescheides Limit anzuzeigen.
    const maxCorridorsTotal =
      maxCorridorsLonger > maxCorridorsShorter
        ? maxCorridorsLonger
        : maxCorridorsShorter;

    let totalMaxApsLonger = 0;
    let totalMaxApsShorter = 0;

    for (let i = 1; i <= maxCorridorsLonger; i++) {
      let currentMaxApsLonger = this.calculateMaxApartmentsCountedOriented(
        corridorWidth,
        minApartmentWidth,
        i,
        shorterSide
      );

      if (currentMaxApsLonger > totalMaxApsLonger) {
        totalMaxApsLonger = currentMaxApsLonger;
      }
    }

    for (let i = 1; i <= maxCorridorsShorter; i++) {
      let currentMaxApsShorter = this.calculateMaxApartmentsCountedOriented(
        corridorWidth,
        minApartmentWidth,
        i,
        longerSide
      );

      if (currentMaxApsShorter > totalMaxApsShorter) {
        totalMaxApsShorter = currentMaxApsShorter;
      }
    }
    // Iterate over every possible corridor count that keeps k >= minapWidth
    // Save the max threshold encountered

    // Das Problem ist hier, dass der brute force über alle i drübergeht, bis zum maximalen i vom höheren!
    // Dabei rechnet der aber auch fürs jeweils andere die maxaps mit demselben i aus, was zu einem zu kleinen
    // k führen kann!

    return totalMaxApsLonger > totalMaxApsShorter
      ? totalMaxApsLonger
      : totalMaxApsShorter;
  }

  /**
   * Für Limits - aber macht das Sinn? Man kann auch erstmal die Thresholds ausrechnen und dann unter/obergrenze nehmen hihi
   */
  calculateMinApartmentsAbsolute() {}

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

    // TODO: Check if k would be
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

  /**
   * Calculate the max amounts of Apartments for the given amount of corridors if the
   * corridors would be placed PARALLEL TO the specified side!
   * @param {*} corridorWidth
   * @param {*} minApartmentWidth
   * @param {*} corridorCount
   * @param {*} parallelSide
   */
  calculateMaxApartmentsCountedOriented(
    corridorWidth,
    minApartmentWidth,
    corridorCount,
    parallelSide
  ) {
    console.log(
      ">calc Max aps counted oriented for corwidth ",
      corridorWidth,
      "minapW",
      minApartmentWidth,
      "corrCount",
      corridorCount,
      "side",
      parallelSide
    );
    // TODO: Check if k would be too small for minApartmentWidth;

    // 2. calculate max amount of apartments that fit in this corridor layout
    // 2.1 calc max amount of aps per whole living area

    // TODO: Hier nicht die placementSide nehmen, sondern die entlang der Korridore bzw. der LAs

    let maxApartmentsWholeLivingArea = Math.floor(
      parallelSide / minApartmentWidth
    );
    // 2.2 calc max amount of aps per half living area
    // When i = 1, this is 0
    let maxApartmentsHalfLivingArea = Math.floor(
      ((parallelSide - corridorWidth) * 0.5) / minApartmentWidth
    );

    // Calculate the amount of half living areas, which is dependent of the
    // Hii hii
    // * 4 ist Korrekt!
    let halfLivingAreaCount = (corridorCount - 1) * 4;

    return (
      2 * maxApartmentsWholeLivingArea +
      halfLivingAreaCount * maxApartmentsHalfLivingArea
    );
  }

  /**
   * Calculate the min amount of Apartments for the given amount of corridors if the corridors would be placed PARALLEL to the
  specified side, while keeping k <= maxApWidth
   *  
  */

  calculateMinApartmentsCountedOriented(
    corridorWidth,
    maxApartmentWidth,
    corridorCount,
    parallelSide
  ) {
    console.log(
      ">calc min aps counted oriented for corwidth ",
      corridorWidth,
      "maxapW",
      maxApartmentWidth,
      "corrCount",
      corridorCount,
      "side",
      parallelSide
    );
    // TODO: Check if k would be too small for minApartmentWidth;

    // 2. calculate max amount of apartments that fit in this corridor layout
    // 2.1 calc max amount of aps per whole living area

    // TODO: Hier nicht die placementSide nehmen, sondern die entlang der Korridore bzw. der LAs

    let minApartmentsWholeLivingArea = Math.ceil(
      parallelSide / maxApartmentWidth
    );
    // 2.2 calc max amount of aps per half living area
    // When i = 1, this is 0
    let minApartmentsHalfLivingArea = Math.ceil(
      ((parallelSide - corridorWidth) * 0.5) / maxApartmentWidth
    );

    // Calculate the amount of half living areas, which is dependent of the
    // Hii hii
    // * 4 ist Korrekt!
    let halfLivingAreaCount = (corridorCount - 1) * 4;

    return (
      2 * minApartmentsWholeLivingArea +
      halfLivingAreaCount * minApartmentsHalfLivingArea
    );
  }
  // TODO: Min Max based. Currenlty only minbased

  // TODO: Distribution orientation: Bigger LAs can be more likely to be spread than smaller ones?
  // or would this be autofixed by maxbasing?

  /**
   * Returns randomized splitting of n over the apartments while keeping the min and max amount of
   * aps of the la's
   * @param {} livingAreaRects
   * @param {*} n
   * @param {*} minApartmentWidth
   * @param {*} maxApartmentWidth
   * @param {*} splitHorizontally Gibt an, ob die LAs horizontal gesplittet werden sollen
   */
  calculateRandomNDivisionsMinMax(
    livingAreaRects,
    n,
    minApartmentWidth,
    maxApartmentWidth,
    splitHorizontally
  ) {
    console.log(
      "> Calc N Divisions for Living Areas inputs",
      livingAreaRects,
      n,
      minApartmentWidth,
      maxApartmentWidth
    );

    //  maximum splits per LA to keep the minWidth
    let nSplitsMax = [];
    // minimum splits per LA to keep the maxWidth
    let nSplitsMin = [];

    // wenn weniger Apartments als LAs return, da jedes LA mindestens 1 Apartment haben muss

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

    // 1. Fill max AND min splits
    for (let la of livingAreaRects) {
      nSplitsMax.push(
        this.calculateMaxApartmentsLivingArea(
          la,
          minApartmentWidth,
          splitHorizontally
        )
      );
      nSplitsMin.push(
        this.calculateMinApartmentsLivingArea(
          la,
          maxApartmentWidth,
          splitHorizontally
        )
      );
    }
    console.log("maxsplits: ", nSplitsMax, " minsplits: ", nSplitsMin);
    // console.log("calcNDivs max nSplits:", nSplits);

    // Sum the full max
    const summedMax = nSplitsMax.reduce((acc, val) => acc + val, 0);
    console.log(" total max splits", summedMax);

    // Sum the full min
    const summedMin = nSplitsMin.reduce((acc, val) => acc + val, 0);
    console.log("Total min splits: ", summedMin);

    console.log("now you want to split it into n: ", n, " apartments");

    if (n > summedMax) {
      console.error(" n too high! cant divide in so many apartments");
      return [];
    }

    if (n < summedMin) {
      console.error(" n too low! must divide in more apartments");
      return [];
    }

    // If n is maximum, return the maxed out nSplits
    if (n == summedMax) {
      return nSplitsMax;
    }

    // if n is minimum, return the min out nSplits
    if (n == summedMin) {
      return nSplitsMin;
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

    // Still start with the max splits and decrement them.
    while (nSplitsMax.reduce((acc, val) => acc + val, 0) != n) {
      // Choose random LA to be decremented of one apartment
      let currentNSplitIndex = Math.floor(Math.random() * nSplitsMax.length);
      // Keep each la at least at its min apartments!

      // when n = maxAps, every La has its  maxApartments
      if (nSplitsMax[currentNSplitIndex] > nSplitsMin[currentNSplitIndex]) {
        nSplitsMax[currentNSplitIndex]--;
      }

      endlessMitigationCounter++;

      if (endlessMitigationCounter > 100) {
        console.error("ENDLESSMITIGATION in calculateRandomNDivisions");
        return [];
      }
    }

    console.log("calculateNDivisions produced following splits:", nSplitsMax);
    console.log(
      "sums up to: ",
      nSplitsMax.reduce((acc, val) => acc + val, 0)
    );

    return nSplitsMax;
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
   * @param {*} minApartmentWidth Wird beim anderen genutzt, um die maximale Anzahl an Aps pro LA zu berechnen.
   * @param {*} splitHorizontally Gibt an, ob die LAs horizontal gesplittet werden sollen
   * @returns
   */
  calculateEvenNDivisionsMinMax(
    livingAreaRects,
    n,
    minApartmentWidth,
    maxApartmentWidth,
    splitHorizontally
  ) {
    console.log("> calculateEvenNDivisionsMINMAX");
    let nSplits = [];

    let maxSplits = [];
    let minSplits = [];

    // Wenn Korridore entlang der x achse platziert wurden, muss man LAs vertically splitten
    // wenn k entlang y achse, dann Las horizontal splitten

    // 1. Fill max AND min splits
    for (let la of livingAreaRects) {
      maxSplits.push(
        this.calculateMaxApartmentsLivingArea(
          la,
          minApartmentWidth,
          splitHorizontally
        )
      );
      minSplits.push(
        this.calculateMinApartmentsLivingArea(
          la,
          maxApartmentWidth,
          splitHorizontally
        )
      );
    }

    console.log("maxsplits: ", maxSplits, " minsplits: ", minSplits);

    // console.log("calcNDivs max nSplits:", nSplits);
    // TODO: Can also k be longerSideLength?
    // This actually needs the opposite side of the side that is k long!
    // So the length shared with the corridor.

    let maxSum = maxSplits.reduce((acc, val) => acc + val, 0);
    let minSum = minSplits.reduce((acc, val) => acc + val, 0);

    if (n > maxSum) {
      console.error(" n too high! cant divide in so many apartments");
      return [];
    }

    if (n < minSum) {
      console.error(" n too low! must divide in more apartments");
      return [];
    }

    // Shortcuts for direct split hits
    if (maxSum == n) {
      return maxSplits;
    }
    if (minSum == n) {
      return minSplits;
    }

    // >>> Nun berechne die Anteile von n pro LA anhand ihrer Größe/Breite
    // TODO: Es kann auch sein, dass "longerSideLength" nicht die Gangseite ist!

    // Gesamte Länge/"Größe", die für alle LA's zur Verfügung steht
    // Hier gehen wir davon aus, dass die LivingRects mit der längeren Seite am Korridor liegen
    const totalLALength = livingAreaRects.reduce(
      (acc, rect) => acc + rect.longerSideLength,
      0
    );

    //console.log("totalLAlength:", totalLALength);
    const LAPercentages = [];

    for (const laRect of livingAreaRects) {
      LAPercentages.push(laRect.longerSideLength / totalLALength);
    }

    //let testSum = LAPercentages.reduce((acc, perc) => acc + perc, 0);
    //console.log("LApercentages:", LAPercentages, " sum up to ", testSum);

    // Berechne aufgrund der Gewichtungen, wie viele Aps in jedes LA kommen.
    // Aber abgerundet, damit Ganzzahlige Anzahlen

    // Rest sollte auch immer auf Ganzzahl rauskommen, oder?
    // Denn wenn man ne beliebige Ganzzahlige Nummer per Prozent in andere, kleinere ganzzahlige Nummern aufteilt
    // ist die summe dieser nummern auch ne Ganzzahl.
    // Der Rest somit auch. getestet!

    // TODO: minapartments für alle LA's zusammenrechnen.

    // dann die differenz aller La-MinApartmentcounts zu n herausfinden

    // n abzüglich der schon in minSplits vergebenen Apartments.
    // alá: la 1 bekommt 0.5 der Restlichen Aps, la2 bekommt 0.2 der restlichen Aps, etc.

    let remainingN = n - minSum;
    console.log(
      "Remaining n:",
      remainingN,
      " = n (",
      n,
      ") minus already divided minAps:",
      minSum
    );

    // nun Teile die remaining Ap's anhand der Gewichtungen auf die LA's auf

    let rest = 0;
    let counter = 0;
    for (const perc of LAPercentages) {
      // Berechne float Anzahl an Aps pro LA
      const apsWhole = perc * remainingN;
      // Berechne dasselbe Abgerundet
      const apsRounded = Math.floor(perc * remainingN);
      // Rest berechnen
      rest += apsWhole - apsRounded;
      nSplits.push(minSplits[counter] + apsRounded);

      if (nSplits[counter] > maxSplits[counter]) {
        console.error("one nSplit is already greater than its maxSplit!");
        return [];
      }
      counter++;
    }

    console.log("nSplits with minSplits and added percentage splits", nSplits);

    // TODO: Kommt da überhaupt immer N Raus? wtf?
    // Ja! Denn prinzipiell werden hier Percentages, die zusammen immer 1 ergeben,
    // mit n multipliziert und abgerundet.
    // der Rest gibt dann immer ne ganzzahl.

    console.log("unrounded apartment rest:", rest);
    // weil wenn der Rest
    rest = Math.round(rest);
    console.log("rounded apartment rest:", rest);
    // console.log("Rounded even divisions: ", nSplits, " rounded rest ", rest);

    // Nun die in "rest" definierten Apartments noch irgendwie aufteilen.

    // Das machmer so: jede LA bekommt reihum einen dazu, solange deren max noch nicht erreicht ist.
    // so ergibt es sich, dass bei einem n mehr einfach das nächste LA mehr gesplittet wird.

    let endlessMitigationCounter = 0;
    while (rest > 0) {
      for (let i = 0; i < livingAreaRects.length; i++) {
        // Wenn aktuelles nSplit sein Limit noch nicht erreicht hat,
        // addiere eins drauf

        if (nSplits[i] < maxSplits[i]) {
          nSplits[i]++;
          rest--;
          if (rest == 0) {
            break;
          }
        }
      }

      endlessMitigationCounter++;
      if (endlessMitigationCounter > 50) {
        console.log(
          "HURENSOHN: iwie kann der rest von n nicht aufgeteilt werden."
        );
        break;
      }
    }

    //let nSplitTestSum = nSplits.reduce((acc, split) => acc + split, 0);
    // console.log("maxSplits ", maxSplits);
    // console.log("vs Final N-Splits:", nSplits, " sum up to ", nSplitTestSum);

    return nSplits;

    // TODO: Möglicherweise rest auf Ganzzahl runden wegen  float Rechenfehlern
    while (rest != 0) {}

    return (nSplits = []);
  }

  /**
   * OBSOLETE! Use MinMax Version
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

    // console.log("calcNDivs max nSplits:", nSplits);

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

  /**
   * OBSOLETE! use MinMax version
   * Calculates the amount of apartments that shall be given to each Living area, corresponding to their actual size!
   *
   * @param {} livingAreaRects
   * @param {*} n
   * @param {*} minApartmentWidth Wird beim anderen genutzt, um die maximale Anzahl an Aps pro LA zu berechnen.
   * @returns
   */

  calculateEvenNDivisions(livingAreaRects, n, minApartmentWidth) {
    console.log("> calculateEvenNDivisions");

    // TODO: Check if every La would even get one ap!
    // Maybe initialize nSplits with 1's - weil dass das minimum ist!

    let nSplits = [];

    let maxSplits = [];

    for (let la of livingAreaRects) {
      maxSplits.push(
        this.calculateMaxApartmentsLivingArea(la, minApartmentWidth)
      );
    }

    // TODO: Can also k be longerSideLength?
    // This actually needs the opposite side of the side that is k long!
    // So the length shared with the corridor.

    // Gesamte Länge/"Größe", die für alle LA's zur Verfügung steht
    // Hier gehen wir davon aus, dass die LivingRects mit der längeren Seite am Korridor liegen
    const totalLALength = livingAreaRects.reduce(
      (acc, rect) => acc + rect.longerSideLength,
      0
    );

    //console.log("totalLAlength:", totalLALength);
    const LAPercentages = [];

    // Berechne die Gewichtungen der LA's im Bezug auf die Gesamtbreite aller LA's
    // Also konkret: Wieviel Prozent der Gesamtbreite hat jedes LA?
    for (const laRect of livingAreaRects) {
      LAPercentages.push(laRect.longerSideLength / totalLALength);
    }

    //let testSum = LAPercentages.reduce((acc, perc) => acc + perc, 0);
    //console.log("LApercentages:", LAPercentages, " sum up to ", testSum);

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
      // nSplits beinhaltet nun die Abgerundete Anzahl an Aps pro LA.
      nSplits.push(apsRounded);
    }

    rest = Math.round(rest);
    // console.log("Rounded even divisions: ", nSplits, " rounded rest ", rest);

    // Nun die in "rest" definierten Apartments noch irgendwie aufteilen.

    // Das machmer so: jede LA bekommt reihum einen dazu, solange deren max noch nicht erreicht ist.
    // so ergibt es sich, dass bei einem n mehr einfach das nächste LA mehr gesplittet wird.

    let endlessMitigationCounter = 0;
    while (rest > 0) {
      for (let i = 0; i < livingAreaRects.length; i++) {
        // Wenn aktuelles nSplit sein Limit noch nicht erreicht hat,
        // addiere eins drauf

        if (nSplits[i] < maxSplits[i]) {
          nSplits[i]++;
          rest--;
          if (rest == 0) {
            break;
          }
        }
      }

      endlessMitigationCounter++;
      if (endlessMitigationCounter > 50) {
        console.log("HURENSOHN");
        break;
      }
    }

    //let nSplitTestSum = nSplits.reduce((acc, split) => acc + split, 0);
    // console.log("maxSplits ", maxSplits);
    // console.log("vs Final N-Splits:", nSplits, " sum up to ", nSplitTestSum);

    return nSplits;

    // TODO: Möglicherweise rest auf Ganzzahl runden wegen  float Rechenfehlern
    while (rest != 0) {}

    return (nSplits = []);
  }
}

export default HouseCalculator;
