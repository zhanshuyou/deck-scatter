import type { OrthographicViewState } from "@deck.gl/core";

export type Point = [number, number];

export interface DataPoint {
  id: string;
  position: Point;
  color: [number, number, number, number];
  radius: number;
  label?: string;
}

export type PointHoverInfo = { point: DataPoint; x: number; y: number } | null;

export type ViewStateChangeHandler = (data: {
  viewState: OrthographicViewState;
}) => void;
