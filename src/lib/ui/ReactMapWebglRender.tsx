import React, { useEffect } from 'react'
import WebGL from "../core/webgl/webgl";
import GltfLoader from "../core/loader/gltfLoader";
import ImageLoader from '../core/loader/imageLoader';

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  useEffect(() => {
    let canvas:HTMLCanvasElement | null = document.querySelector("#c");

    let imageLoader = new ImageLoader();
    imageLoader.load("http://localhost:3000/test.jpg", (image) => {
      if (canvas) {
        canvas.width = props.width;
        canvas.height = props.height;

        let gltfLoader = new GltfLoader();
        gltfLoader.loadModel("http://localhost:3000/Duck.gltf");
        let webgl = new WebGL(canvas, image);
      }
    });
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;