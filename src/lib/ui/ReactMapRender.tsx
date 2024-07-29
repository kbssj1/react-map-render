import { GeoData } from "@/lib/core/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/lib/ui/tooltip";
import { Mark } from "../core/Mark";
import { Map } from "../core/Map";

interface PropsType {
  width: number;
  height: number;
  geoData: any;
  propertyKey: string;
  nameKey: string;
  marks: Mark[];
}

let gd:GeoData;
let map:Map;
let isPanning = false;
let startPoint = {x:0,y:0};
let endPoint = {x:0,y:0};

function ReactMapRender(props: PropsType) {
  const containerRef = React.createRef<SVGSVGElement>();
  const [transform, setTransform] = React.useState('');
  //

  React.useEffect(() => {
    map = new Map(props.width, props.height);
    //
    gd = new GeoData(props.geoData, props.propertyKey, props.nameKey, props.marks);
    gd.setPosition(0, 0).setScale(1);
    gd.colors = ['#ced4da'];
    setTransform(gd.transform);
    //
    map.addObject(gd);
  }, []);
  
  const onWheelEvent = (e: React.WheelEvent<SVGSVGElement>) => {
    const w = map.width;
    const h = map.height;
    var mx = e.screenX;//mouse x  
    var my = e.screenY;
    var dw = w*Math.sign(e.deltaY)*0.00005;
    var dh = h*Math.sign(e.deltaY)*0.00005;
    var dx = dw*mx/w * 500;
    var dy = dh*my/h * 500;
    gd.setScale(gd.scale - dw);
    gd.translate(dx, dy);
    setTransform(gd.transform);
  }

  const onDownListener = (e: React.MouseEvent<SVGSVGElement>) => {
    // mouseDownX = e.screenX;
    // mouseDownY = e.screenY;
    isPanning = true;
    startPoint = {x:e.screenX,y:e.screenY};  
  }

  const onUpListener = (e: React.MouseEvent<SVGSVGElement>) => {
    /*
    gd.translate(Math.min(5, Math.max(-5, e.clientX - mouseDownX)), Math.min(5, Math.max(-5, e.clientY - mouseDownY)), () => {
      setTransform(gd.transform);
    }, 500);
    */
    if (isPanning) { 
      endPoint = {x:e.screenX,y:e.screenY};
      var dx = (startPoint.x - endPoint.x)/gd.scale;
      var dy = (startPoint.y - endPoint.y)/gd.scale;
      gd.translate(-dx, -dy);
      setTransform(gd.transform);
      isPanning = false;
    }
  }

  const moveListener = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning){
      endPoint = {x:e.screenX,y:e.screenY};
      var dx = (startPoint.x - endPoint.x)/gd.scale;
      var dy = (startPoint.y - endPoint.y)/gd.scale;
      gd.translate(-dx, -dy);
      setTransform(gd.transform);
    }
  }

  if (!gd)
    return <div></div>

  const regions:any = gd.geoData.map((data, index) => {
    
    if (data instanceof Mark) {
      const triggerRef = React.createRef<SVGCircleElement>();
      const path = (
        <circle
          cx={String(data.center[0])}
          cy={String(data.center[1])}
          key={index}
          fill="yellow"
          r={5}
          ref={triggerRef}
          onClick={data.onClick}
        />
      );
      const tooltip = (
        <PathTooltip
          key={index}
          pathRef={triggerRef}
          tip={data.name}
          svgRef={containerRef}
        />
      )
      return { path, highlightedTooltip: tooltip };
    } else {
      const triggerRef = React.createRef<SVGPathElement>();
      const path = (
        <path
          fill={gd.colors[0]}
          d={data.path}
          ref={triggerRef}
          key={index}
          stroke="#212529"
          strokeWidth={1}
        />
      );
      const tooltip = (
        <PathTooltip
          key={index}
          pathRef={triggerRef}
          tip={data.name}
          svgRef={containerRef}
        />
      )
      return { path, highlightedTooltip: tooltip };
    }
  });

  // Build paths
  const regionPaths = regions.map((entry:any) => entry.path);
    
  //Build tooltips
  const regionTooltips = regions.map((entry:any) => entry.highlightedTooltip);

  return (
    <>
      <svg width={props.width} height={props.height} ref={containerRef} onWheel={onWheelEvent} onMouseDown={onDownListener} onMouseMove={moveListener} onMouseUp={onUpListener} >
        <g transform={transform}>
          {regionPaths}
        </g>
        {regionTooltips}
      </svg>
    </>
  );
}

export default ReactMapRender;