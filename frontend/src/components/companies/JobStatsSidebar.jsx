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
    <aside className="hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:block">
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
