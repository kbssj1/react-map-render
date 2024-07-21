import type GeoJSON from "geojson";
import { SvgPath } from "./SvgPath";
import { Position } from "geojson";
import { Object } from "./Object";
import { Scheduler } from "./Scheduler";
import { MinMaxTest } from "./minMaxTest";

/**
 * 
 * 
 */
export class GeoData implements Object {
  private geoDatas:any[] = [];
  private s:Scheduler = new Scheduler();
  private _colors:string[] = [];
  public positionX: number = 0;
  public positionY: number = 0;
  public scale: number = 0;
  public transform: string = '';
  public centers: {[key:string]:Position} = {};

  constructor(geoData: any) {
    //
    let m =new MinMaxTest();
    geoData.features.map((feature : any) => {
      // const { I: isoCode, N: countryName, C: coordinates } = feature;
      const geoFeature: GeoJSON.Feature = {
        type: "Feature",
        properties: { NAME: feature.properties.행정동명, id: feature.properties.행정동코드 },
        geometry: {
          type: "MultiPolygon",
          coordinates: feature.geometry.coordinates as GeoJSON.Position[][][],
        },
      };
      m.push(geoFeature.geometry);
    });
    m.calaulte();
    //
    geoData.features.map((feature : any) => {

      // const { I: isoCode, N: countryName, C: coordinates } = feature;
      const geoFeature: GeoJSON.Feature = {
        type: "Feature",
        properties: { NAME: feature.properties.행정동명, id: feature.properties.행정동코드 },
        geometry: {
          type: "MultiPolygon",
          coordinates: feature.geometry.coordinates as GeoJSON.Position[][][],
        },
      };
      let path = new SvgPath(geoFeature.geometry, m.minMax);
      this.centers[geoFeature.properties?.id] = path.center;
      this.geoDatas.push({path:path.path, countryName: geoFeature.properties?.NAME, id: geoFeature.properties?.id});
    });
    
    /*
    this.colors.push("#" + "C870E0");
    this.colors.push("#" + "6E5FD3");
    this.colors.push("#" + "5079F9");
    this.colors.push("#" + "7BE276");
    this.colors.push("#" + "EBED68");
    this.colors.push("#" + "EBBA54");
    this.colors.push("#" + "F06976");
    this.colors.push("#" + "8D3047");
    this.colors.push("#" + "F800EF");
    this.colors.push("#" + "F400F8");
    */
  }

  public get colors() {
    return this._colors;
  }

  public set colors(colors:string[]) {
    this._colors = colors;
  }


  public get geoData() {
    return this.geoDatas;
  }

  public setPosition(positionX:number, positionY:number) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.transform = `translate(${this.positionX}, ${this.positionY}) scale(${this.scale})`;
    return this;
  }

  public translate(x: number, y: number, time:number=0) {
    /*
    this.s.push('', () => {

      callback();
    }, time);
    this.s.run();
    */
    this.positionX = this.positionX + x;
    this.positionY = this.positionY + y;
    this.transform = `translate(${this.positionX}, ${this.positionY}) scale(${this.scale})`;
  }

  public setScale(scale:number, time:number=0) {
    this.scale = scale
    this.transform = `translate(${this.positionX}, ${this.positionY}) scale(${this.scale})`;
    return this;
  }
}