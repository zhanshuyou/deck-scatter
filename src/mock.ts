import { type DataPoint } from "./components/ScatterPlot";

export const getPointsData = () => {
  const points: DataPoint[] = [];
  // 每个 cluster 的 center 和 color，增加 radius 属性
  const clusters = [
    { center: [0, 0], color: [205, 0, 0, 200], size: 4, radius: 800 },
    { center: [0, 800], color: [0, 205, 0, 200], size: 4, radius: 800 },
    { center: [1000, 0], color: [0, 100, 255, 200], size: 4, radius: 800 },
    { center: [1000, 800], color: [255, 155, 0, 200], size: 4, radius: 800 },
  ];

  clusters.forEach((cluster, i) => {
    for (let j = 0; j < 50_000; j++) {
      // 极坐标采样，r=sqrt(rand)*R，theta=rand*2pi
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.sqrt(Math.random()) * cluster.radius;
      const x = cluster.center[0] + r * Math.cos(theta);
      const y = cluster.center[1] + r * Math.sin(theta);
      points.push({
        position: [x, y],
        color: cluster.color as [number, number, number, number],
        radius: cluster.size * (0.8 + Math.random() * 0.4),
        id: `cluster-${i}-point-${j}`,
        label: `Point ${j + 1} of Cluster ${i + 1}`,
      });
    }
  });

  return points;
};
