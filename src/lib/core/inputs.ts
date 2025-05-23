class Inputs {

  constructor(canvas: HTMLCanvasElement, zoom: (zoom: number) => void) {
    canvas.addEventListener('wheel', (event) => {
      zoom(event.deltaY > 0 ? 0.05: -0.05);
    });
  }

}
  
export default Inputs;