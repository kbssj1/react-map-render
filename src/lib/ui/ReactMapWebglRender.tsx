import React, { useEffect } from 'react'
import WebGL from "../core/webgl/webgl";

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  useEffect(() => {
    let canvas = document.querySelector("canvas")!;
    let webgl = new WebGL(canvas);
  }, [])

  return (
    <canvas />
  );
}

export default ReactMapWebglRender;