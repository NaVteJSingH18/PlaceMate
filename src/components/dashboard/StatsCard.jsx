function StatsCard({ icon: Icon, label, tone = "blue", value }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>

        <div
          className={`grid h-12 w-12 place-items-center rounded-lg ${
            tones[tone] || tones.blue
          }`}
        >
          <Icon aria-hidden="true" className="text-xl" />
        </div>
      </div>
    </section>
  );
}

export default StatsCard;
