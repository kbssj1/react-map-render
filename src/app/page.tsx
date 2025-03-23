'use client';

import * as React from 'react';
import ReactMapRender from "@/lib/ui/ReactMapRender";
import seoulGeoData from "../lib/geojson/seoul.geo";
import { Mark } from "@/lib/core/2dgeo/Mark";
import ReactMapWebglRender from '@/lib/ui/ReactMapWebglRender';

export default function Home() {
  const [description, setDescription] = React.useState('');
  const o : { [key: string]: string; } = {
    '11110520' : '경복궁(景福宮, 영어: Gyeongbokgung Palace)은 서울특별시 종로구 사직로에 위치한 조선 왕조의 법궁(法宮, 정궁)이다. 1395년 창건되어 1592년 임진왜란으로 전소되었고, 1868년 흥선대원군의 주도로 중건되었다.',
    '11170520' : '전쟁기념관(戰爭記念館, War Memorial of Korea)은 대한민국 서울특별시 용산구 이태원로 29 (용산동 1가 8번지, 옛 육군본부 자리)[1]에 위치한 기념관으로, 대한민국을 지켜온 항쟁과 전쟁에 대한 기록을 모으고 보존하는 곳이다. 전쟁에 대한 교훈을 통해 전쟁을 예방하고, 평화적 통일을 목적으로 한다. 1990년 9월 28일에 기공식이 있었다. 처음 건립된 때는 1993년 12월이며, 개관한 때는 1994년 6월 10일이다.'
  }

  function click(key:string) {
    setDescription(o[key]);
  }

  let marks:(Mark)[] = []
  marks.push(new Mark('11110520', '경복궁',() => click('11110520')));
  marks.push(new Mark('11170520', '전쟁기념박물관', () => click('11170520')));

  return (
    <main style={{width:'600px', textAlign: 'center'}}>
      <h2> Seoul Tourist destination </h2>
        <ReactMapRender 
          width={600}
          height={400}
          geoData={seoulGeoData}
          propertyKey="행정동코드"
          nameKey="행정동명"
          marks={marks}
        />
      <p> 
        {description}
      </p>
      <ReactMapWebglRender 
        width={600}
        height={400}
      />
    </main>
  );
}
