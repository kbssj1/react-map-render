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

    /*
    let positions: Vec3[] = [];
    positions.push(new Vec3([0, 0, 0]));
    positions.push(new Vec3([-30, 0,  0]));
    positions.push(new Vec3([0, -150,  0]));
    */

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
    let webgl: WebGLRenderer;

    setTimeout(() => {

      function reqeust() {
        //mesh2.rotation = new Vec3([mesh2.rotation.x+0.001, 0, 0]);
        webgl.draw();
        requestAnimationFrame(reqeust);
      }
      
      let scene:Scene = new Scene();
      let mesh:Mesh = new Mesh();
      mesh.setPosition(positions2);
      mesh.setIndices(indices2);
      let material:Material = new Material();

      let object:Object = new Object(mesh, material);
      object.localPosition = new Vec3([0, 0, -260]);
      scene.add(object);

      let canvas:HTMLCanvasElement | null = document.querySelector("#c");
      if (canvas) {
        canvas.width = props.width;
        canvas.height = props.height;
        webgl = new WebGLRenderer(canvas, scene);
        reqeust();
      }
    }, 100);
  }, [])

  return (
    <canvas id="c"/>
  );
}

export default ReactMapWebglRender;