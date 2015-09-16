# psyder-server
Psyder. What el.se to say.

## API

Der Server bietet eine HTTP-API.

In jeden Query können folgende Parameter mitgesendet werden:
 - ***sessionId*** (*String*) optional; beinhaltet die ID der Session und ermöglicht es dem Nutzer, sich gegenüber der Website anzumelden

Jede Antwort ist in JSON Strukturiert. Die hier dokumentierten Antworten stehen im "data"-Unterobjekt. Außerhalb dessen kann jede Antwort folgende Daten beinhalten:
 - ***status*** (*String*) beinhaltet den Status, im Erfolgsfall "success"
 - ***error*** (*String*) beinhaltet eine Fehlermeldung



### Board (2)

#### BoardAdd

Erstellt ein neues Forum.
Benötigt Administratorrechte.

Parameter:
 - ***label*** (*String*) die Bezeichnung für das Forum
 - ***description*** (*String*) optional; die Beschreibung für das Forum; Standardwert: `null`
 - ***usergroups*** (*String[]*) die IDs der Benutzergruppen, welche auf das Forum zugreifen können sollen
 - ***parentId*** (*String*) optional; die ID des übergeordneten Forums

Antwort:
 - ***boardId*** (*String*) beinhaltet die ID des gerade erstellten Forums

#### BoardList

Listet alle Foren auf.

Parameter:
 - ***boardId*** (*String*) optional; wenn übergeben, werden alle Foren aufgelistet, welche in diesem übergeordneten Forum sind

Antwort:
 - ***boards*** (*model.Board[]*) die gefundenen Foren




### Thread (1)

#### ThreadAdd

Erstellt einen neuen Thread und den dazu gehörigen Startpost.

Parameter:
 - ***label*** (*String*) beinhaltet den Namen des Threads
 - ***content*** (*String*) der Inhalt des Startsposts
 - ***boardId*** (*String*) die ID des Forums, in dem der Thread erstellt wird

Antwort:
 - ***threadId*** (*String*) die ID des erstellten Threads
 - ***postId*** (*String*) die ID des erstellten Startposts




### User (2)

#### UserAdd

Erstellt ein Benutzerkonto.

Parameter:
 - ***name*** (*String*) der Name des Nutzers
 - ***password*** (*String*) das Passwort des Nutzers
 - ***email*** (*String*) die E-Mail Adresse des Nutzers
 - ***bot*** (*Integer*) optional; wenn 1, dann wird aus diesem Benutzerkonto ein Bot-Account für API-Zugriff; Standardwert: 0

Antwort:
 - ***userId*** (*String*) die ID des erstellten Benutzers


#### UserLogin

Ermöglicht es dem Nutzer, sich anzumelden.

Parameter:
 - ***name*** (*String*) der Name des Nutzers
 - ***password*** (*String*) das Passwort des Nutzers

Antwort:
 - ***sessionId*** (*String*) die ID der Session, in die der Nutzer angemeldet wurde



### Usergroup (2)

#### UsergroupAdd

Erstellt eine neue Benutzergruppe.

Parameter:
 - ***label*** (*String*) der Name der Gruppe

Antwort:
 - ***usergroupId*** (*String*) die ID der Benutzergruppe, die gerade erstellt wurde


#### UsergroupUpdate

Aktualisiert eine neue Benutzergruppe.

Parameter:
 - ***label*** (*String*) der neue Name der Gruppe
