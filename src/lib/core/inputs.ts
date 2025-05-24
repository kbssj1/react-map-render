import { Vec3 } from "./math/vec3";

class Inputs {
  private _canvas:HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  public listen(zoom: (zoom: number) => void, move: (position: Vec3) => void) {

    this._canvas.addEventListener('wheel', (event) => {
      zoom(event.deltaY > 0 ? 0.05: -0.05);
    });

    function enterKey(e:KeyboardEvent) {
      switch (e.key) {
        case "w":
          move(new Vec3([0,-0.1,0]));
          break;
        case "s":
          move(new Vec3([0,0.1,0]));
          break;
        case "d":
          move(new Vec3([-0.1,0,0]));
          break;
        case "a":
          move(new Vec3([0.1,0,0]));
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', (event) => enterKey(event));
  }

}
  
export default Inputs;