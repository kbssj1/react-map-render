import { GeoData } from "@/lib/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/app/tooltip";

interface PropsType {
  width: number;
  height: number;
  geoData: any;
}

function ManyPoint(props: PropsType) {
  let moved = false;
  let mouseDownX = 0;
  let mouseDownY = 0;
  //
  let gd = new GeoData(props.geoData);
  gd.setPosition(props.height, props.width).setScale(props.height * 0.0003);

  const [transform, setTransform] = React.useState(gd.transform);

  const containerRef = React.createRef<SVGSVGElement>();
  const regions:any = gd.geoData.map((data, index) => {
    let colors: any[] = [];
    colors.push("#" + "C870E0");
    colors.push("#" + "6E5FD3");
    colors.push("#" + "5079F9");
    colors.push("#" + "7BE276");
    colors.push("#" + "EBED68");
    colors.push("#" + "EBBA54");
    colors.push("#" + "F06976");
    colors.push("#" + "8D3047");
    colors.push("#" + "F8F1EF");
    colors.push("#" + "F4FAF8");
    const triggerRef = React.createRef<SVGPathElement>();
    
    const path = (
      <path
        fill={colors[index % 10]}
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

  const onWheelEvent = (event: React.WheelEvent<SVGSVGElement>) => {
    if (event.deltaY > 0) {
      // setTransform()
      // gd.setScale(props.height * 0.0003, scale + 0.003);
      // setScale(gd.scaleY);
    } else {
      // gd.setScale(props.height * 0.0003, scale - 0.003);
      // setScale(gd.scaleY);
    }
  }

  const onDownListener = (e: React.MouseEvent<SVGSVGElement>) => {
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    moved = true;
  }

  const onUpListener = () => {
    moved = false;
  }

  const moveListener = (e: React.MouseEvent<SVGSVGElement>) => {
    if (moved) {
      console.log("check");
      if (e.clientX - mouseDownX > 0) {
        
        // setDx(dx + 10);
      }
    }
  }

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