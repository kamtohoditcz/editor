KamToHodit.cz BE
================

node:

 * git clone
 * npm i
 * node index.js
 * localhost:3000

elastic:
 * run it on localhost:9200 (default)
 * put some document into it (i use Chrome PostMan extension). I used the following document as an example: 

```
PUSH localhost:9200/odpady/odpadek/

{
    "name": "krabice od pizzy", 
    "aliasses": ["pizza krabice"],
    "creation_date": "Thu Apr 28 21:28:15 CEST 2016", 
    "last_edit_date": "Thu Apr 28 21:28:15 CEST 2016", 
    "content": "Pokud neni vyrazne mastna, muze se hodit do papiru. Vetsinou vsak pujde do smesneho odpadu."
}
```

;) 
