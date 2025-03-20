import React, { Component } from "react";
import ThreeCanvas from "./ThreeCanvas";
import Settings from "./Settings";

class App extends Component {
  // TODO: Irgendwie die Spacings machen.
  // Der Erste Div soll oben sein, Breite ganz breit, Höhe angepasst an Inhalt
  // Der zweite soll den Rest ausfüllen

  // width/height vom ThreeCanvas, später dann vom Renderer, welcher den Canvas skaliert, erstmal hier als fixer Wert machen.
  // Dieser ist abhängig von der Größe des Fensters, also window.innerWidth und window.innerHeight
  // Macht diesen abhängig vom umschließenden div zu machen Sinn? Nutzen wäre ja nur, dass der div sich automatisch an die
  // Fenstergröße und den anderen div anpasst. Aber rescaling geht ja auch so.

  //TODO: Werte aus Settings hier in States speichern und als Props an ThreeCanvas weitergeben
  // Child(Settings) to Parent(App) Kommunikation geht so:
  // state, dann pass up
  // Parent(App) to Child(ThreeCanvas) geht so:
  // direkt über props

  constructor(props) {
    super(props);
    // Default value for n
    this.state = {
      n: 6,
    };
  }

  // In diesem Callback wird der State der App verändert, sodass der ThreeCanvas geupdated wird.

  // TODO: Schauen, wie man das am besten mit mehreren Settings macht. Aktuell wird ja nur der
  // Value für einen Input übergeben.
  // Gut wäre es, direkt das komplette Set an Settings mitzugeben und hier in den State zu packen
  // und dann an ThreeCanvas weiterzugeben.
  // Vielleicht kann man hier statt dem Event auch direkt den Wert übergeben, oder
  // das Set an das Event irgendwie anheften

  onDataChange = (nInput) => {
    console.log("Data changed: ", nInput.target.value);
    if (nInput.target.value === "") {
      return;
    }
    this.setState({ n: nInput.target.value });

    console.log("State: ", this.state);
  };

  render() {
    //TODO: (aber nicht so wichtig) hier wieder Flexis reinpacken, damit mit beliebig vielen Settings gearbeitet werden kann
    // Aber die sind ja eh limitiert und ändern sich nicht so oft, da kann man das auch manuell anpassen also
    // Abstände etc.
    //  Das könnte man auch generell eh in den Settings machen

    //TODO: Remove unnecessary divs if a solution is found for the flexbox problem
    return (
      <div>
        <div>
          <Settings onChange={this.onDataChange}></Settings>
        </div>
        <div>
          <ThreeCanvas
            widthFactor={0.8}
            heightFactor={0.8}
            // Key enforced ein Re-Rendering. ggf nicht nötig.
            key={this.state.n}
            // Wenn nur ne Zahl geändert wird, die nichtmal angezeigt wird bzw. in ner custom prop ohne nutzen ist,
            // wird das Component nicht neu gerendert.
            n={this.state.n}
          ></ThreeCanvas>
        </div>
      </div>
    );
  }
}

export default App;
