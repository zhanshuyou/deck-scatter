import { type FC } from "react";

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
  onLassoMouseDown?: (event: React.MouseEvent) => void;
  onLassoMouseMove?: (event: React.MouseEvent) => void;
  onLassoMouseUp?: () => void;
};

export const ScatterContainer: FC<Props> = (props) => {
  const {
    children,
    width,
    height,
    onLassoMouseDown,
    onLassoMouseMove,
    onLassoMouseUp,
  } = props;

  return (
    <div
      style={{ position: "relative", width, height }}
      onMouseDown={onLassoMouseDown}
      onMouseMove={onLassoMouseMove}
      onMouseUp={onLassoMouseUp}
      onMouseLeave={onLassoMouseUp}
    >
      {children}
    </div>
  );
};
