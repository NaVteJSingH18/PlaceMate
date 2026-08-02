import {
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import StatusBadge from "../components/common/StatusBadge";
import { usePlacement } from "../context/placementStore";

function Dashboard() {
  const { activity, applications, companies, stats } = usePlacement();

  const upcomingCompanies = companies.slice(0, 3);
  const latestApplications = applications.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 rounded-lg bg-slate-950 p-6 text-white shadow-sm sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              Placement season overview
            </p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Track students, company drives, and application movement from one
              focused workspace.
            </p>
          </div>

          <button
            className="h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
            type="button"
          >
            Export report
          </button>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard icon={FaUsers} label="Students" tone="blue" value={stats.students} />
          <StatsCard
            icon={FaBuilding}
            label="Companies"
            tone="green"
            value={stats.companies}
          />
          <StatsCard
            icon={FaClipboardList}
            label="Applications"
            tone="orange"
            value={stats.applications}
          />
          <StatsCard
            icon={FaCheckCircle}
            label="Selected"
            tone="slate"
            value={stats.selected}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Upcoming drives</h2>
              <span className="text-sm font-medium text-slate-500">
                {companies.length} active
              </span>
            </div>

            <div className="space-y-3">
              {upcomingCompanies.map((company) => (
                <article
                  className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
                  key={company.id}
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">{company.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {company.role} - {company.package} - {company.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={company.status} />
                    <span className="text-sm font-semibold text-slate-600">
                      {company.deadline}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Recent activity</h2>
            <div className="space-y-4">
              {activity.map((item) => (
                <article className="border-l-2 border-blue-500 pl-4" key={item.id}>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">
            Latest applications
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {latestApplications.map((application) => (
              <article
                className="rounded-lg border border-slate-200 p-4"
                key={application.id}
              >
                <StatusBadge status={application.status} />
                <h3 className="mt-3 font-semibold text-slate-950">
                  {application.student}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {application.company}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
