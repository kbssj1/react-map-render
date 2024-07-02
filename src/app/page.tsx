'use client';

import ManyPoint from "@/lib/ManyPoint";
import geoData from "../lib/countries.geo";
import seoulGeoData from "../lib/seoul.geo";

export default function Home() {

  return (
    <main>
      <ManyPoint width={1200} height={700} geoData={seoulGeoData} />
    </main>
  );
}
