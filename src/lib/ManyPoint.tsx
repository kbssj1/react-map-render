import { GeoData } from "@/lib/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/app/tooltip";

interface PropsType {
  width: number;
  height: number;
  geoData: any;
}

let gd:GeoData;

function ManyPoint(props: PropsType) {
  let moved = false;
  let mouseDownX = 0;
  let mouseDownY = 0;
  const containerRef = React.createRef<SVGSVGElement>();
  //

  React.useEffect(() => {
    gd = new GeoData(props.geoData);
    gd.setPosition(props.height / 2 , props.width / 2).setScale(props.height * 0.0003);
    setTransform(gd.transform);
  }, []);

  const [transform, setTransform] = React.useState('');

  const onWheelEvent = (event: React.WheelEvent<SVGSVGElement>) => {
    if (event.deltaY > 0) {
      gd.setScale(gd.scale + 0.005);
    } else {
      gd.setScale(gd.scale - 0.005);
    }
    setTransform(gd.transform);
  }

  const onDownListener = (e: React.MouseEvent<SVGSVGElement>) => {
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    moved = true;
  }

  const onUpListener = (e: React.MouseEvent<SVGSVGElement>) => {
    moved = false;
    gd.translate(Math.min(5, Math.max(-5, e.clientX - mouseDownX)), Math.min(5, Math.max(-5, e.clientY - mouseDownY)), () => {
      setTransform(gd.transform);
    }, 500);
  }

  const moveListener = (e: React.MouseEvent<SVGSVGElement>) => {
    if (moved) {
      // console.log(Math.min(e.clientX - mouseDownX, 3.0));
      
    }
  }

  if (!gd)
    return <div></div>
   
  const regions:any = gd.geoData.map((data, index) => {
    const triggerRef = React.createRef<SVGPathElement>();
    const path = (
      <path
        fill={gd.colors[index % 10]}
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
  const regionPaths = regions.map((entry:any) => entry.path);
    
  //Build tooltips
  const regionTooltips = regions.map((entry:any) => entry.highlightedTooltip);

  return (
    <main>
      <svg width={props.width} height={props.height} ref={containerRef} onWheel={onWheelEvent} onMouseDown={onDownListener} onMouseMove={moveListener} onMouseUp={onUpListener} >
        <g transform={transform}>
          {regionPaths}
        </g>
        {regionTooltips}
      </svg>
    </main>
  );
}

export default ManyPoint;