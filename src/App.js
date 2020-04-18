import React, { useState } from 'react';
import './App.css';

const numNeighbors = (i, j, field) => {
  const iOffsets = [-1, 0, 1];
  const jOffsets = [-1, 0, 1];

  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
  const neighborIndex = cartesian(iOffsets, jOffsets).filter(([iOff, jOff]) => (iOff !== 0 || jOff !== 0)).map(([iOff, jOff]) => [i + iOff, j + jOff]).filter(([iInd, jInd]) => (iInd >= 0 && iInd < field.length && jInd >= 0 && jInd < field[iInd].length))
  return neighborIndex.reduce((prev, [iInd, jInd]) => (prev + field[iInd][jInd]), 0)
}

const nextLive = (i, j, field) => {
  const nNeighbors = numNeighbors(i, j, field);
  const staysAlive = field[i][j] === 1 && (nNeighbors === 2 || nNeighbors === 3);
  const becomesAlive = field[i][j] === 0 && nNeighbors === 3;
  return staysAlive || becomesAlive ? 1 : 0;
}

const step = (field) => {
  return field.map((row, rowInd) => row.map((col, colInd) => nextLive(rowInd, colInd, field)));
}

const Field = (props) => {
  const className = props.val === 0 ? "dead" : "live";
  return (<td className={className}></td>);
}

const Row = (props) => {
  return (
    <tr>
      {props.row.map((val, index) => <Field key={props.rowIndex + "," + index} val={val} />)}
    </tr>
  );
}

const Table = (props) => {
  return (
    <table>
      <tbody className="golgrid">
        {props.table.map((row, index) => <Row key={index} rowIndex={index} row={row}/>)}
      </tbody>
    </table>
  )
}

const StepBtn = (props) => {
  const [autoForward, setAutoForward] = useState(false)
  const stepFun = () => {
    props.setField(step(props.field));
    props.setGeneration(props.generation + 1)
  }
  setTimeout(() => {
    if(autoForward)
    {
      stepFun();
    }
  }, 500);
  return (
    <>
      <p>{props.generation}</p> 
      <button onClick={() => setAutoForward(!autoForward)}>{ autoForward ? "Pause" : "Run" }</button>
      <button onClick={stepFun}>Step</button>
    </>
  );
}

const RowNumNeigh = (props) => {
  return (
    <tr>
      {props.row.map((col, ind) => <td key={ind}>{numNeighbors(props.rowInd, ind, props.field)}</td>)}
    </tr>
  );
}

const NumNeigh = (props) => {
  return (
    <table>
      <tbody>
        {props.field.map((row, ind) => <RowNumNeigh key={ind} row={row} rowInd={ind} field={props.field} />)}
      </tbody>
    </table>
  );
}

function App() {
  const initial = []
  for(let i = 0; i < 50; i++) {
    initial.push([])
    for(let j = 0; j < 50; j++) {
      const val = Math.random() > 0.5 ? 1 : 0;
      initial[i].push(val)
    }
  }
  initial[4][2] = 1;
  initial[4][3] = 1;
  initial[4][4] = 1;
  const [field, setField] = useState(initial);
  const [generation, setGeneration] = useState(0);

  return (
    <div className="App">
      <Table table={field} />
      <StepBtn field={field} setField={setField} generation={generation} setGeneration={setGeneration} />
      <NumNeigh field={field} />
    </div>
  );
}

export default App;
