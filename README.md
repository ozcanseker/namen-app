# Brt namen app  
Dit is een applicatie die brt objecten uit de brt haalt op basis van naam. Deze toont de applicatie hierna op de kaart.

## Veranderen van backend
Als je een backend wilt toevoegen moet je naar de Communicator.js class kijken.

## Problemen
- Layering van getekende polygonen.
- On Hover doet soms raar wanneer je over een provincie hovert.
- Brugnamen, sluis, knooppunt en tunnelnamen worden niet meegenomen wanneer je rechts klikt op de kaart.

## TODO
- Misschien kan dat nog aangepast worden? Brugnamen en knooppuntnamen worden ook nog niet gevonden als je rechts klikt in de kaart.
 
//- Aantal zoekresultaten weergeven boven de resultatenlijst

//- Zoekopties bieden: optie om alleen op hele woorden, of op het exacte woord te zoeken. Zoeken met aanhalingstekens, plusjes etc. Dan zou je bijv. een resultaatkaartje kunnen genereren waar alleen jouw exacte zoekterm in voorkomt, om (als schermafbeelding) te kunnen gebruiken in een presentatie

//- Naar aanleiding van vorige punt: zoektips toevoegen in de beschrijving

- Goed documenteren + zoveel mogelijk opzetten van de data

- filter exact match to the top

{
	elastic search
	extra versie simpel
	begin eind exact and or
	- Waar er nog pipetekens | | voorkomen om namen heen, bijv. bij attribuut soortnaam, deze weglaten. Ze lijken vooral voor te komen in de Triply-dataset van 2016, dus misschien is dit probleem al verholpen als Triply wordt bijgewerkt met de actuele Linked Dataset van de BRT.
}
