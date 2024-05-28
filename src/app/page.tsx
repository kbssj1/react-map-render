import geoData from "../lib/countries.geo";
import { GeoData } from "@/lib/GeoData";

let gd = new GeoData(geoData);
export default function Home() {
  return (
    <main>
      <svg width={3000} height={3000}>
        <g transform="translate(300 150) scale(0.1 -0.1)">
          {
            gd.getGeoData.map(function(p, index){
              return <path d={p} key={index}>  </path>
            })
          }
          {/* <path d="M180,-16.067L180,-16.555L179.364,-16.801L178.725,-17.012L178.597,-16.639L179.097,-16.434L179.414,-16.379L180,-16.067L178.126,-17.505L178.374,-17.34L178.718,-17.628L178.553,-18.151L177.933,-18.288L177.381,-18.164L177.285,-17.725L177.671,-17.381L178.126,-17.505L-179.793,-16.021L-179.917,-16.502L-180,-16.555L-180,-16.067L-179.793,-16.021Z"/>  */}
        </g>
        </svg>
    </main>
  );
}
