'use client';

import ManyPoint from "@/lib/ui/manyPoint";
import seoulGeoData from "../lib/geojson/seoul.geo";
import { Mark } from "@/lib/core/Mark";

export default function Home() {

  let marks:(Mark)[] = []
  marks.push(new Mark('11110520', '경복궁'));
  marks.push(new Mark('11170520', '전쟁기념박물관'));

  return (
    <main>
      <h2> Seoul Tourist destination </h2>
      <ManyPoint width={600} height={400} geoData={seoulGeoData} propertyKey="행정동코드" marks={marks}/>
    </main>
  );
}
