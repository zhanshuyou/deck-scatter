import React, { useState, useMemo } from "react";
import ScatterPlot, { type DataPoint } from "./components/ScatterPlot";

const App: React.FC = () => {
  const [width, height] = [800, 600];

  // 生成更有意义的数据
  const data = useMemo(() => {
    const points: DataPoint[] = [];
    const clusters = [
      { center: [200, 200], color: [255, 0, 0, 200], size: 8 },
      { center: [600, 200], color: [0, 255, 0, 200], size: 12 },
      { center: [400, 400], color: [0, 0, 255, 200], size: 6 },
    ];

    clusters.forEach((cluster, i) => {
      for (let j = 0; j < 50; j++) {
        points.push({
          position: [
            cluster.center[0] + (Math.random() - 0.5) * 100,
            cluster.center[1] + (Math.random() - 0.5) * 100,
          ],
          color: cluster.color as [number, number, number, number],
          radius: cluster.size * (0.8 + Math.random() * 0.4),
          id: `cluster-${i}-point-${j}`,
          label: `Point ${j + 1} of Cluster ${i + 1}`,
        });
      }
    });

    return points;
  }, []);

  const [viewState, setViewState] = useState({
    target: [width / 2, height / 2, 0],
    zoom: 1,
  });

  const handlePointClick = (point: DataPoint) => {
    console.log("Point clicked:", point);
    alert(`Clicked on point: ${point.label || point.id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>纯 Canvas 散点图示例</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          这是一个在矩形区域内绘制的散点图，支持缩放、平移、悬停提示和点击事件。
        </p>
      </div>
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
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          onPointClick={handlePointClick}
          showGrid={true}
          showAxes={true}
        />
      </div>
    </div>
  );
};

export default App;
