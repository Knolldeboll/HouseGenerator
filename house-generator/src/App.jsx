import React, { Component } from "react";
import ThreeCanvas from "./ThreeCanvas";
import Settings from "./Settings";

class App extends Component {
  // TODO: Irgendwie die Spacings machen.
  // Der Erste Div soll oben sein, Breite ganz breit, Höhe angepasst an Inhalt
  // Der zweite soll den Rest ausfüllen

  render() {
    return (
      <div className="d-flex flex-column h-100 w-100">
        <div className="bg-secondary p-3 w-100">
          <Settings></Settings>
        </div>
        <div className="bg-info w-100 flex-grow-1 d-flex">
          <ThreeCanvas n="10"></ThreeCanvas>
        </div>
      </div>
    );
  }
}

export default App;
