export interface IExchangeratesapiParams {
    date?: string;
    base?: string;
    symbols?: string | string[];
}
export interface IExchangeratesapiRates {
    [key: string]: number;
}
export interface IExchangeratesapiResponse {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: IExchangeratesapiRates;
}
export interface IExchangeratesapiConvertParams {
    from: string;
    to: string;
    amount: number;
    date?: string;
}
export interface IExchangeratesapiConvertResponse {
    success: boolean;
    query: {
        from: string;
        to: string;
        amount: number;
    };
    info: {
        timestamp: number;
        rate: number;
    };
    historical: "" | true;
    date: string;
    result: number;
}
export interface IExchangeratesapiTimeseriesParams {
    start_date: string;
    end_date: string;
    base?: string;
    symbols?: string | string[];
}
export interface IExchangeratesapiTimeseriesRates {
    [key: string]: IExchangeratesapiRates;
}
export interface IExchangeratesapiTimeseriesResponse {
    success: boolean;
    timeseries: true;
    start_date: string;
    end_date: string;
    base: string;
    rates: IExchangeratesapiTimeseriesRates;
}
export declare class exchangeratesapi {
    private ACCESS_KEY;
    constructor(ACCESS_KEY: string);
    latest(params?: IExchangeratesapiParams): Promise<IExchangeratesapiResponse>;
    historical(params: IExchangeratesapiParams): Promise<IExchangeratesapiResponse>;
    convert(params: IExchangeratesapiConvertParams): Promise<IExchangeratesapiConvertResponse>;
    timeseries(params: IExchangeratesapiTimeseriesParams): Promise<IExchangeratesapiTimeseriesResponse>;
    private request;
    private currencyExchange;
    private diffDays;
    private addDays;
    private formatDate;
}
export default exchangeratesapi;
