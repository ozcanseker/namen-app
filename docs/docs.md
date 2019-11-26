# Brt namenzoeker  
  
## Inleiding  
Dit is de app documentatie. Hier wordt de algemene opzet van de applicatie beschreven.  
Voor documentatie over de code bekijk de inline comments. 
  
## Applicatie opbouw  
De applicatie is gemaakt met React. De applicatie gebruikt de MVC design principes.  
  
De applicatie bestaat uit drie lagen.   
- De View laag.  
- De Data laag.  
- De Communicator laag.  
  
![img](./img/img1.png)  
  
De view laag weet in principe niet wat er getoond wordt. Deze format niet zelf de teksten die geplaatst worden in de applicatie.
  
De Data laag zijn een aantal classen die dienen als containers. Deze worden gevuld met data en gelezen door de front-end.  
  
De communication doet sparql requesten naar verschillende endpoints. Deze requesten worden gerequest door de gebruiker via 
de view laag. 

Ook heeft deze laag een file met methodes(ProcessorMethods).
Deze file bevat methodes die de Communication en View laag gebruiken. De View laag roept deze methodes aan om aantal dingen af te weten zonder dat de a view laag implementatie details bevat.

## Veranderen van backend  
Om van backend te veranderen moet de communicatie laag verandert worden. De methodes die nu al geimplementeert zijn moeten opnieuw
geschreven worden. Deze methodes zijn:  
- Communicator  
  - getOptions()  
  - getMatch()  
  - getAllAttribtes()  
  - getFromCoordinates()  
  
- ProcessorMethods  
  - isShownClickedResults()  
  - sortByObjectClass()  
  - checkIfMarkerShouldBePlaces()  
  - resetMapVariables()  
  
### getOptions()  
Hier kan je verschillende backend opties aangeven die de applicatie kan gebruiken. Als je er maar 1tje meegeeft verdwijnt het tandwieltje links onder in.
Als je dit er helemaal uit wilt halen, moet je de in de App.js in de render methode de gearicon eruit halen.
  
### getMatch()
Dit is de methode die de View laag aanroept wanneer deze iets ingetypt krijgt van de gebruiker. Je krijgt een string. Aan de hand van deze string kan je dus een search query opstellen.
De front end verwacht een lijst met Resultaat.js objecten.
  
### Resultaat.js
Dit zijn de resultaten die aan de zijkant worden getoond. Deze class bevat de waarden : url , naam, type, geoJson, color, objectClass.
Color is de kleur die getoond wordt op de kaart. Dit kunnen één van de volgende kleuren zijn : turqoise, purple, green, red, pink, blue, orange, yellow en mediumaquamarine. De objectClass is bijv gebouw. 
  
## getAllAttribtes()  
Deze methode wordt aangeroepen als er op een object wordt geklikt. Deze methode krijgt een ClickedResultaat.js object terug waarop is geklikt.
Dus vanaf de uri kan je weer alle andere attributen ophalen. De applicatie verwacht dat je deze attributen met de loadInAttributes() aanvult. De methode verwacht de volgende argumenten : 
naam, naamOfficieel, naamnl, naamfries, type, overige, burgNaam, tunnelNaam, sluisNaam, knoopPuntNaam.  
  
De namen zijn verschillende namen die het object kan hebben. De type is de het type object. Overige zijn alle overige attributen. **De type en overige zijn array's**

## getFromCoordinates()   
Wanneer de gebruiker met de rechter muisknop op de kaart klikt wordt deze methode aangeroepen. Je krijgt de volgende argumenten: lat, long, top, left, bottom, right.  
  
De lat en long zijn de coordinaten waar is geklikt. De top, left, bottom, right zijn de coordinaten van de viewbox.

## isShownClickedResults()  
Dit is een methode die wordt aangeroepen wanneer de kaart de rechter muisknop objecten wilt tonen. Hier kan je dus dingen eruit filteren, Ik vond het bijvoorbeeld niet mooi om provincies ook te tonen wanneer er met de rechter muisknop op de kaart wert geklikt.

## sortByObjectClass()  
De naam van deze methode is slecht. Deze methode wordt aangeroepen om de layering te bepalen. In de methode kan je bijvoorbeeld de provincies naar beneden layeren waardoor deze helemaal onderin worden getoond.

## checkIfMarkerShouldBePlaces()  

## resetMapVariables()

