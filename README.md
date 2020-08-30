# Finnish Inflexion Drill

This web-app lets users practice Finnish inflexion (conjugation and declension).
Data is scraped from a wiktionary dump first using [wikiextract](https://github.com/tatuylonen/wiktextract) and then [wiktfinnish](https://github.com/tatuylonen/wiktfinnish) to generate all the forms using the `build_vocab.py` script. Note that the version of wiktfinnish available on pip is not the latest one and will not work!

The website is created in React and hosted [here](https://tragram.github.io/finnish-inflexion-drill/). Note that I'm not a web developer, so the code might not be the current industry standards. :-) Pull requests are obviously welcome.

## Known bugs
* text might be too long to show on the cards
* website is totally broken on mobile devices

## Features TO-DO
* kotus words checkbox & slider to select how common word is to be generated
* implementing keyboard shortcuts
    * to show a hint (show kotus type/next letter)
    * show next word
    * show the answer
* add conjugation
* add adjective gradation (comparative and superlative)