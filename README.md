WBA2SS18SalzmannDikHorst

# Exposé  						      

## Darstellung des Problemraums

Menschen lieben Musik. Musikgeschmäcker unterscheiden sich allerdings oft gewaltig, selbst im eigenen Freundeskreis. Sich über die gleichen Musiker auszutauschen und gemeinsam auf Konzerte zu gehen ist dann oft schwierig. Leute mit dem selben Musikgeschmack zu finden oder Menschen für ein Konzert zu überreden erweist sich als mühsam.  

# Dokumentation

## Tastescores

### Attribute

id, useruri1, useruri2, score, artist_name(array), artist_uri(array)

### REQUESTS & RESPONSE

GET /tastescore - gibt alle Tastescores in einer JSON zurück
GET /tastescore/{id} - gibt einen Tastescore mit der entsprechenden ID als JSON zurück
DEL /tastescore/{id} - löscht einen bestimmten Tastescore
DEL /tastescore/all - löscht alle Tastescores aus der JSON 

## User

### Attribute

id, name, uri, artist_name(array), artist_uri(array)

### REQUESTS & RESPONSE

GET /user - gibt alle User in einer JSON zurück
GET /user/{uri} - gibt einen User mit der entsprechenden URI als JSON zurück
DEL /user/{uri} - löscht einen bestimmten User per URI
DEL /user/{id} - löscht einen bestimmten User per ID
PCH /user/{id} - einen User Eintrag per ID ändern

## Login

### REQUESTS & RESPONSE

/login (Browser) - öffnet die Spotify-Login-Seite 

Beim einloggen wird automatisch der neue User angelegt und es werden Tastescores mit den vorhandenen Usern erstellt. 


