function StatsCard({ icon: Icon, label, tone = "blue", value, isHighlighted = false }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <section 
      className={`flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center transition-all duration-200 ${
        isHighlighted 
          ? "border-2 border-[#1c2c5c] shadow-[0_8px_30px_rgba(28,44,92,0.12)] scale-[1.02] z-10 relative" 
          : "border border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div
        className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl ${
          tones[tone] || tones.blue
        }`}
      >
        <Icon aria-hidden="true" className="text-xl" />
      </div>

      <p className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
    </section>
  );
}

export default StatsCard;
