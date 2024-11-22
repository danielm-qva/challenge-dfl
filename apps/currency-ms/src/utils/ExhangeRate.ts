export type RateKey = `${string}-${string}`;

export class ExchangeRate {
  readonly ratesMap: Map<RateKey, number>;

  constructor(
    base: string,
    rates: Record<string, number>,
    currencyList: string[],
  ) {
    this.ratesMap = new Map<RateKey, number>();
    this.initializeRates(base, rates, currencyList);
  }

  getMpa() {
    return this.ratesMap;
  }

  private initializeRates(
    base: string,
    rates: Record<string, number>,
    currencyList: string[],
  ): void {
    currencyList.forEach((fromCurrency) => {
      currencyList.forEach((toCurrency) => {
        if (fromCurrency !== toCurrency) {
          const rate = this.calculateRate(
            fromCurrency,
            toCurrency,
            base,
            rates,
          );
          this.setRate(fromCurrency, toCurrency, rate);
        }
      });
    });
  }

  private calculateRate(
    fromCurrency: string,
    toCurrency: string,
    base: string,
    rates: Record<string, number>,
  ): number {
    if (fromCurrency === base) {
      return rates[toCurrency] || 1;
    }
    if (toCurrency === base) {
      return 1 / (rates[fromCurrency] || 1);
    }
    return (rates[toCurrency] || 1) / (rates[fromCurrency] || 1);
  }

  private setRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
  ): void {
    const key: RateKey = `${fromCurrency}-${toCurrency}`;
    this.ratesMap.set(key, rate);
  }

  public updateRates(base: string, rates: Record<string, number>): void {
    this.initializeRates(
      base,
      rates,
      Array.from(this.ratesMap.keys()).map((key) => key?.split?.('-')[0]),
    );
  }

  public getRate(fromCurrency: string, toCurrency: string): number | undefined {
    const key: RateKey = `${fromCurrency}-${toCurrency}`;
    return this.ratesMap.get(key);
  }
}
