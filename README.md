# Brt namen app  
Dit is een applicatie die brt objecten uit de brt haalt op basis van naam. Deze toont de applicatie hierna op de kaart.

## Veranderen van backend
Als je een backend wilt toevoegen moet je naar de Communicator.js class kijken.

## Problemen
- Layering van getekende polygonen.
- On Hover doet soms raar wanneer je over een provincie hovert.
- Brugnamen, sluis, knooppunt en tunnelnamen worden niet meegenomen wanneer je rechts klikt op de kaart.


## TODO
- Als er in de kaart twee vlakken over elkaar liggen en je klikt op het vlak, keuze geven welke van de twee je wilt selecteren

- Nog een correctie van mezelf: Waterdrager zit wel als brugnaam in de BRT. Je kunt dus wel op brugnamen van water zoeken, en ook op knooppuntnamen bijvoorbeeld. In het resultaat staat alleen “Naam Nederlands” i.p.v. “Brugnaam” of “Knooppuntnaam”. Misschien kan dat nog aangepast worden? Brugnamen en knooppuntnamen worden ook nog niet gevonden als je rechts klikt in de kaart.

- Aantal zoekresultaten weergeven boven de resultatenlijst

- Zoekopties bieden: optie om alleen op hele woorden, of op het exacte woord te zoeken. Zoeken met aanhalingstekens, plusjes etc. Dan zou je bijv. een resultaatkaartje kunnen genereren waar alleen jouw exacte zoekterm in voorkomt, om (als schermafbeelding) te kunnen gebruiken in een presentatie

- Naar aanleiding van vorige punt: zoektips toevoegen in de beschrijving

- Links in attributen naar Linked Data-URL’s blijken niet altijd te werken

- PDOK

- Elastic search

- PreProcessor.
