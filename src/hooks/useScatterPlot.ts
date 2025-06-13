import { useState, useCallback } from "react";
import { type OrthographicViewState } from "@deck.gl/core";
import type { DataPoint, PointHoverInfo } from "@/types/scatter";

type Props = {
  width: number;
  height: number;
};

export const useScatterPlot = (props: Props) => {
  const { width, height } = props;

  const defaultViewState: OrthographicViewState = {
    target: [width / 2, height / 2, 0],
    zoom: -1,
    minZoom: -3,
    maxZoom: 100,
  };

  const [viewState, setViewState] =
    useState<OrthographicViewState>(defaultViewState);
  const [hoverInfo, setHoverInfo] = useState<{
    point: DataPoint;
    x: number;
    y: number;
  } | null>(null);

  const onViewStateChange = ({
    viewState,
  }: {
    viewState: OrthographicViewState;
  }) => {
    setViewState(viewState);
  };

  const onPointClick = useCallback((point: DataPoint) => {
    console.log("Point clicked:", point);
    alert(`Clicked on point: ${point.label || point.id}`);
  }, []);

  const onPointHover = useCallback((params: PointHoverInfo) => {
    setHoverInfo(params);
  }, []);

  return {
    defaultViewState,
    viewState,
    hoverInfo,
    onViewStateChange,
    onPointClick,
    onPointHover,
  };
};
