# Free client for exchangeratesapi.io

[![npm version](https://img.shields.io/npm/v/@ittkm/exchangeratesapi.svg)](https://www.npmjs.com/package/@ittkm/exchangeratesapi)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](./LICENSE)
[![Build Status](https://travis-ci.org/itTkm/exchangeratesapi.svg?branch=main)](https://travis-ci.org/itTkm/exchangeratesapi)
[![Coverage Status](https://coveralls.io/repos/github/itTkm/exchangeratesapi/badge.svg?branch=main)](https://coveralls.io/github/itTkm/exchangeratesapi?branch=main)

This is client of [Exchangerates API](https://exchangeratesapi.io/) with your free subscription plan.  
You can perform 'Source Currency Switching', 'Currency Conversion' and 'Time-Frame Queries' at no cost.

Exchangerates API ( https://exchangeratesapi.io/ ) became a registration system from April 2021, and the following functions can not be used without a paid subscription.

- Source Currency Switching
- Currency Conversion
- Time-Frame Queries

With this package, you can get the same response as the paid function above with a free API key.

## Installation

```bash
# via npm
npm install --save @ittkm/exchangeratesapi

# via yarn
yarn add @ittkm/exchangeratesapi
```

## Usage

```js
import exchangeratesapi from "@ittkm/exchangeratesapi";
// // or
// const exchangeratesapi = require("@ittkm/exchangeratesapi").default;

// Please get your API Access Key at https://exchangeratesapi.io/
// and then replace here
const API_KEY = "1234567890abcdefghijklmnopqrstuv";

async function exchangeratesapiSamples() {
  // Initialize with your API Key
  const api = new exchangeratesapi(API_KEY);

  // Call the API you want to run
  const exchangeRates = await api.latest();
  console.dir(exchangeRates);
}
```

## Sample calls

Here are some examples:

```js
/**
 * Latest Rates (with default settings)
 *  - Source Currency: EUR
 *  - Symbols: All symbols
 */
console.dir(await api.latest());

/**
 * Latest Rates (with Parameters)
 *  - Source Currency: USD
 *  - Symbols: GBP, JPY, EUR
 */
const latestParameters = {
  base: "USD",
  symbols: ["GBP", "JPY", "EUR"],
};
console.dir(await api.latest(latestParameters));

/**
 * Historical Rates (with default settings)
 *  - Get latest rates
 *  - Source Currency: EUR
 *  - Symbols: All symbols
 */
console.dir(await api.historical({}));

/**
 * Historical Rates (with Parameters)
 *  - Date: 2013-12-24
 *  - Source Currency: GBP
 *  - Symbols: USD, CAD, EUR
 */
const historicalParameters = {
  date: "2013-12-24",
  base: "GBP",
  symbols: ["USD", "CAD", "EUR"],
};
console.dir(await api.historical(historicalParameters));

/**
 * Convert (use latest rates)
 *  - Convert from GBP to JPY
 *  - amount: 25
 */
console.dir(
  await api.convert({
    from: "GBP",
    to: "JPY",
    amount: 25,
  })
);

/**
 * Convert (use historical rates)
 *  - Convert from GBP to JPY
 *  - amount: 25
 *  - Date: 2018-02-22
 */
const convertParameters = {
  from: "GBP",
  to: "JPY",
  amount: 25,
  date: "2018-02-22",
};
console.dir(await api.convert(convertParameters));

/**
 * Time-Series (with minimum options)
 *  - Symbols: All symbols
 */
console.dir(
  await api.timeseries({
    start_date: "2012-05-01",
    end_date: "2012-05-03",
  })
);

/**
 * Time-Series (with limit currencies)
 *  - Source Currency: EUR
 *  - Symbols: USD, AUD, CAD
 */
const timeseriesParameters = {
  start_date: "2012-05-01",
  end_date: "2012-05-03",
  base: "EUR",
  symbols: ["USD", "AUD", "CAD"],
};
console.dir(await api.timeseries(timeseriesParameters));
```

## Response

The format of the response is compatible with the original [Exchangerates API](https://exchangeratesapi.io/).

See the [official documentation](https://exchangeratesapi.io/documentation/) for details.

## Examples

After having cloned this repository, run the following commands:

```bash
# Please define your API Access Key on the '.env' file
cp .env.example .env
vi .env

# Initialize the example project
cd example/ && npm install

# Excecute example
npm run import-sample
# # or
# npm run require-sample
```

## License

This library is licensed under the [MIT License](./LICENSE).
