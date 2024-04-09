export class NumberUtils {
  public static formatPrice = (price: number): string => {
    const numberFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return numberFormatter.format(price);
  };

  public static formatNumber = (value: number): string => {
    const numberFormatter = new Intl.NumberFormat('en-US');

    return numberFormatter.format(value);
  };
}
