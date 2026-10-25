import type { PaperPageModel, PaperPrimitive } from "@/lib/paper-engine";

export function PaperSvg({ model, className, ariaLabel }: { model: PaperPageModel; className?: string; ariaLabel?: string }) {
  return (
    <svg width={`${model.widthMm}mm`} height={`${model.heightMm}mm`} viewBox={`0 0 ${model.widthMm} ${model.heightMm}`} className={className} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel} preserveAspectRatio="xMidYMid meet">
      <rect width={model.widthMm} height={model.heightMm} fill={model.background} />
      {model.primitives.map((primitive, index) => <PaperPrimitiveElement key={`${primitive.kind}-${index}`} primitive={primitive} />)}
    </svg>
  );
}

function PaperPrimitiveElement({ primitive }: { primitive: PaperPrimitive }) {
  if (primitive.kind === "line") return <line x1={primitive.x1} y1={primitive.y1} x2={primitive.x2} y2={primitive.y2} stroke={primitive.color} strokeWidth={primitive.width} strokeDasharray={primitive.dash?.join(" ")} />;
  if (primitive.kind === "circle") return <circle cx={primitive.x} cy={primitive.y} r={primitive.radius} fill={primitive.color} />;
  return <text x={primitive.x} y={primitive.y} fill={primitive.color} fontSize={primitive.size} fontWeight={primitive.weight === "bold" ? 700 : 400} opacity={primitive.opacity}>{primitive.text}</text>;
}
