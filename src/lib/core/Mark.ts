import { Position } from "geojson";
/**
 * 
 */

export class Mark {
  private _path: string = '';
  private _center: Position = [0,0];
  private _name: string = '';
  private _regionKey = ''
  private _onClick: any;
  private _focus: boolean;

  constructor(regionKey:string, name: string, _onClick: any) {
    this._regionKey = regionKey;
    this._name = name;
    this._onClick = _onClick;
    this._focus = false;
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

  public get onClick() {
    return this._onClick;
  }

  public set focus(focus: boolean) {
    this._focus = focus;
  }

  public get focus() {
    return this._focus;
  }
}