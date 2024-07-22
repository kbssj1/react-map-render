import type GeoJSON from "geojson";
import { Region } from "./Region";
import { Object } from "./Object";
import { Scheduler } from "./Scheduler";
import { MinMaxTest } from "./minMaxTest";
import { Mark } from "./Mark";

/**
 * 
 * 
 */
export class GeoData implements Object {
  private geoDatas:(Mark|Region)[] = [];
  private s:Scheduler = new Scheduler();
  private _colors:string[] = [];
  private _propertyKey:string;
  public positionX: number = 0;
  public positionY: number = 0;
  public scale: number = 0;
  public transform: string = '';

  constructor(geoData: any, propertyKey: string, mark: Mark[]) {
    this._propertyKey = propertyKey; 
    //
    let m =new MinMaxTest();
    geoData.features.map((feature : any) => {
      const geoFeature: any = {
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
      const geoFeature: GeoJSON.Feature = {
        type: "Feature",
        properties: { NAME: feature.properties.행정동명, id: feature.properties[this._propertyKey] },
        geometry: {
          type: "MultiPolygon",
          coordinates: feature.geometry.coordinates as GeoJSON.Position[][][],
        },
      };
      let path = new Region(geoFeature.geometry, m.minMax);
      path.name = geoFeature.properties?.NAME;
      for (let i=0;i<Mark.length;++i) {
        // console.log(mark[i].regionKey);
        // console.log(geoFeature.properties?.id);
        // console.log('-----');
        if (mark[i].regionKey === geoFeature.properties?.id) {
          mark[i].center = path.center;
        }
      }
      this.geoDatas.push(path);
    });
    //
    for (let i=0;i<Mark.length;++i) {
      this.geoDatas.push(mark[i]);
    }
  }

  public get colors() {
    return this._colors;
  }

  public set colors(colors:string[]) {
    this._colors = colors;
  }

  private addDefaultColors() {
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
  }

  public get geoData() {
    return this.geoDatas;
  }

  public get property() {
    return this._propertyKey;
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