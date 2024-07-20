import * as React from 'react';

function RangeInput() {

  const onInput = (e:any) => {
    const v:number = e.target.value
    // console.log(v);
  }

  return (
    <input style={{width: '600px', padding: '10px'}} type="range" min="0" max="5" onInput={onInput} />
  );
}

export default RangeInput;