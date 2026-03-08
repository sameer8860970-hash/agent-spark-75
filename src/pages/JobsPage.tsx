import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, MessageSquare, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { usePlatform } from "@/context/PlatformContext";

const statusStyles: Record<string, string> = {
  "Done": "bg-status-done-bg text-status-done",
  "Pending": "bg-status-pending-bg text-status-pending",
  "Failed": "bg-status-failed-bg text-status-failed",
  "In process": "bg-status-process-bg text-status-process",
  "Queued": "bg-status-queued-bg text-status-queued",
};

const JobsPage = () => {
  const { jobs } = usePlatform();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const statuses = ["All", "Done", "Pending", "In process", "Failed", "Queued"];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Background Jobs</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {jobs.filter((j) => j.status === "Done").length} completed · {jobs.filter((j) => j.status === "In process").length} running · {jobs.filter((j) => j.status === "Failed").length} failed
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>1 – {filteredJobs.length} of {jobs.length}</span>
          <button className="p-1 hover:bg-accent rounded transition-colors"><ChevronLeft size={14} /></button>
          <button className="p-1 hover:bg-accent rounded transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-xs flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-0.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                statusFilter === s
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-agent-surface">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Job name</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Initiated by</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Started</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Finished</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Schedule</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, index) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors group"
              >
                <td className="px-4 py-2.5 font-medium text-foreground text-xs">{job.name}</td>
                <td className="px-4 py-2.5 text-foreground text-xs">{job.initiatedBy}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{job.startedAt}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{job.finishedAt}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{job.schedule}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                      <MessageSquare size={13} />
                    </button>
                    <button className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredJobs.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No jobs found</div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
