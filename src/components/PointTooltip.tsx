import React from "react";
import type { DataPoint, PointHoverInfo } from "@/types/scatter";

interface Props {
  data?: PointHoverInfo;
}

export const PointTooltip: React.FC<Props> = (props) => {
  const { data } = props;
  const { point, x, y } = data ?? { point: {} as DataPoint };

  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        pointerEvents: "none",
        left: x,
        top: y,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "8px",
        borderRadius: "4px",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        transform: "translate(-50%, -100%)",
        border: "1px solid #ddd",
        maxWidth: "200px",
      }}
    >
      {point.label && (
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
          {point.label}
        </div>
      )}
      <div>X: {point.position[0].toFixed(2)}</div>
      <div>Y: {point.position[1].toFixed(2)}</div>
      {point.id && <div>ID: {point.id}</div>}
    </div>
  );
};
