'use client';

import geoData from "../lib/countries.geo";
import { GeoData } from "@/lib/GeoData";
import * as React from 'react';

let gd = new GeoData(geoData);

export default function Home() {

  const [setScaleX, scaleX] = React.useState<number>(400);
  const [setScaleY, scaleY] = React.useState<number>(300);
  const [setTranslateX, translateX] = React.useState<number>(0.2);
  const [setTranslateY, translateY] = React.useState<number>(-0.3);

  return (
    <main>
      <svg width='100%' height={3000}>
        <g
          transform={`translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`}>
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
