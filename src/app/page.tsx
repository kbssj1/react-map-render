'use client';

import geoData from "../lib/countries.geo";
import { GeoData } from "@/lib/GeoData";
import * as React from 'react';
import { PathTooltip } from './tooltip';
import { Scene } from "@/lib/Scene";

let gd = new GeoData(geoData);
gd.setPosition(600, 400).setScale(0.3, -0.4);

let scene = new Scene()
scene.addObject(gd);

export default function Home() {

  const [translateX, setTranslateX] = React.useState<number>(600);
  const [translateY, setTranslateY] = React.useState<number>(400);
  const [scaleX, setScaleX] = React.useState<number>(0.3);
  const [scaleY, setScaleY] = React.useState<number>(-0.4);
  const containerRef = React.createRef<SVGSVGElement>();

  React.useEffect(() => {

  }, [])

  const regions = gd.geoData.map((data, index) => {
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
    const triggerRef = React.createRef<SVGPathElement>();

    const path = (
      <path
        fill={colors[index % 10]}
        d={data.path}
        ref={triggerRef}
        key={index}
      />
    );
    const tooltip = (
      <PathTooltip
        key={index}
        pathRef={triggerRef}
        tip={data.countryName}
        svgRef={containerRef}
      />
    )

    return { path, highlightedTooltip: tooltip };
  });

  // Build paths
  const regionPaths = regions.map((entry) => entry.path);

  // Build tooltips
  const regionTooltips = regions.map((entry) => entry.highlightedTooltip);

  return (
    <main>
      <svg width='100%' height={800} ref={containerRef}>
        <g transform={`translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`}>
          {regionPaths}
        </g>
        {regionTooltips}
      </svg>
    </main>
  );
}
