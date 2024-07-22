import { Position } from "geojson";
/**
 * 
 */

export class Mark {
  private _path: string = '';
  private _center: Position = [0,0];
  private _name: string = '';
  private _regionKey = ''

  constructor(regionKey:string, name: string) {
    this._regionKey = regionKey;
    this._name = name;
  }

  public get regionKey() {
    return this._regionKey;
  }

  public get path() {
    return this._path;
  }

  public get center() {
    return this._center;
  }

  public set center(center : Position) {
    this._center = center;
  }

  public get name() {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

}