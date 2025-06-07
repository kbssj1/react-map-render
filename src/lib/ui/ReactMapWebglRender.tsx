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
    
    let positions = model.meshes[0].positions!.data;
    let indices = model.meshes[0].indices!.data;
    let texCoord = model.meshes[0].texCoord!.data;
    let normals = model.meshes[0].normals!.data;

    function reqeust() {
      //mesh2.rotation = new Vec3([mesh2.rotation.x+0.001, 0, 0]);
      webgl.draw();
      requestAnimationFrame(reqeust);
    }
    
    let scene:Scene = new Scene();
    //
    let mesh:Mesh = new Mesh();
    mesh.positions = positions;
    mesh.indices = indices;
    mesh.normal = normals;
    let material:Material = new Material(null, model.materials[0].image, model.materials[0].emissiveImage);
    material.texCoord = texCoord;
    let object:Object = new Object(mesh, material);
    object.localPosition = new Vec3([0, 0, -2]);
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