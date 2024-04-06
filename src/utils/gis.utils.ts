import { getDistance } from 'geolib';

export class GisUtils {
  public static readonly earthRadiusKm = 6371;

  public static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public static getDistanceBetweenCoordinatesInKm(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
  ): number {
    return (
      getDistance(
        { latitude: startLatitude, longitude: startLongitude },
        {
          latitude: endLatitude,
          longitude: endLongitude,
        },
      ) / 1000
    );
  }
}
