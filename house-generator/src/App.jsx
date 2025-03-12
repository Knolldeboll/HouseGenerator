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

  // TODO: Use State instead of this.n
  // TODO: nInput ist ein event! da muss aber der value drin sein
  onDataChange = (nInput) => {
    console.log("Data changed: ", nInput.target.value);
    if (nInput.target.value === "") {
      return;
    }
    this.setState({ n: nInput.target.value });

    console.log("State: ", this.state);
  };

  render() {
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
