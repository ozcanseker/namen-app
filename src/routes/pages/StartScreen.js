import React from "react";

/**
 * Start scherm met de stuk tekst.
 */
class StartScreen extends React.Component {
  render() {
    return (
      <div className="startScreen">
        <p className="explainText">
          Aardrijkskundige namen zijn onmisbaar om te beschrijven waar we zijn,
          waar we vandaan komen en waar we naartoe gaan. Ben je nieuwsgierig
          waar in Nederland een naam voorkomt? Met de Toponamenzoeker zoek je in
          bijna 200.000 unieke namen uit de topografische bestanden en kaarten
          van het Kadaster (uit de{" "}
          <a
            href="http://www.kadaster.nl/brt"
            target="_blank"
            rel="noreferrer noopener"
          >
            Basisregistratie Topografie (BRT)
          </a>
          ). Je ziet gemeentenamen, maar ook namen van plaatsen, wegen, wateren,
          gebieden, gebouwen en allerlei andere Nederlandse objecten.
        </p>
        <p className="boldHeaderText">Zoek op twee manieren</p>

        <ol>
          <li>
            Typ in de zoekbalk hierboven een naam in. Er verschijnen namen die
            exact je zoekterm zijn, maar ook namen die je zoekterm bevatten. Wil
            je alleen de resultaten die precies gelijk zijn? Zet dan je zoekterm
            tussen dubbele aanhalingstekens (“ ”).
          </li>
          <li>
            Klik met je rechtermuisknop op een locatie op de kaart (bij een
            aanraakscherm je vinger twee seconden op de kaart houden) om alle
            namen in de buurt te zien.
          </li>
        </ol>
        <br />

        <p className="explainText">
          Als je een zoekresultaat aanklikt, krijg je aanvullende informatie
          over het bijbehorende object te zien. Bij welk object hoort de naam,
          wat is de functie, hoeveel inwoners heeft je stad of dorp, wat is de
          oppervlakte van een gebied?
        </p>

        <p className="boldHeaderText">Mis je nog een naam? Meld het ons!</p>
        <p className="explainText">
          Via{" "}
          <a
            href="http://www.verbeterdekaart.nl/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Verbeter de kaart
          </a>{" "}
          kun je onjuiste of ontbrekende namen terugmelden. Dankzij jouw hulp
          kunnen we onze bestanden en kaarten optimaliseren.
        </p>
        <p className="boldHeaderText">Meer van de BRT zien?</p>
        <p className="explainText">
          Kijk ook eens naar onze{" "}
          <a
            href="https://labs.kadaster.nl/cases/brt"
            target="_blank"
            rel="noreferrer noopener"
          >
            datastory’s
          </a>{" "}
          of maak met onze kaarten een reis door de tijd in{" "}
          <a
            href="http://www.topotijdreis.nl/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Topotijdreis
          </a>
          .
        </p>
        <p className="boldHeaderText">Over de Topo Namenzoeker</p>
        <p className="explainText">
          De Toponamenzoeker is ontwikkeld door het Kadaster. De applicatie
          maakt de grote verscheidenheid aan aardrijkskundige namen in de BRT
          zichtbaar en toegankelijk, en laat daarnaast de technische
          mogelijkheden van Linked Data zien. We zien graag je reactie op de
          Toponamenzoeker op het {" "}
          <a
            href="https://geoforum.nl/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geoforum.nl
          </a>
          .
        </p>
      </div>
    );
  }
}

export default StartScreen;
