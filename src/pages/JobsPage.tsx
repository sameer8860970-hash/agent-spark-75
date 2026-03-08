import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, MessageSquare } from "lucide-react";
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

  const filteredJobs = jobs.filter((j) =>
    j.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Background jobs</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>1 – {filteredJobs.length} of {jobs.length}</span>
          <button className="p-1 hover:bg-accent rounded transition-colors"><ChevronLeft size={16} /></button>
          <button className="p-1 hover:bg-accent rounded transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Job name"
          className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-agent-surface">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Job name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Initiated by ↕</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status ↕</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Started at</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Finished at</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Schedule</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">View conversation</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, index) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">{job.name}</td>
                <td className="px-4 py-3 text-foreground">{job.initiatedBy}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{job.startedAt}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.finishedAt}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.schedule}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                    <MessageSquare size={15} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsPage;
