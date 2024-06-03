import type GeoJSON from "geojson";
import { SvgPath } from "./SvgPath";
import { geoMercator, geoPath } from "./d3-geo/index";
/**
 * 
 */
export class GeoData {
  private geoDatas:any[] = [];

  constructor(geoData: any) {
    geoData.features.map((feature : any) => {

      const { I: isoCode, N: countryName, C: coordinates } = feature;
      const geoFeature: GeoJSON.Feature = {
        type: "Feature",
        properties: { NAME: countryName, ISO_A2: isoCode },
        geometry: {
          type: "MultiPolygon",
          coordinates: coordinates as GeoJSON.Position[][][],
        },
      };

      let path = new SvgPath(geoFeature.geometry);
      this.geoDatas.push({path:path.path, countryName: geoFeature.properties?.NAME});
    });
  }

  public get getGeoData() {
    return this.geoDatas;
  }

}