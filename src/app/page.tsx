'use client';

import ReactMapRender from "@/lib/ui/ReactMapRender";
import seoulGeoData from "../lib/geojson/seoul.geo";
import { Mark } from "@/lib/core/Mark";

export default function Home() {

  function click() {
    console.log('click');
  }

  let marks:(Mark)[] = []
  marks.push(new Mark('11110520', '경복궁', click));
  marks.push(new Mark('11170520', '전쟁기념박물관', click));

  return (
    <main>
      <h2> Seoul Tourist destination </h2>
      <ReactMapRender width={600} height={400} geoData={seoulGeoData} propertyKey="행정동코드" marks={marks}/>
    </main>
  );
}
