import React from 'react';

class StartScreen extends React.Component {
    render() {
        return(
            <div className="startScreen">
                <p className="boldHeaderText">Wat is het?</p>
                <p className="explainText">Dit is een applicatie die objecten uit de brt haalt. Denk hierbij
                    aan buurten, straaten, meren en zelf bomen. Deze objecten hebben allemaal een naam.
                    Aan de hand van deze naam kan je de objecten ophalen. Deze objecten hebben ook andere
                    eigenschappen die je kunt bekijken.</p>
                <p className="boldHeaderText">Wie doe dit?</p>
                <p className="explainText">brt</p>
                <p className="boldHeaderText">Hoe werkt het?</p>
                <p className="explainText">Deze applicatie kan op twee manieren aangestuurd worden. Je kan
                    een naam zoeken in het
                    zoekveld. Je kan ook dubbel klikken op de kaart om de nabije namen op te vragen.</p>
            </div>
        )
    }
}

export default StartScreen;