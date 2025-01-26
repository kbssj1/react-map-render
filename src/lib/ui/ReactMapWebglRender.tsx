import React, { useEffect } from 'react'
import WebGL from "../core/webgl/webgl";

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  useEffect(() => {
    let canvas:HTMLCanvasElement | null = document.querySelector("#c");
    if (canvas) {
      let webgl = new WebGL(canvas);
    }
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;