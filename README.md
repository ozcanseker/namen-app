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
- clusteren van waterlopen + straatnamen

- Brugnamen, sluis, knooppunt en tunnelnamen worden niet meegenomen wanneer je rechts klikt op de kaart.

- zoeken met plus.

- types objecten

- map cluster

- {
    Ik heb nog wel één bevinding. De pin wordt voor polygonen in het centroid gezet. Voor sommige langgerekte polygonen kan dit leiden tot een centroid buiten het polygoon zelf, zoals je op de 2 onderstaande screenshots ziet. Weet jij nog een manier om deze centroid binnen het polygoon zelf te krijgen?
  }
  
- {
    elastic search  
    extra versie simpel  
    begin eind exact and or  
    Waar er nog pipetekens | | voorkomen om namen heen, bijv. bij attribuut soortnaam, deze weglaten. Ze lijken vooral voor te komen in de Triply-dataset van 2016, dus misschien is dit probleem al verholpen als Triply wordt bijgewerkt met de actuele Linked Dataset van de BRT.  
    Naar aanleiding van vorige punt: zoektips toevoegen in de beschrijving
  }