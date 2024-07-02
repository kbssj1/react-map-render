import { GeoData } from "@/lib/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/app/tooltip";

interface PropsType {
  width: number;
  height: number;
  geoData: any;
}

let gd:GeoData;
let isPanning = false;
let startPoint = {x:0,y:0};
let endPoint = {x:0,y:0};
let scale = 1;
const svgSize = {w:500,h:500};

function ManyPoint(props: PropsType) {
  let moved = false;
  let mouseDownX = 0;
  let mouseDownY = 0;
  const containerRef = React.createRef<SVGSVGElement>();
  //

  React.useEffect(() => {
    gd = new GeoData(props.geoData);
    gd.setPosition(-3500, -1000).setScale(30);
    setTransform(gd.transform);
  }, []);

  const [transform, setTransform] = React.useState('');
  const [viewBox, setViewBox] = React.useState({x:0,y:0,w:700,h:700});
  
  const onWheelEvent = (e: React.WheelEvent<SVGSVGElement>) => {
    if (e.deltaY > 0) {
      // gd.setScale(gd.scale + 0.05).translate(-6.2, -1.8);
      // gd.translate(gd.scale - 0.005, 0);
    } else {
      // gd.setScale(gd.scale - 0.005).translate(0.000005, 0);
    }
    // setTransform(gd.transform);
    // e.preventDefault();
    var w = viewBox.w;
    var h = viewBox.h;
    var mx = e.movementX;//mouse x  
    var my = e.movementY;    
    var dw = w*Math.sign(e.deltaY)*0.05;
    var dh = h*Math.sign(e.deltaY)*0.05;
    var dx = dw*mx/svgSize.w;
    var dy = dh*my/svgSize.h;
    const _viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
    scale = svgSize.w/viewBox.w;
    // console.log(Math.round(scale*100)/100);
    setViewBox((prevState) => {
    	return { ..._viewBox }
    });
  }

  const onDownListener = (e: React.MouseEvent<SVGSVGElement>) => {
    // mouseDownX = e.screenX;
    // mouseDownY = e.screenY;
    isPanning = true;
    startPoint = {x:e.screenX,y:e.screenY};  
    moved = true;
  }

  const onUpListener = (e: React.MouseEvent<SVGSVGElement>) => {
    moved = false;
    /*
    gd.translate(Math.min(5, Math.max(-5, e.clientX - mouseDownX)), Math.min(5, Math.max(-5, e.clientY - mouseDownY)), () => {
      setTransform(gd.transform);
    }, 500);
    */
    if (isPanning) { 
      endPoint = {x:e.screenX,y:e.screenY};
      var dx = (startPoint.x - endPoint.x)/scale;
      var dy = (startPoint.y - endPoint.y)/scale;
      const _viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
      setViewBox((prevState) => {
        return { ..._viewBox }
      });
      isPanning = false;
    }
  }

  const moveListener = (e: React.MouseEvent<SVGSVGElement>) => {
    if (moved) {
      // console.log(Math.min(e.clientX - mouseDownX, 3.0));
      
    }
    if (isPanning){
      endPoint = {x:e.screenX,y:e.screenY};
      var dx = (startPoint.x - endPoint.x)/scale;
      var dy = (startPoint.y - endPoint.y)/scale;
      var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
      setViewBox((prevState) => {
        return { ...movedViewBox }
      });
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
      <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} width={props.width} height={props.height} ref={containerRef} onWheel={onWheelEvent} onMouseDown={onDownListener} onMouseMove={moveListener} onMouseUp={onUpListener} >
        <g transform="translate(-3500, -1000) scale(30, 30)">
          {regionPaths}
        </g>
        {regionTooltips}
      </svg>
    </main>
  );
}

export default ManyPoint;