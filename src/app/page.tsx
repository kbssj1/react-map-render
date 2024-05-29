'use client';

import geoData from "../lib/countries.geo";
import { GeoData } from "@/lib/GeoData";
import * as React from 'react';

let gd = new GeoData(geoData);

export default function Home() {

  const [translateX, setTranslateX] = React.useState<number>(400);
  const [translateY, setTranslateY] = React.useState<number>(300);
  const [scaleX, setScaleX] = React.useState<number>(0.2);
  const [scaleY, setScaleY] = React.useState<number>(-0.2);

  return (
    <main>
      <svg width='100%' height={3000}>
        <g transform={`translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`}>
          {
            gd.getGeoData.map(function(p, index){
              return <path d={p} key={index}> </path>
            })
          }
        </g>
      </svg>
    </main>
  );
}
