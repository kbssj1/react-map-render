import React, { useEffect } from 'react'
import WebGLRenderer from "../core/webgl/webGLRenderer";
import GltfLoader from "../core/loader/gltfLoader";
import Scene from '../core/scene';
import Mesh from '../core/mesh';
import Object from '../core/object';
import { Vec3 } from '../core/math/vec3';
import Material from '../core/Material';
import imageLoader from '../core/loader/imageLoader';

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  async function run() {

    const img = await new imageLoader().load("test.jpg");
    let gltfLoader = new GltfLoader();
    let model = await gltfLoader.loadModel("http://localhost:3000/gltf/waterBottle/waterbottle.gltf");

    let scene:Scene = new Scene();
    //
    let mesh:Mesh = new Mesh("plane");
    let material:Material = new Material(undefined, new Vec3([0, 255, 255]));
    material.image = img;
    material.texCoord = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ]);
    //
    let mesh2:Mesh = new Mesh("sphere");
    let material2:Material = new Material(undefined, new Vec3([0, 255, 0]));
    //
    let object:Object = new Object(mesh, material);
    object.localPosition = new Vec3([0, 0, 0]);
    object.localRotation = new Vec3([0, 0, 0]);
    object.scale = new Vec3([2, 2, 2]);
    //
    let object2:Object = new Object(mesh2, material2);
    object2.localPosition = new Vec3([0, 0, 0]);
    object2.localRotation = new Vec3([0, 0, 0]);
    //
    
    scene.add(object);
    // scene.add(object2);

    function reqeust() {
      // object2.localPosition = new Vec3([object2.localPosition.x+0.000008, 0, 0]);
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