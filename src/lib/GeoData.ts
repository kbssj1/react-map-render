import type GeoJSON from "geojson";
import { SvgPath } from "./SvgPath";
import { geoMercator, geoPath } from "./d3-geo/index";
import { Object } from "./Object";

/**
 * 
 * 
 */
export class GeoData implements Object {
  private geoDatas:any[] = [];
  public positionX: number = 0;
  public positionY: number = 0;
  public scale: number = 0;
  public transform: string = '';

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

  public get geoData() {
    return this.geoDatas;
  }

  public setPosition(positionX:number, positionY:number) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.transform = `translate(${positionX}, ${positionY}) scale(${this.scale}, ${-this.scale})`;
    return this;
  }

  public setScale(scale:number) {
    this.scale = scale
    this.transform = `translate(${this.positionX}, ${this.positionY}) scale(${scale}, ${-scale})`;
    return this;
  }

}