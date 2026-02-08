import { cn } from "@/lib/utils";

interface FloralDecorationProps {
  className?: string;
  variant?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "side-left"
    | "side-right";
  flowerNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const positionClasses = {
  "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
  "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "side-left": "top-1/2 left-0 -translate-x-1/3 -translate-y-1/2",
  "side-right": "top-1/2 right-0 translate-x-1/3 -translate-y-1/2",
};

export const FloralDecoration = ({
  className,
  variant = "top-left",
  flowerNumber = 1,
}: FloralDecorationProps) => {
  return (
    <div
      className={cn(
        "absolute pointer-events-none z-0 select-none",
        positionClasses[variant],
        className,
      )}
    >
      <img
        src={`/flores/flor-${flowerNumber}.png`}
        alt="Decoração floral"
        className="w-[200px] md:w-[350px] lg:w-[500px] object-contain opacity-90 drop-shadow-md"
        loading="lazy"
      />
    </div>
  );
};
