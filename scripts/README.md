
Importing into application
==========================

Use this command from the script folder, with the Meteor server running, to import the cards into the Cards collection.
You will need the mongo tools installed to use the mongoimport command.

```
mongoimport -h localhost:3001 --drop --db meteor --collection Cards --type json --file cards.json --jsonArray
```
