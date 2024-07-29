import { Object } from "./Object";
/**
 * 
 */

export class Map {
  private _width:number;
  private _height:number;

  constructor(width:number, height:number) {
    this._width = width;
    this._height = height;
  }

  public addObject(obj: Object) {

  }

  public draw(div:string) {

  }

  public get width() {
    return this._width;
  }

  public set width(width: number) {
    this._width = width;
  }

  public get height() {
    return this._height;
  }

  public set height(height: number) {
    this._height = height;
  }
}