import React from 'react';

/**
 * Start scherm met de stuk tekst.
 */
class StartScreen extends React.Component {
    render() {
        return (
            <div className="startScreen">
                <p className="boldHeaderText">Zoek je een naam? Je vindt ‘m hier!</p>
                <p className="explainText">
                    In de Topo Namenzoeker kun je zoeken op alle namen die in de topografische bestanden en kaarten van
                    het Kadaster aanwezig zijn. Aardrijkskundige namen zijn onmisbaar om te beschrijven waar we zijn,
                    waar we vandaan komen en waar we naartoe gaan. In de <a href="http://www.kadaster.nl/brt"
                                                                            target="_blank" rel="noreferrer noopener">Basisregistratie
                    Topografie (BRT)</a>,
                    die het Kadaster beheert en bijhoudt, registreren we namen van gemeenten, plaatsen, wegen, wateren,
                    gebieden, gebouwen en allerlei andere objecten in Nederland. In deze applicatie vind je ze,
                    mét het bijbehorende object en aanvullende informatie.
                </p>
                <p className="boldHeaderText">Hoe werkt het?</p>
                <p className="explainText">
                    Je kunt op twee manieren zoeken:
                </p>

                <ol>
                    <li>
                        Tik in het zoekveld hierboven een naam in en de resultaten verschijnen direct in een lijst
                        én
                        als object in de kaart hiernaast. Je vindt namen die exact gelijk zijn aan je zoekterm, maar
                        ook namen die je zoekterm bevatten. Wil je alleen exact zoeken, zet je zoekterm dan tussen “”.
                        Hou er wel rekening mee dat het bij veel voorkomende namen
                        even kan duren voor alle objecten in beeld verschijnen.
                    </li>
                    <li>
                        Of klik met je rechtermuisknop in de kaart (bij een aanraakscherm je vinger twee seconden op de
                        kaart houden) en alle objecten met een naam in de buurt
                        verschijnen
                        in de kaart en in een lijst met resultaten. Zo kun je elke naam vinden, zelfs als je ‘m nog
                        niet
                        kent!
                    </li>
                </ol>
                <br/>

                <p className="explainText">
                    Als je een zoekresultaat aanklikt, krijg je aanvullende informatie over het bijbehorende object te
                    zien. Bij welk object hoort de naam, wat is de functie, hoeveel inwoners heeft je stad of dorp, wat
                    is de oppervlakte van een gebied? De antwoorden vind je hier.
                </p>

                <p className="explainText">
                    De Basisregistratie Topografie wordt jaarlijks volledig geactualiseerd. De Topo Namenzoeker maakt
                    gebruik van de actuele dataset van de BRT.
                </p>

                <p className="boldHeaderText">Mis je nog een naam? Meld het ons!</p>
                <p className="explainText">
                    Via <a href="http://www.verbeterdekaart.nl/" target="_blank" rel="noreferrer noopener">Verbeter de
                    kaart</a> kun je onjuiste of ontbrekende
                    namen terugmelden.
                    Dankzij jouw hulp kunnen we onze bestanden en kaarten nog beter en completer maken.
                </p>
                <p className="boldHeaderText">Meer van de BRT zien?</p>
                <p className="explainText">
                    Kijk ook eens naar onze <a href="https://labs.kadaster.nl/cases/brt" target="_blank"
                                               rel="noreferrer noopener">datastory’s</a> of maak met
                    onze kaarten een reis door de tijd in <a href="http://www.topotijdreis.nl/" target="_blank"
                                                             rel="noreferrer noopener">Topotijdreis</a>.
                </p>
                <p className="boldHeaderText">Over de Topo Namenzoeker</p>
                <p className="explainText">
                    De Topo Namenzoeker is ontwikkeld door het Kadaster. De applicatie maakt de grote verscheidenheid
                    aan aardrijkskundige namen in de Basisregistratie Topografie zichtbaar en toegankelijk, en laat
                    daarnaast de technische mogelijkheden van Linked Data zien. We zien graag je reactie op de Topo
                    Namenzoeker op het <a
                    href="https://geoforum.nl/" target="_blank"
                    rel="noreferrer noopener">Geoforum.nl</a>.
                </p>
            </div>
        )
    }
}

export default StartScreen;