import { GeoData } from "@/lib/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/app/tooltip";
// import { scaleLinear } from "@/lib/d3-scale/index";

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
const svgSize = {w:1200,h:700};

function ManyPoint(props: PropsType) {
  const containerRef = React.createRef<SVGSVGElement>();
  const [transform, setTransform] = React.useState('');
  //

  React.useEffect(() => {
    gd = new GeoData(props.geoData);
    const v = 5.5;
    gd.setPosition(10, 0).setScale(1);
    // gd.setPosition(-3500, -1000).setScale(30);
    // gd.setPosition(-50, 0).setScale(1);
    setTransform(gd.transform);
  }, []);
  
  const onWheelEvent = (e: React.WheelEvent<SVGSVGElement>) => {
    // e.preventDefault();
    var w = svgSize.w;
    var h = svgSize.h;
    var mx = e.screenX;//mouse x  
    var my = e.screenY;    
    var dw = w*Math.sign(e.deltaY)*0.0001;
    var dh = h*Math.sign(e.deltaY)*0.0001;
    var dx = dw*mx/svgSize.w * 800;
    var dy = dh*my/svgSize.h * 800;
    // const _viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
    /*
    setViewBox((prevState) => {
    	return { ..._viewBox }
    });
    */
    // console.log('transform : ' + transform);
    // console.log('mx : ' + mx);
    // console.log('my : ' + my);
    // console.log('dx : ' + dx);
    // console.log('dy : ' + dy);
    gd.setScale(gd.scale + dw);
    gd.translate(-dx, -dy);
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
      var dx = (startPoint.x - endPoint.x)/scale;
      var dy = (startPoint.y - endPoint.y)/scale;
      gd.translate(-dx, -dy);
      setTransform(gd.transform);
      isPanning = false;
    }
  }

  const moveListener = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning){
      endPoint = {x:e.screenX,y:e.screenY};
      var dx = (startPoint.x - endPoint.x)/scale;
      var dy = (startPoint.y - endPoint.y)/scale;
      console.log(dx)
      gd.translate(-dx, -dy);
      setTransform(gd.transform);
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