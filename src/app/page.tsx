'use client';

import geoData from "../lib/countries.geo";
import { GeoData } from "@/lib/GeoData";
import * as React from 'react';

let gd = new GeoData(geoData);

export default function Home() {

  const [translateX, setTranslateX] = React.useState<number>(600);
  const [translateY, setTranslateY] = React.useState<number>(400);
  const [scaleX, setScaleX] = React.useState<number>(0.3);
  const [scaleY, setScaleY] = React.useState<number>(-0.4);
  //

  React.useEffect(() => {

  }, [])

  const paths = () => {
    let colors:any[] = [];
    colors.push("#" + "C870E0");
    colors.push("#" + "6E5FD3");
    colors.push("#" + "5079F9");
    colors.push("#" + "7BE276");
    colors.push("#" + "EBED68");
    colors.push("#" + "EBBA54");
    colors.push("#" + "F06976");
    colors.push("#" + "8D3047");
    colors.push("#" + "F8F1EF");
    colors.push("#" + "F4FAF8");
    
    return <g transform={`translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`}>
      {
        gd.getGeoData.map(function(data, index){
          return <path fill={colors[index % 10]} d={data.path} key={index} onClick={() => {console.log(data.countryName)}}> </path>
        })
      }</g>
  }

  return (
    <main>
      <svg width='100%' height={800}>
        {paths()}
      </svg>
    </main>
  );
}
