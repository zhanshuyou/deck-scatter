import { useState } from "react";
import { type OrthographicViewState } from "@deck.gl/core";
import { type DataPoint } from "../components/ScatterPlot";

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
    maxZoom: 20,
  };

  const [viewState, setViewState] =
    useState<OrthographicViewState>(defaultViewState);

  const onViewStateChange = ({
    viewState,
  }: {
    viewState: OrthographicViewState;
  }) => {
    setViewState(viewState);
  };

  const onPointClick = (point: DataPoint) => {
    console.log("Point clicked:", point);
    alert(`Clicked on point: ${point.label || point.id}`);
  };

  return {
    defaultViewState,
    viewState,
    onViewStateChange,
    onPointClick,
  };
};
