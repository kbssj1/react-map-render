'use client';

import ManyPoint from "@/lib/ManyPoint";
import geoData from "../lib/countries.geo";

export default function Home() {

  return (
    <main>
      <ManyPoint width={700} height={700} geoData={geoData} />
    </main>
  );
}
