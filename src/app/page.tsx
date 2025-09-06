'use client';

import * as React from 'react';
import ReactMapWebglRender from '@/lib/ui/ReactMapWebglRender';

export default function Home() {
  
  return (
    <main style={{width:'600px', textAlign: 'center'}}>
      <ReactMapWebglRender 
        width={600}
        height={400}
      />
    </main>
  );
}
