import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Search, 
  Filter, 
  Send, 
  Download, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Smartphone,
  Eye
} from 'lucide-react';
import { AttendanceStatus } from '../types/attendance';

interface ShortageRegistryProps {
  onOpenLetterModal: (noticeId: string) => void;
}

export const ShortageRegistry: React.FC<ShortageRegistryProps> = ({ onOpenLetterModal }) => {
  const { 
    students, 
    courses, 
    records, 
    notices, 
    policy, 
    getAllShortageDefaulters, 
    dispatchNotice,
    batchDispatchAllQueued,
    runAutomatedShortageScan
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'condonation' | 'advisory'>('all');
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>([]);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const defaulters = getAllShortageDefaulters();

  // Filtered list
  const filteredDefaulters = useMemo(() => {
    return defaulters.filter(({ student, course, summary }) => {
      // Search
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Course
      if (selectedCourseId !== 'all' && course.id !== selectedCourseId) {
        return false;
      }

      // Severity
      if (severityFilter === 'critical') {
        return summary.percentage < policy.criticalDebarmentThreshold;
      }
      if (severityFilter === 'condonation') {
        return summary.percentage >= policy.criticalDebarmentThreshold && summary.percentage < policy.condonationBandMin;
      }
      if (severityFilter === 'advisory') {
        return summary.percentage >= policy.condonationBandMin && summary.percentage < policy.minimumThreshold;
      }

      return true;
    });
  }, [defaulters, searchQuery, selectedCourseId, severityFilter, policy]);

  const handleDispatchSingle = (noticeId: string) => {
    dispatchNotice(noticeId, ['email', 'in_app', 'sms']);
    setSuccessBanner('Official warning notice dispatched to student and registered parent contacts.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleBulkDispatch = () => {
    if (selectedNoticeIds.length === 0) {
      batchDispatchAllQueued();
      setSuccessBanner('All queued shortage notices have been dispatched via Email, SMS & Student Portal.');
    } else {
      selectedNoticeIds.forEach((id) => dispatchNotice(id, ['email', 'in_app', 'sms']));
      setSuccessBanner(`Dispatched ${selectedNoticeIds.length} selected warning notices.`);
      setSelectedNoticeIds([]);
    }
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const exportCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Course Code', 'Course Name', 'Classes Held', 'Attended', 'Attendance %', 'Status', 'Classes Needed to Clear'];
    const rows = filteredDefaulters.map(({ student, course, summary }) => [
      student.rollNumber,
      `"${student.name}"`,
      course.code,
      `"${course.name}"`,
      summary.classesHeld,
      summary.attended,
      `${summary.percentage}%`,
      summary.status,
      summary.isImpossible ? 'Debarred (Cannot recover)' : summary.mustAttend
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Shortage_Defaulters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>Attendance Shortage & Defaulters Registry</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official roster of students failing the mandatory {policy.minimumThreshold}% requirement. Monitor deficits, issue formal notices, and record parental receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleBulkDispatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {selectedNoticeIds.length > 0 
                ? `Dispatch Selected (${selectedNoticeIds.length})` 
                : 'Dispatch All Warning Notices'}
            </span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-xs underline hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Course Dropdown Filter */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Academic Subjects</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                severityFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Shortages ({defaulters.length})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                severityFilter === 'critical'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Debarment (&lt;{policy.criticalDebarmentThreshold}%)
            </button>
            <button
              onClick={() => setSeverityFilter('advisory')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                severityFilter === 'advisory'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Advisory ({policy.condonationBandMin}% - {policy.minimumThreshold}%)
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredDefaulters.length}</span> defaulter records
        </div>
      </div>

      {/* Main Defaulter Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredDefaulters.length > 0 &&
                      selectedNoticeIds.length === filteredDefaulters.filter(d => d.latestNotice).length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const ids = filteredDefaulters
                          .map((d) => d.latestNotice?.id)
                          .filter((id): id is string => Boolean(id));
                        setSelectedNoticeIds(ids);
                      } else {
                        setSelectedNoticeIds([]);
                      }
                    }}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                </th>
                <th className="py-3 px-4">Student Identification</th>
                <th className="py-3 px-4">Course Details</th>
                <th className="py-3 px-4 text-center">Sessions (Attended / Held)</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Deficit & Recovery</th>
                <th className="py-3 px-4">Notice Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300">No matching defaulters found</p>
                    <p className="text-xs mt-1">Try clearing search filters or adjust threshold settings.</p>
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map(({ student, course, summary, latestNotice }) => {
                  const rowKey = `${student.id}-${course.id}`;
                  const isExpanded = expandedRowKey === rowKey;
                  const isCritical = summary.percentage < policy.criticalDebarmentThreshold;
                  const deficit = Math.round((policy.minimumThreshold - summary.percentage) * 10) / 10;

                  // Historical records for this pair
                  const studentCourseRecords = records
                    .filter((r) => r.studentId === student.id && r.courseId === course.id)
                    .sort((a, b) => b.sessionNumber - a.sessionNumber);

                  return (
                    <React.Fragment key={rowKey}>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          {latestNotice && (
                            <input
                              type="checkbox"
                              checked={selectedNoticeIds.includes(latestNotice.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedNoticeIds((prev) => [...prev, latestNotice.id]);
                                } else {
                                  setSelectedNoticeIds((prev) => prev.filter((id) => id !== latestNotice.id));
                                }
                              }}
                              className="rounded text-indigo-600 focus:ring-0"
                            />
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                            <span>{student.rollNumber}</span>
                            <span aria-hidden="true">·</span>
                            <span>Sec {student.section}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            Parent: {student.parentEmail}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                            {course.code}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[220px]">
                            {course.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {course.instructor}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-slate-900 dark:text-white">{summary.attended}</span>
                          <span className="text-slate-400"> / </span>
                          <span>{summary.classesHeld}</span>
                          <div className="text-[10px] text-rose-500 dark:text-rose-400">
                            {summary.absent} missed
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block font-mono font-bold tabular-nums text-xs px-2.5 py-1 rounded ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {summary.percentage}%
                          </span>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {deficit}% under target
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {summary.isImpossible ? (
                            <div className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              Debarred
                              <p className="text-[10px] font-normal text-slate-500">
                                Max achievable: {Math.round(((summary.attended + summary.classesRemaining) / summary.totalScheduled) * 100)}%
                              </p>
                            </div>
                          ) : (
                            <div className="font-mono tabular-nums">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {summary.mustAttend} classes
                              </span>
                              <p className="text-[10px] text-slate-500">
                                {summary.classesRemaining} remaining in term
                              </p>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {latestNotice ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full ${
                                    latestNotice.status === 'dispatched'
                                      ? 'bg-emerald-500'
                                      : latestNotice.status === 'acknowledged'
                                      ? 'bg-indigo-500'
                                      : 'bg-amber-500'
                                  }`}
                                />
                                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                                  {latestNotice.status}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Channels: {latestNotice.dispatchedChannels.join(', ')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">No active notice</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {latestNotice ? (
                              <>
                                <button
                                  onClick={() => onOpenLetterModal(latestNotice.id)}
                                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Print Formal University Shortage Notice"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                {latestNotice.status === 'queued' && (
                                  <button
                                    onClick={() => handleDispatchSingle(latestNotice.id)}
                                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                                    title="Send Notice to Student & Parent Email/SMS"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                onClick={() => runAutomatedShortageScan()}
                                className="text-xs text-indigo-600 hover:underline"
                              >
                                Generate
                              </button>
                            )}

                            <button
                              onClick={() => setExpandedRowKey(isExpanded ? null : rowKey)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Toggle session attendance timeline"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Attendance Timeline */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                          <td colSpan={8} className="py-3 px-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Recent Session Logs for {student.name} in {course.code}</span>
                                <span>Showing {Math.min(10, studentCourseRecords.length)} latest sessions</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                                {studentCourseRecords.slice(0, 10).map((rec) => (
                                  <div
                                    key={rec.id}
                                    className={`p-2 rounded-lg border text-center text-xs ${
                                      rec.status === 'present'
                                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                        : rec.status === 'absent'
                                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold'
                                        : rec.status === 'excused'
                                        ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                                        : 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300'
                                    }`}
                                  >
                                    <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                      #{rec.sessionNumber}
                                    </div>
                                    <div className="font-semibold capitalize mt-0.5">
                                      {rec.status === 'on_duty' ? 'OD' : rec.status}
                                    </div>
                                    <div className="text-[9px] text-slate-400 mt-1">
                                      {rec.date.slice(5)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
