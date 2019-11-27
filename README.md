# Brt namen app  
Dit is een applicatie die brt objecten uit de brt haalt op basis van naam. Deze toont de applicatie hierna op de kaart.

## Gebruikshandleiding
De gebruiker kan op verschillende manieren data ophalen. De gebruiker kan op een naam zoeken of met de rechter muis knop op de kaart klikken.
Ook kan de gebruiker van endpoint veranderen. Dit doet de gebruiker door links onderin op de tandwiel te klikken. Hier kan de gebruiker tussen verschillende
endpoints kiezen. 

## Links
- De applicatie staat online [hier](https://ozcanseker.github.io/namen-app).
- de [Docs](./docs/docs.md) beschrijven hoe de applicatie is opgezet en wat je moet veranderen om van backend te veranderen.  

## TODO's
- Brugnamen, sluis, knooppunt en tunnelnamen worden niet meegenomen wanneer je rechts klikt op de kaart.
 
- Aantal zoekresultaten weergeven boven de resultatenlijst

- Zoekopties bieden: optie om alleen op hele woorden, of op het exacte woord te zoeken. Zoeken met aanhalingstekens, plusjes etc. Dan zou je bijv. een resultaatkaartje kunnen genereren waar alleen jouw exacte zoekterm in voorkomt, om (als schermafbeelding) te kunnen gebruiken in een presentatie

- Naar aanleiding van vorige punt: zoektips toevoegen in de beschrijving

- Goed documenteren + zoveel mogelijk opzetten van de data

- Is het bijv. een optie om de zoomknopjes anders in te bouwen, zodat de nieuwe iPads niet de neiging hebben dat knopje te selecteren? Ik weet niet wat op die nieuwe iPads dat zoomknopje triggert, misschien kun jij dat achterhalen?

{
	elastic search  
	extra versie simpel  
	begin eind exact and or  
	Waar er nog pipetekens | | voorkomen om namen heen, bijv. bij attribuut soortnaam, deze weglaten. Ze lijken vooral voor te komen in de Triply-dataset van 2016, dus misschien is dit probleem al verholpen als Triply wordt bijgewerkt met de actuele Linked Dataset van de BRT.  
}