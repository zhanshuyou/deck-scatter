import { type DataPoint } from "./components/ScatterPlot";

const COLORS = [
  [205, 0, 0, 200],
  [0, 205, 0, 200],
  [0, 100, 255, 200],
  [255, 155, 0, 200],
  [155, 0, 155, 200],
  [155, 255, 155, 200],
  [255, 255, 0, 200],
  [255, 0, 255, 200],
  [0, 255, 255, 200],
  [100, 100, 100, 200],
  [200, 200, 200, 200],
];

/**
 * 生成具有聚集趋势的数据集
 * @param canvasWidth 画布宽度
 * @param canvasHeight 画布高度
 * @param datasetCount 数据集数量
 * @param pointsPerDataset 每个数据集的点数
 * @param clusterRadius 聚集半径
 * @returns 生成的数据集数组
 */
export function generateClusteredDatasets(params: {
  canvasWidth: number;
  canvasHeight: number;
  datasetCount: number;
  pointsPerDataset: number;
  clusterRadius: number;
}): DataPoint[] {
  const {
    canvasWidth = 1000,
    canvasHeight = 1000,
    datasetCount = 5,
    pointsPerDataset = 500,
    clusterRadius = 150,
  } = params;
  const datasets: DataPoint[] = [];

  // 确保数据集不会太靠近边缘
  const margin = clusterRadius * 2;

  // 生成每个数据集的中心点
  for (let i = 0; i < datasetCount; i++) {
    // 随机生成中心点位置，考虑边缘留白
    const centerX = margin + Math.random() * (canvasWidth - 2 * margin);
    const centerY = margin + Math.random() * (canvasHeight - 2 * margin);

    // const clusterCenter: DataPoint = { position: [centerX, centerY], color: [], radius: 1,  };
    const points: DataPoint[] = [];

    // 为当前数据集生成聚集的点
    for (let j = 0; j < pointsPerDataset; j++) {
      // 使用正态分布生成偏移量，使点聚集在中心周围
      const offsetX = gaussianRandom() * clusterRadius;
      const offsetY = gaussianRandom() * clusterRadius;

      // 计算点的位置，确保在画布范围内
      const x = centerX + offsetX;
      const y = centerY + offsetY;

      points.push({
        position: [x, y],
        color: COLORS[i % COLORS.length] as [number, number, number, number],
        radius: 4,
        label: `Point ${j + 1} of Cluster ${i + 1}`,
      });
    }

    datasets.push(...points);
  }

  return datasets;
}

/**
 * 生成标准正态分布的随机数
 * @returns 均值为0，标准差为1的随机数
 */
function gaussianRandom(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // 避免0
  while (v === 0) v = Math.random(); // 避免0
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
