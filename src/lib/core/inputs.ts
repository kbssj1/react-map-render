import { Vec3 } from "./math/vec3";

class Inputs {
  private _canvas:HTMLCanvasElement;
  private _isDragging: boolean = false;
  private _lastX: number = 0;
  private _lastY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }

  public listen(zoom: (zoom: number) => void, move: (position: Vec3) => void, rotate?: (deltaX: number, deltaY: number) => void) {

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

    this._canvas.addEventListener("mousedown", (event) => {
      if (event.button === 0) { // 왼쪽 버튼
        this._isDragging = true;
        this._lastX = event.clientX;
        this._lastY = event.clientY;
      }
    });

    window.addEventListener("mouseup", () => {
      this._isDragging = false;
    });

    window.addEventListener("mousemove", (event) => {
      if (!this._isDragging || !rotate) return;

      const deltaX = event.clientX - this._lastX;
      const deltaY = event.clientY - this._lastY;

      this._lastX = event.clientX;
      this._lastY = event.clientY;
      
      rotate(deltaX, deltaY);
    });
  }

}
  
export default Inputs;