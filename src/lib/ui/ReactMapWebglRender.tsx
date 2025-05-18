import React, { useEffect } from 'react'
import WebGLRenderer from "../core/webgl/webGLRenderer";
import GltfLoader from "../core/loader/gltfLoader";
import ImageLoader from '../core/loader/imageLoader';
import Scene from '../core/scene';
import Mesh from '../core/mesh';
import Object from '../core/Object';
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
    let model = await gltfLoader.loadModel("http://localhost:3000/waterbottle.gltf");
    let positions2: Vec3[] = [];
    let indices2: number[] = [];
    let texCoord2: number[] = [];
    
    let positions = model.meshes[0].positions!.data;
    let indices = model.meshes[0].indices!.data;
    let texCoord = model.meshes[0].texCoord!.data;
    for (let i=0;i<positions.length;i+=3) {
      positions2.push(new Vec3([positions[i] * 10, positions[i+1] * 10, positions[i+2] * 10]));
    }
    for (let i=0;i<indices.length;++i) {
      indices2.push(indices[i]);
    }
    for (let i=0;i<texCoord.length;++i) {
      texCoord2.push(texCoord[i]);
    }
    
    function reqeust() {
      //mesh2.rotation = new Vec3([mesh2.rotation.x+0.001, 0, 0]);
      webgl.draw();
      requestAnimationFrame(reqeust);
    }
    
    let scene:Scene = new Scene();
    //
    let mesh:Mesh = new Mesh();
    mesh.setPosition(positions2);
    mesh.setIndices(indices2);
    let material:Material = new Material(new Vec3([0.5, 0.0, 0.0]), model.materials[0].image);
    material.texCoord = texCoord2;
    let object:Object = new Object(mesh, material);
    object.localPosition = new Vec3([0, 0, -10]);
    //
    scene.add(object);

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