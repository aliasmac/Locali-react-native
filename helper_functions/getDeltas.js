export default function getDelta(lat, lon, distance) {

    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
  
    const latitudeDelta =distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));
  
    return result = {
        latitude: lat,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
    }

}

