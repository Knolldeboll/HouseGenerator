import { SettingsTab } from "./SettingsTab";
import React, { Component } from "react";

// Oben ein Bereich, der mehrere Inputdingers für Settings enthält
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 6,
      buildingWidth: 10,
      buildingHeight: 10,
      corridorWidth: 2,
      // TODO: Calculate max/minApartmentArea based on buildingWidth/buildingHeight and maxAR
      // show this on the UI and set it as a upper/lower limit for the input provided here
      minapatmentArea: 6,
      maxApartmentArea: 12,
      maxAR: 1.5,
    };
  }

  // TODO: Hier eine Callback-Funktion für alle States machen.
  // Jedes SettingInput kann diese aufrufen und Werte im State-Set ändern,
  // Bei Änderungen wird dann das komplette Set nach oben propagiert
  // > Wie genau wird dem SettingInput über die Methode dann gesagt, welchen Wert es ändern soll?

  //TODO: Mehrere Inputfelder nebeneinander und unter/übereinander im Hauptdiv stapeln
  // vielleicht machts da Sinn das bootstrap-Grid zu nehmen

  // Die bekommen ihren Initialwert und die Callbackfunktion dann jeweils aus den Props von hier!
  // z.B. der SettingInput von "Anzahl Wohnungen" bekommt "n" als Startwert und this.props.onChange als Callback
  // Vielleicht machts Sinn, hie
  render() {
    return (
      // div surrounds one setting tab
      <>
        <SettingsTab n={this.state.n} onChange={this.props.onChange} />

        <SettingsTab n={this.state.n} onChange={this.props.onChange} />
      </>
    );
  }
}
export default Settings;
