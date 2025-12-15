type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const active = i <= current;
        const milestone = i % 5 === 0;

        return (
          <span
            key={i}
            className={`
              h-1.5 rounded-full transition-all
              ${milestone ? "w-3" : "w-2"}
              ${active ? "bg-sky-300" : "bg-slate-600/50"}
            `}
          />
        );
      })}
    </div>
  );
}
