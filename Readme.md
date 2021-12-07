# Spell checker API
[![Netlify Status](https://api.netlify.com/api/v1/badges/1604666c-21ae-4ec5-abb3-8dec3a53ca09/deploy-status)](https://app.netlify.com/sites/spelltext/deploys)

Free online ****spell**** **checker** (With [Yandex Speller Api](https://yandex.ru/dev/speller/))

You can open App on [this link](https://spelltext.netlify.app/)

## How to use

**Upload** *.txt file (Post method)

**Media type** : multipart/form-data

```
https://spella.herokuapp.com/api/upload
```

or `yarn start `

```
http://localhost:5000/api/upload
```

**Response from server:**

**Type**: text/plain

**Body**: text
