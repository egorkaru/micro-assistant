#🤖micro-assistant💬 
> Micro (by Zeit) + Actions SDK for Google Assistant = 💗

## Installation

```bash
$ npm install --save micro-assistant
```

## Usage

```js
const assist = require('micro-assistant') 
const { ActionsSdkApp } = require('actions-on-google') // Distributed separately


module.exports = assist (async (req, res) => {
  const app = new ActionsSdkApp({request: req, response: res});
  // ...
}

```