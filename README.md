# betfair-api-node
#
Node wrapper for the betfair api

## Installation

In your project, install the package: `npm install betfair-api-node --save`

## Usage

```
var Betfair = require('betfair-api'),
    betfair = new Betfair('APPKEY', 'USERNAME', PASSWORD);


betfair.getEvents({
    "competitionIds":["31"]
}).then((response) => {
    console.log(response);
});

betfair.getMarketCatalogue({
    "eventIds": [EVENT_ID]
}, "50").then((response) => {
    console.log(response);
})
```
