import React, { useEffect } from 'react'
import WebGL from "../core/webgl/webgl";
import GltfLoader from "../core/webgl/gltfLoader";

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
        canvas.width = props.width;
        canvas.height = props.height;

        let gltfLoader = new GltfLoader();
        gltfLoader.loadModel("http://localhost:3000/Duck.gltf");
        let webgl = new WebGL(canvas, image);
      }
    };
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;