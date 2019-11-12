# Brt namen app  
Dit is een applicatie die brt objecten uit de brt haalt op basis van naam. Deze toont de applicatie hierna op de kaart.

## Veranderen van backend
Als je een backend wilt toevoegen moet je naar de Communicator.js class kijken.

## Problemen
- Layering van getekende polygonen.
- On Hover doet soms raar wanneer je over een provincie hovert.
- Brugnamen, sluis, knooppunt en tunnelnamen worden niet meegenomen wanneer je rechts klikt op de kaart.


## TODO
-   Goed idee om met verschillende kleuren te werken, per objectklasse lijkt me prima. 

- Als ik kies voor PDOK sparql en daarmee ga zoeken, valt op dat als ik een resultaat aanklik, weer de objectklasse (bijv. Plaats) verschijnt i.p.v. het type object (bijv. Woonkern). In de lijst met resultaten en in het label in de kaart staat wel het type trouwens. Er is ook iets vreemds aan de hand met de ja/nee-attributen BAG-woonplaats en bebouwde kom. Deze staan in PDOK sparql altijd op nee. In Triply gaat het wel goed.

- Je kunt met de actuele dataset mooi zien wat er de afgelopen jaren aan namen is bijgekomen. Probeer bijv. in PDOK sparql eens Dorpsstraat als zoekterm. De hele kaart loopt vol, terwijl in Triply er maar een beperkt aantal resultaten tevoorschijn komt. En ik kan me voorstellen dat het nog niet eens alle dorpsstraten zijn, waarschijnlijk loop je tegen het maximumaantal resultaten aan? Minpuntje is inderdaad ook dat het soms wel even duurt voordat je de resultaten in beeld krijgt. Bij Triply lijkt het nu ook langer te duren trouwens, zou dat kunnen?

- Ik zie dat we ook een fout in de BRT hebben ontdekt. Dat je Waterdrager (de naam van een aquaduct) wel kunt vinden, terwijl je nog niet op brugnamen kunt zoeken, komt doordat die naam ten onrechte als Nederlandse naam van het waterdeel in de BRT staat en niet als brugnaam van het waterdeel, zoals het hoort.
 
- Kleine bug in het zoeken op de kaart nog: sommige objecten verschijnen in de resultaten, terwijl ze niet in de buurt liggen van de plek waar je rechts geklikt hebt. Dit geldt o.a. voor het vlak Noordzeekustzone, het vlak Waddenzee en voor het Rembrandt windturbinepark. Die laatste is een multipart met een vlak bij Coevorden, een vlak in het Westland en een vlak bij Vlissingen, waardoor het prikkertje bij Utrecht staat. Misschien dat het systeem daardoor in de war raakt. Het blijkt wel te kloppen: https://www.duurzaaminvesteren.nl/Projecten/Propositiedetail/PropositionID/29/Title/windpark-rembrandt (zie onder Beschrijving van het windpark) 

- Nog een correctie van mezelf: Waterdrager zit wel als brugnaam in de BRT. Je kunt dus wel op brugnamen van water zoeken, en ook op knooppuntnamen bijvoorbeeld. In het resultaat staat alleen “Naam Nederlands” i.p.v. “Brugnaam” of “Knooppuntnaam”. Misschien kan dat nog aangepast worden? Brugnamen en knooppuntnamen worden ook nog niet gevonden als je rechts klikt in de kaart.

- Aantal zoekresultaten weergeven boven de resultatenlijst

- Zoekopties bieden: optie om alleen op hele woorden, of op het exacte woord te zoeken. Zoeken met aanhalingstekens, plusjes etc. Dan zou je bijv. een resultaatkaartje kunnen genereren waar alleen jouw exacte zoekterm in voorkomt, om (als schermafbeelding) te kunnen gebruiken in een presentatie

- Naar aanleiding van vorige punt: zoektips toevoegen in de beschrijving

- Als er in de kaart twee vlakken over elkaar liggen en je klikt op het vlak, keuze geven welke van de twee je wilt selecteren

- Links in attributen naar Linked Data-URL’s blijken niet altijd te werken

- PDOK

- Elastic search

- kleinere dingen eerst

- PreProcessor.
