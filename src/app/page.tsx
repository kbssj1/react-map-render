'use client';

import ManyPoint from "@/lib/ui/ManyPoint";
import seoulGeoData from "../lib/d3-geo/seoul.geo";

export default function Home() {

  return (
    <main>
      <ManyPoint width={600} height={400} geoData={seoulGeoData} />
    </main>
  );
}
