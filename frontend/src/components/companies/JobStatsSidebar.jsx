import React from "react";

function StatBox({ count, label, borderColor, textColor, bgColor }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border ${borderColor} ${bgColor} p-4 transition hover:scale-[1.02]`}>
      <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>{count}</span>
      <span className="mt-1 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
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

      <div className="grid grid-cols-3 gap-3">
        <StatBox
          bgColor="bg-blue-50/50"
          borderColor="border-blue-100"
          count={stats.jobs}
          label="Jobs"
          textColor="text-blue-600"
        />
        <StatBox
          bgColor="bg-orange-50/50"
          borderColor="border-orange-100"
          count={stats.jobInternships}
          label="Job+Int"
          textColor="text-orange-500"
        />
        <StatBox
          bgColor="bg-emerald-50/50"
          borderColor="border-emerald-100"
          count={stats.internships}
          label="Intern"
          textColor="text-emerald-500"
        />
      </div>
    </div>
  );
}

function JobStatsSidebar({ jobs = [], applications = [] }) {
  const getStats = (list) => {
    let j = 0, ji = 0, i = 0;
    list.forEach((item) => {
      const type = item.employmentType || item.job?.employmentType || "FULL_TIME";
      if (type === "FULL_TIME") {
        j++;
      } else if (type === "INTERN") {
        i++;
      } else {
        ji++;
      }
    });
    return { jobs: j, jobInternships: ji, internships: i };
  };

  const opportunitiesStats = getStats(jobs);
  const applicationsStats = getStats(applications);
  const offersList = applications.filter((app) => app.status === "Selected");
  const offersStats = getStats(offersList);

  return (
    <aside className="hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(28,44,92,0.06)] xl:block">
      <StatsSection
        count={jobs.length}
        stats={opportunitiesStats}
        title="Opportunities"
      />
      <StatsSection
        count={applications.length}
        stats={applicationsStats}
        title="Applications"
      />
      <StatsSection
        count={offersList.length}
        stats={offersStats}
        title="Offer in hand"
      />
    </aside>
  );
}

export default JobStatsSidebar;
