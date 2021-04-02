const exchangeratesapi = require("@ittkm/exchangeratesapi").default;

// Please get your API Access Key at https://exchangeratesapi.io/
// and then replace here
const API_KEY = "1234567890abcdefghijklmnopqrstuv";

exchangeratesapiSamples();

async function exchangeratesapiSamples() {
  // Initialize with your API Key
  const api = new exchangeratesapi(API_KEY);

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
}
