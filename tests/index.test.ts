import exchangeratesapi, {
  IExchangeratesapiConvertParams,
  IExchangeratesapiParams,
  IExchangeratesapiTimeseriesParams,
} from "../src/index";

require("dotenv").config();
const API_KEY = process.env.API_KEY ? process.env.API_KEY : "";

const DEFAULT_BASE = "EUR";

/**
 * Constructor
 */
describe("Constructor", (): void => {
  test("should throw error with empty API key.", async (): Promise<void> => {
    expect(() => new exchangeratesapi("")).toThrow();
  });

  test("should not throw error with API key.", async (): Promise<void> => {
    expect(() => new exchangeratesapi(API_KEY)).not.toThrow();
  });
});

/**
 * latest API
 */
describe("latest API", (): void => {
  test("should throw error with invalid API key.", async (): Promise<void> => {
    const api = new exchangeratesapi("This is invalid API key");
    await expect(api.latest()).rejects.toThrow();
  });

  const api = new exchangeratesapi(API_KEY);
  test("in case of no options", async (): Promise<void> => {
    const response = await api.latest();
    expect(response.base).toBe(DEFAULT_BASE);
  });

  test("in case of exists options", async (): Promise<void> => {
    const params: IExchangeratesapiParams = {
      base: "USD",
      symbols: "JPY",
    };
    const response = await api.latest(params);
    expect(response.base).toBe(params.base);
  });
});

/**
 * historical API
 */
describe("historical API", (): void => {
  const api = new exchangeratesapi(API_KEY);

  test(`base is '${DEFAULT_BASE}' if not defined`, async (): Promise<void> => {
    const response = await api.historical({});
    expect(response.base).toBe(DEFAULT_BASE);
  });

  test("in case of string symbols", async (): Promise<void> => {
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      symbols: "JPY",
    };
    const response = await api.historical(params);
    expect(response.base).toBe(DEFAULT_BASE);
    expect(Object.keys(response.rates).length).toBe(1);
  });

  test("in case of array symbols", async (): Promise<void> => {
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      symbols: ["JPY", "USD"],
    };
    const response = await api.historical(params);
    expect(response.base).toBe(DEFAULT_BASE);
    expect(Object.keys(response.rates).length).toBe(params.symbols!.length);
    if (typeof params.symbols === "object") {
      params.symbols.forEach((symbol) => {
        expect(symbol in response.rates).toBe(true);
      });
    }
  });

  test("in case of array symbols, included invalid symbol", async (): Promise<void> => {
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      symbols: ["JPY", "USD", "BBB"],
    };
    const response = await api.historical(params);
    expect(response.base).toBe(DEFAULT_BASE);
    expect(Object.keys(response.rates).length).toBe(params.symbols!.length - 1);
    if (typeof params.symbols === "object") {
      params.symbols.forEach((symbol) => {
        if (symbol !== "BBB") {
          expect(symbol in response.rates).toBe(true);
        } else {
          expect(symbol in response.rates).toBe(false);
        }
      });
    }
  });

  test("in case of base defined", async (): Promise<void> => {
    const base = "USD";
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      base: base,
    };
    const response = await api.historical(params);
    expect(response.base).toBe(base);
  });

  test("in case of base defined, and symbols included base symbol", async (): Promise<void> => {
    const base = "USD";
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      base: base,
      symbols: ["JPY", "EUR", base],
    };
    const response = await api.historical(params);
    expect(response.base).toBe(base);
    expect(Object.keys(response.rates).length).toBe(params.symbols!.length);
    if (typeof params.symbols === "object") {
      params.symbols.forEach((symbol) => {
        expect(symbol in response.rates).toBe(true);
      });
    }
  });

  test("in case of invalid base symbol, should throw error", async (): Promise<void> => {
    const base = "AAA";
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      base: base,
      symbols: ["JPY", "EUR"],
    };
    await expect(api.historical(params)).rejects.toThrow();
  });

  test("in case of base defined and invalid symbol, should throw error", async (): Promise<void> => {
    const base = "USD";
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      base: base,
      symbols: "BBB",
    };
    await expect(api.historical(params)).rejects.toThrow();
  });

  test("in case of invalid symbols, should throw error", async (): Promise<void> => {
    const base = "USD";
    const params: IExchangeratesapiParams = {
      date: "2013-12-24",
      base: base,
      symbols: ["BBB"],
    };
    await expect(api.historical(params)).rejects.toThrow();
  });
});

/**
 * convert API
 */
describe("convert API", (): void => {
  const api = new exchangeratesapi(API_KEY);

  test("with latest rates", async (): Promise<void> => {
    const params: IExchangeratesapiConvertParams = {
      from: "GBP",
      to: "JPY",
      amount: 25,
    };
    const response = await api.convert(params);
    expect(response.success).toBe(true);
  });

  test("with historical rates", async (): Promise<void> => {
    const params: IExchangeratesapiConvertParams = {
      date: "2013-12-24",
      from: "GBP",
      to: "JPY",
      amount: 25,
    };
    const response = await api.convert(params);
    expect(response.success).toBe(true);
  });

  test("in case of invalid from symbols, should throw error", async (): Promise<void> => {
    const params: IExchangeratesapiConvertParams = {
      from: "AAA",
      to: "JPY",
      amount: 25,
    };
    await expect(api.convert(params)).rejects.toThrow();
  });

  test("in case of invalid to symbols, should throw error", async (): Promise<void> => {
    const params: IExchangeratesapiConvertParams = {
      from: "GBP",
      to: "BBB",
      amount: 25,
    };
    await expect(api.convert(params)).rejects.toThrow();
  });
});

/**
 * timeseries API
 */
describe("timeseries API", (): void => {
  const api = new exchangeratesapi(API_KEY);

  test("in case of minimum options", async (): Promise<void> => {
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-01",
      end_date: "2012-05-03",
    };
    const response = await api.timeseries(params);
    expect(response.success).toBe(true);
    expect(params.start_date in response.rates).toBe(true);
    expect(params.end_date in response.rates).toBe(true);
  });

  test("incase of base and array symbols", async (): Promise<void> => {
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-01",
      end_date: "2012-05-03",
      base: "USD",
      symbols: ["JPY", "EUR"],
    };
    const response = await api.timeseries(params);
    expect(response.success).toBe(true);
    expect(params.start_date in response.rates).toBe(true);
    expect(params.end_date in response.rates).toBe(true);
    expect(Object.keys(response.rates[params.start_date]).length).toBe(
      params.symbols!.length
    );
    expect(response.base).toBe("USD");
    if (typeof params.symbols === "object") {
      params.symbols.forEach((symbol) => {
        expect(symbol in response.rates[params.start_date]).toBe(true);
      });
    }
  });

  test("incase of base and array symbols, included invalid symbol", async (): Promise<void> => {
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-01",
      end_date: "2012-05-03",
      base: "USD",
      symbols: ["JPY", "EUR", "BBB"],
    };
    const response = await api.timeseries(params);
    expect(response.success).toBe(true);
    expect(params.start_date in response.rates).toBe(true);
    expect(params.end_date in response.rates).toBe(true);
    expect(Object.keys(response.rates[params.start_date]).length).toBe(
      params.symbols!.length - 1
    );
    expect(response.base).toBe("USD");
    if (typeof params.symbols === "object") {
      params.symbols.forEach((symbol) => {
        if (symbol !== "BBB") {
          expect(symbol in response.rates[params.start_date]).toBe(true);
        } else {
          expect(symbol in response.rates[params.start_date]).toBe(false);
        }
      });
    }
  });

  test("end_date is older than the start_date, should throw error", async (): Promise<void> => {
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-03",
      end_date: "2012-05-01",
    };
    await expect(api.timeseries(params)).rejects.toThrow();
  });

  test("in case of invalid base symbols, should throw error", async (): Promise<void> => {
    const base = "AAA";
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-01",
      end_date: "2012-05-03",
      base: base,
      symbols: ["JPY", "EUR"],
    };
    await expect(api.timeseries(params)).rejects.toThrow();
  });

  test("in case of invalid symbols, should throw error", async (): Promise<void> => {
    const base = "USD";
    const params: IExchangeratesapiTimeseriesParams = {
      start_date: "2012-05-01",
      end_date: "2012-05-03",
      base: base,
      symbols: ["BBB"],
    };
    await expect(api.timeseries(params)).rejects.toThrow();
  });
});
