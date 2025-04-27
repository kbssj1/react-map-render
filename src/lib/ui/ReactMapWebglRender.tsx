import React, { useEffect } from 'react'
import WebGLRenderer from "../core/webgl/webGLRenderer";
import GltfLoader from "../core/loader/gltfLoader";
import ImageLoader from '../core/loader/imageLoader';
import Scene from '../core/scene';
import Mesh from '../core/mesh';
import { Vec3 } from '../core/math/vec3';

interface PropsType {
  width: number;
  height: number;
}

function ReactMapWebglRender(props: PropsType) {

  useEffect(() => {
    
    /*
    let imageLoader = new ImageLoader();
    imageLoader.load("http://localhost:3000/test.jpg", (image) => {
      if (canvas) {
        canvas.width = props.width;
        canvas.height = props.height;

        let gltfLoader = new GltfLoader();
        gltfLoader.loadModel("http://localhost:3000/Duck.gltf");
        
      }
    });
    */

    let positions: Vec3[] = [];
    positions.push(new Vec3([0, 0, 0]));
    positions.push(new Vec3([-30, 0,  0]));
    positions.push(new Vec3([0, -150,  0]));

    let positions2: Vec3[] = [];
    let indices2: number[] = [];
    /*
    positions2.push(new Vec3([0, 0, 0]));
    positions2.push(new Vec3([30, 0,  0]));
    positions2.push(new Vec3([0, 150,  0]));
    */
    let gltfLoader = new GltfLoader();
    gltfLoader.loadModel("http://localhost:3000/Box.gltf", (model) => {
      let positions = model[0].positions.data;
      let indices = model[0].indices.data;
      for (let i=0;i<positions.length;i+=3) {
        positions2.push(new Vec3([positions[i] * 10, positions[i+1] * 10, positions[i+2] * 10]));
      }
      for (let i=0;i<indices.length;++i) {
        indices2.push(indices[i]);
      }
    });

    setTimeout(() => {
      let scene:Scene = new Scene();
      let mesh:Mesh = new Mesh();
      mesh.setPosition(positions);
      let mesh2:Mesh = new Mesh();
      mesh2.setPosition(positions2);
      mesh2.setIndices(indices2);
      scene.add(mesh);
      scene.add(mesh2);

      let canvas:HTMLCanvasElement | null = document.querySelector("#c");
      if (canvas) {
        canvas.width = props.width;
        canvas.height = props.height;
        let webgl = new WebGLRenderer(canvas, scene); 
      }
    }, 100);

  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;