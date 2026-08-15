import React from "react";

function StatBox({ count, label, bgColor, textColor }) {
  return (
    <div className={`flex flex-col justify-center rounded-lg p-3 ${bgColor}`}>
      <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
      <span className={`mt-1 text-xs font-semibold ${textColor}`}>{label}</span>
    </div>
  );
}

function StatsSection({ title, count, stats }) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
          {count}
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {title === "Opportunities"
          ? "Opportunities you are / were eligible for"
          : title === "Applications"
          ? "Opportunities you have applied for"
          : "Opportunities you have received an offer for"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <StatBox
          bgColor="bg-purple-100"
          count={stats.jobs}
          label="Jobs"
          textColor="text-purple-800"
        />
        <StatBox
          bgColor="bg-orange-100"
          count={stats.jobInternships}
          label="Job + Internship"
          textColor="text-orange-600"
        />
        <StatBox
          bgColor="bg-emerald-100"
          count={stats.internships}
          label="Internships"
          textColor="text-emerald-600"
        />
      </div>
    </div>
  );
}

function JobStatsSidebar({
  totalOpportunities = 2,
  totalApplications = 2,
  totalOffers = 0,
}) {
  return (
    <aside className="hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:block">
      <StatsSection
        count={totalOpportunities}
        stats={{ jobs: 2, jobInternships: 0, internships: 0 }}
        title="Opportunities"
      />
      <StatsSection
        count={totalApplications}
        stats={{ jobs: 2, jobInternships: 0, internships: 0 }}
        title="Applications"
      />
      <StatsSection
        count={totalOffers}
        stats={{ jobs: 0, jobInternships: 0, internships: 0 }}
        title="Offer in hand"
      />
    </aside>
  );
}

export default JobStatsSidebar;
