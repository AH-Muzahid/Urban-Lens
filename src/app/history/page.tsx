export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">History</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Analysis History</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
          This route will surface previous analyses, revisit recent locations, and track comparison activity over time.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
          Coming soon.
        </div>
      </section>
    </main>
  );
}
