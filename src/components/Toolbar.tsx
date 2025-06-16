import { type FC } from "react";
import type { DataPoint } from "@/types/scatter";
import { IconLasso, IconLassoOff } from "@tabler/icons-react";

type Props = {
  count: number;
  isLassoing: boolean;
  selectedPoints: DataPoint[];
  onLassoClick: () => void;
  onLassoOffClick: () => void;
};

export const Toolbar: FC<Props> = (props) => {
  const { count, isLassoing, selectedPoints, onLassoClick, onLassoOffClick } =
    props;

  return (
    <div className="absolute z-10 top-4 left-4 bg-gray-300/50 px-2 py-1 rounded-md">
      Dataset Count: {count.toLocaleString()}
      <div className="flex items-center gap-2">
        <span
          title="Lasso"
          className="inline-flex items-center justify-center p-[2px] hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-md"
          onClick={onLassoClick}
        >
          <IconLasso className={`${isLassoing ? "text-blue-400" : ""}`} />
        </span>
        <span
          title="Lasso"
          className="inline-flex items-center justify-center p-[2px] hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-md"
          onClick={onLassoOffClick}
        >
          <IconLassoOff />
        </span>
      </div>
      <div>
        <span className="flex items-center gap-[20px]">
          Selected Points: {selectedPoints.length.toLocaleString()}{" "}
        </span>
      </div>
    </div>
  );
};
