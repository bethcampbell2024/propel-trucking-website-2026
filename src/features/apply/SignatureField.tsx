import { useEffect, useRef } from "react";
import { Controller, get, useFormContext } from "react-hook-form";

interface PadProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

/** Draw-your-signature canvas. Works with mouse, finger and stylus. Stores a PNG data URL. */
function Pad({ value, onChange }: PadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0c0e12";
    if (value) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, canvas.clientWidth, canvas.clientHeight);
      image.src = value;
    }
    // Only size and restore once; later strokes are drawn straight onto the canvas.
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.01, y);
    ctx.stroke();
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(e.currentTarget.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-40 w-full touch-none rounded-lg border-2 border-dashed border-ink/25 bg-white"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        aria-label="Signature pad. Draw your signature with your mouse or finger."
      />
      <span className="pointer-events-none absolute bottom-5 left-4 text-2xl text-ink/25 select-none">x</span>
      <span className="pointer-events-none absolute right-4 bottom-4 left-10 border-b border-ink/20" />
      <button type="button" onClick={clear} className="absolute top-2 right-3 cursor-pointer text-sm font-semibold text-brand hover:underline">
        Clear
      </button>
    </div>
  );
}

export function SignatureField({ name, label }: { name: string; label: string }) {
  const { control, formState } = useFormContext();
  const error = (get(formState.errors, name) as { message?: string } | undefined)?.message;
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <Controller name={name} control={control} render={({ field }) => <Pad value={field.value as string} onChange={field.onChange} />} />
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
