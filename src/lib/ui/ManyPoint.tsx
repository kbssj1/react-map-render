import { GeoData } from "@/lib/core/GeoData";
import * as React from 'react';
import { PathTooltip } from "@/lib/ui/tooltip";

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
const svgSize = {w:600,h:400};

const testValue: {[key:number]:string} = {
  '11110520': '경복궁',
  '11170520': '전쟁기념박물관',
}

function ManyPoint(props: PropsType) {
  const containerRef = React.createRef<SVGSVGElement>();
  const [transform, setTransform] = React.useState('');
  //

  React.useEffect(() => {
    gd = new GeoData(props.geoData);
    gd.setPosition(-100, 500).setScale(1);
    gd.colors = ['#ced4da'];
    setTransform(gd.transform);
  }, []);

  const onInput = (e:any) => {
    const v:number = e.target.value
    // console.log(v);
    console.log(gd.centers[testValue[v]]);
  }
  
  const onWheelEvent = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    var w = svgSize.w;
    var h = svgSize.h;
    var mx = e.screenX;//mouse x  
    var my = e.screenY;    
    var dw = w*Math.sign(e.deltaY)*0.00005;
    var dh = h*Math.sign(e.deltaY)*0.00005;
    var dx = dw*mx/svgSize.w * 500;
    var dy = dh*my/svgSize.h * 500;
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
    <main style={{display : "flex", flexDirection: "column"}}>
      <svg width={props.width} height={props.height} ref={containerRef} onWheel={onWheelEvent} onMouseDown={onDownListener} onMouseMove={moveListener} onMouseUp={onUpListener} >
        <g transform={transform}>
          {regionPaths}
        </g>
        {regionTooltips}
      </svg>
      {/* <input style={{width: '600px', padding: '10px'}} type="range" min="0" max="5" onInput={onInput} /> */}
    </main>
  );
}

export default ManyPoint;