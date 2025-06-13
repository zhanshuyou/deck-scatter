import type { DataPoint } from "@/types/scatter";
import type { OrthographicViewState } from "@deck.gl/core";
import { useState } from "react";

type Props = {
  width: number;
  height: number;
  data: DataPoint[];
  viewState?: OrthographicViewState;
  disabled?: boolean;
  onSelectionChange?: (selectPoints: DataPoint[]) => void;
};

export const useScatterLasso = (props: Props) => {
  const { viewState, width, height, data, disabled, onSelectionChange } = props;

  const [selectionPoints, setSelectionPoints] = useState<[number, number][]>(
    []
  );
  const [isSelecting, setIsSelecting] = useState(false);

  // 将屏幕坐标转换为数据坐标
  const getDataCoord = (px: number, py: number): [number, number] => {
    if (!viewState) return [px, py];
    const scale = Math.pow(2, viewState.zoom! as number);
    const centerX = viewState.target?.[0] ?? px;
    const centerY = viewState.target?.[1] ?? py;
    const dx = (px - width / 2) / scale + centerX;
    const dy = (py - height / 2) / scale + centerY;
    return [dx, dy];
  };

  const onMouseDown = (event: React.MouseEvent) => {
    if (disabled) {
      return;
    }

    if (event.button === 0) {
      // 左键点击
      const rect = event.currentTarget.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const dataCoord = getDataCoord(px, py);
      setSelectionPoints([dataCoord]);
      setIsSelecting(true);
    }
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (isSelecting) {
      const rect = event.currentTarget.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const dataCoord = getDataCoord(px, py);
      setSelectionPoints((prev) => [...prev, dataCoord]);
    }
  };

  const onMouseUp = () => {
    if (isSelecting && selectionPoints.length > 2) {
      // 闭合多边形
      const closedPoints = [...selectionPoints, selectionPoints[0]];

      // 检查点是否在多边形内
      const selectedPoints = data.filter((point) => {
        return isPointInPolygon(point.position, closedPoints);
      });

      onSelectionChange?.(selectedPoints);
    }
    setSelectionPoints([]);
    setIsSelecting(false);
  };

  // 判断点是否在多边形内的函数
  const isPointInPolygon = (
    point: [number, number],
    polygon: [number, number][]
  ) => {
    const x = point[0];
    const y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  return {
    selectionPoints,
    isSelecting,
    onLassoMouseDown: onMouseDown,
    onLassoMouseMove: onMouseMove,
    onLassoMouseUp: onMouseUp,
  };
};
