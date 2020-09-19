# Finnish Inflexion Drill

This web-app lets users practice Finnish inflexion (conjugation and declension).
Data is scraped from a wiktionary dump first using [wikiextract](https://github.com/tatuylonen/wiktextract) and then [wiktfinnish](https://github.com/tatuylonen/wiktfinnish) to generate all the forms using the `build_vocab.py` script. Note that the version of `wiktfinnish` available on `pip` is not the latest one and will not work!

The website is created in React and hosted [here](https://tragram.github.io/finnish-inflexion-drill/). Note that I'm not a web developer, so the code might not be up to the current industry standards. :-) Pull requests are obviously welcome.

## Known bugs
* placeholder fort the input text is smaller and wrongly positioned
* website doesn't directly respond to changes in the settings (probably should check if the generated word complies with the settings and possibly generate a new one/different form)

## Features TO-DO
* add adjective gradation (comparative and superlative)
* disable auto-correct on mobile
* make , . - / work on mobile
* hide kotus and translation on mobile
* checkbox to choose whether to use only kotus types or most common words 
    * slider to select how common word is to be generated, in case of common words
* implementing keyboard shortcut to show kotus type (and keep it hidden as default)