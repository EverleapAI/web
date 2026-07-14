"use client";

import { useRef, useState } from "react";
import { Mic, ArrowUpRight } from "lucide-react";

type Props = {
  onSubmit: () => void;
};

export function AnswerInput({ onSubmit }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    setValue("");
    onSubmit();
  };

  return (
    <div className="mt-10">
      <div className="relative rounded-card bg-gradient-to-br from-sky-500/50 via-indigo-500/40 to-fuchsia-500/50 p-[1px]">
        <div className="flex items-end gap-3 rounded-card bg-slate-950/90 px-4 py-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder=""
            rows={3}
            className="
              flex-1 resize-none bg-transparent text-sm text-slate-100
              outline-none placeholder-slate-500 sm:text-base
            "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* Mic */}
          <button
            type="button"
            className="
              flex h-10 w-10 items-center justify-center rounded-full
              border border-slate-600 bg-slate-900/90 text-slate-100
              hover:border-sky-400 hover:text-sky-100
              transition active:scale-95
            "
            aria-label="Speak"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="
              flex h-10 w-10 items-center justify-center rounded-full
              bg-sky-400 text-slate-950 shadow-lg
              hover:bg-sky-300 transition active:scale-95
            "
            aria-label="Submit"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Soft actions */}
      <div className="mt-3 flex justify-center gap-6 text-xs text-slate-400">
        <button type="button" className="hover:text-slate-200">
          I’m not sure
        </button>
        <button type="button" className="hover:text-slate-200">
          Skip for now
        </button>
      </div>
    </div>
  );
}
