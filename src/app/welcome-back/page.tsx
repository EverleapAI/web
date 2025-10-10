// src/app/welcome-back/page.tsx
export const dynamic = "force-static";

export default function WelcomeBack() {
  return (
    <main className="min-h-[100svh] grid place-items-center bg-slate-50 p-6">
      <div className="max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-slate-700">
          This is where a user comes after they have been validated. It will show their dashboard info.
        </p>
      </div>
    </main>
  );
}
