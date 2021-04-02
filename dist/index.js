"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeratesapi = void 0;
const node_fetch_1 = require("node-fetch");
const API_ENDPOINT = "http://api.exchangeratesapi.io/v1/";
const DEFAULT_BASE = "EUR";
const DEFAULT_SYMBOLS = [
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTC",
    "BTN",
    "BWP",
    "BYN",
    "BYR",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CUC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GGP",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "IMP",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JEP",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LTL",
    "LVL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRO",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "STD",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "UYU",
    "UZS",
    "VEF",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XAG",
    "XAU",
    "XCD",
    "XDR",
    "XOF",
    "XPF",
    "YER",
    "ZAR",
    "ZMK",
    "ZMW",
    "ZWL",
];
class exchangeratesapi {
    constructor(ACCESS_KEY) {
        this.ACCESS_KEY = "";
        if (!ACCESS_KEY) {
            throw new Error("You have not supplied an API Access Key. Please get your API Access Key at https://exchangeratesapi.io/");
        }
        this.ACCESS_KEY = ACCESS_KEY;
    }
    async latest(params) {
        return await this.historical({
            date: "latest",
            base: params ? params.base : undefined,
            symbols: params ? params.symbols : undefined,
        });
    }
    async historical(params) {
        let date = "latest";
        if (params && params.date)
            date = params.date;
        let symbols = "";
        if (!params.symbols) {
            for (const symbol of DEFAULT_SYMBOLS) {
                if (symbols === "")
                    symbols = symbol;
                else
                    symbols += `,${symbol}`;
            }
        }
        else if (params.symbols instanceof Array) {
            for (const symbol of params.symbols) {
                if (symbols === "")
                    symbols = symbol;
                else
                    symbols += `,${symbol}`;
            }
        }
        else {
            symbols = params.symbols;
        }
        let base = DEFAULT_BASE;
        if (params.base && params.base !== DEFAULT_BASE) {
            if (!symbols.includes(params.base))
                symbols += `,${params.base}`;
        }
        else if (params.base) {
            base = params.base;
        }
        const url = `${API_ENDPOINT}/${date}?access_key=${this.ACCESS_KEY}&base=${base}&symbols=${symbols}`;
        const response = await this.request(url);
        if (params.base && base !== params.base) {
            const responseRates = response.rates;
            const rates = {};
            if (params.symbols && params.symbols instanceof Array) {
                for (const symbol of params.symbols) {
                    rates[symbol] = this.currencyExchange(responseRates[params.base], responseRates[symbol]);
                }
            }
            else if (params.symbols) {
                rates[params.symbols] = this.currencyExchange(responseRates[params.base], responseRates[params.symbols]);
            }
            response.base = params.base;
            return {
                success: response.success,
                timestamp: response.timestamp,
                base: params.base,
                date: response.date,
                rates: rates,
            };
        }
        else {
            return response;
        }
    }
    async convert(params) {
        const requestParams = {
            date: params.date,
            base: DEFAULT_BASE,
            symbols: [params.from, params.to],
        };
        const rates = await this.historical(requestParams);
        const rate = this.currencyExchange(rates.rates[params.from], rates.rates[params.to]);
        return {
            success: rates.success,
            query: {
                from: params.from,
                to: params.to,
                amount: params.amount,
            },
            info: {
                timestamp: rates.timestamp,
                rate: rate,
            },
            historical: params.date ? true : "",
            date: rates.date,
            result: Math.round(rate * params.amount * 1000000) / 1000000,
        };
    }
    async timeseries(params) {
        const startDate = new Date(Date.parse(params.start_date));
        const endDate = new Date(Date.parse(params.end_date));
        if (startDate.valueOf() > endDate.valueOf()) {
            throw new Error("The end_date is older than the start_datee.");
        }
        const rateResponses = [];
        const days = this.diffDays(params.start_date, params.end_date);
        for (let i = 0; i < days + 1; i++) {
            const rateParams = {
                date: this.addDays(startDate, i),
                base: params.base,
                symbols: params.symbols,
            };
            rateResponses.push(await this.historical(rateParams));
        }
        const rates = {};
        for (const rateResponse of rateResponses) {
            if (params.symbols instanceof Array) {
                rates[rateResponse.date] = {};
                for (const symbol of params.symbols) {
                    rates[rateResponse.date][symbol] = rateResponse.rates[symbol];
                }
            }
            else {
                rates[rateResponse.date] = rateResponse.rates;
            }
        }
        return {
            success: true,
            timeseries: true,
            start_date: params.start_date,
            end_date: params.end_date,
            base: params.base ? params.base : DEFAULT_BASE,
            rates: rates,
        };
    }
    async request(url) {
        const response = await node_fetch_1.default(url, {
            method: "GET",
        })
            .then((res) => {
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            return res.json();
        })
            .then((json) => {
            return json;
        })
            .catch((reason) => {
            throw new Error(reason);
        });
        return response;
    }
    currencyExchange(baseRate, symbolRate) {
        return Math.round((symbolRate / baseRate) * 1000000) / 1000000;
    }
    diffDays(startDate, endDate) {
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        const diffTime = Math.abs(date2.valueOf() - date1.valueOf());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    addDays(date, days) {
        const result = new Date(date.valueOf());
        result.setDate(result.getDate() + days);
        return this.formatDate(result, "yyyy-MM-dd");
    }
    formatDate(date, format) {
        format = format.replace(/yyyy/g, date.getFullYear().toString());
        format = format.replace(/MM/g, (date.getMonth() + 1).toString().padStart(2, "0"));
        format = format.replace(/dd/g, date.getDate().toString().padStart(2, "0"));
        format = format.replace(/HH/g, date.getHours().toString().padStart(2, "0"));
        format = format.replace(/mm/g, date.getMinutes().toString().padStart(2, "0"));
        format = format.replace(/ss/g, date.getSeconds().toString().padStart(2, "0"));
        format = format.replace(/SSS/g, date.getMilliseconds().toString().padStart(3, "0"));
        return format;
    }
}
exports.exchangeratesapi = exchangeratesapi;
exports.default = exchangeratesapi;
