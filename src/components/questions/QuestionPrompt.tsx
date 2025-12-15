type Props = {
  text: string;
  visible: boolean;
};

export function QuestionPrompt({ text, visible }: Props) {
  return (
    <div
      className={`
        mt-8 text-center transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <h1 className="mx-auto max-w-xl text-xl font-semibold leading-relaxed text-slate-100 sm:text-2xl">
        {text}
      </h1>
    </div>
  );
}
