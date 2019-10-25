#Brt namen app
Dit is een applicatie die brt objecten uit de brt haalt op basis van naam. Deze toont de applicatie hierna op de kaart.

## Veranderen van backend
Als je wilt veranderen van backend hoef je alleen de communicator class aan te passen.
De communicator heeft de functies getMatch en getAllAttribtes die erin moeten blijven. De code in deze functies kan worden aangepast. 
  
- De getMatch functie geeft een array met Resultaat.js objecten terug.  
- De getAllAttribtes krijgt een ClickedResultaat en deze moet je vullen met attributen. 


## Problemen
- Layering van getekende polygonen.
- On Hover doet soms raar wanneer je over een provincie hovert.