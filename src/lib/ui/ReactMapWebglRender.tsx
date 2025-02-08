import React, { useEffect } from 'react'
import WebGL from "../core/webgl/webgl";

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  useEffect(() => {
    let canvas:HTMLCanvasElement | null = document.querySelector("#c");
    
      let image = new Image();
      image.src = "http://localhost:3000/test.jpg";
      image.onload = function() {
        if (canvas) {
          let webgl = new WebGL(canvas, image);
        }
      };
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;