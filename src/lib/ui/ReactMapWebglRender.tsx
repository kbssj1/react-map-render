import React, { useEffect } from 'react'
import WebGLRenderer from "../core/webgl/webGLRenderer";
import GltfLoader from "../core/loader/gltfLoader";
import Scene from '../core/scene';
import Mesh from '../core/mesh';
import Object from '../core/object';
import { Vec3 } from '../core/math/vec3';
import Material from '../core/Material';

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  async function run() {

    //
    let gltfLoader = new GltfLoader();
    let model = await gltfLoader.loadModel("http://localhost:3000/gltf/waterBottle/waterbottle.gltf");
    
    let scene:Scene = new Scene();
    //
    let mesh:Mesh = new Mesh("gltf", model);
    let material:Material = new Material(model);
    //
    let object:Object = new Object(mesh, material);
    object.localPosition = new Vec3([0, 0, 0]);
    object.localRotation = new Vec3([0, 1, 0]);
    //
    scene.add(object);

    function reqeust() {
      // object.localPosition = new Vec3([object.localPosition.x+0.001, 0, -3]);
      webgl.draw();
      requestAnimationFrame(reqeust);
    }

    let webgl: WebGLRenderer;
    let canvas:HTMLCanvasElement | null = document.querySelector("#c");
    if (canvas) {
      canvas.width = props.width;
      canvas.height = props.height;
      webgl = new WebGLRenderer(canvas, scene);
      reqeust();
    }

  }

  useEffect(() => {
    run();
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;