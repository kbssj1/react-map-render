'use client';

import ManyPoint from "@/lib/ui/manyPoint";
import seoulGeoData from "../lib/geojson/seoul.geo";

export default function Home() {

  return (
    <main>
      <ManyPoint width={600} height={400} geoData={seoulGeoData} />
    </main>
  );
}
