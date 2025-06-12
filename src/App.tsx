import React, { useState, useMemo } from "react";
import { ScatterPlot, type DataPoint } from "./components/ScatterPlot";
import { useScatterPlot } from "./hooks/useScatterPlot";
import { getPointsData } from "./mock";

const App: React.FC = () => {
  // const [width, height] = [1000, 800];
  const { width, height } = document.body.getBoundingClientRect();

  const data = useMemo(() => getPointsData(), []);

  const { viewState, onViewStateChange, onPointClick } = useScatterPlot({
    width,
    height,
  });

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      <ScatterPlot
        data={data}
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        onPointClick={onPointClick}
      />
    </div>
  );
};

export default App;
