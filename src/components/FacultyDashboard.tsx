import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  BookOpen, 
  Send, 
  Radar, 
  ArrowRight,
  FileText,
  Mail,
  ShieldAlert,
  Calendar
} from 'lucide-react';

interface FacultyDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenLetterModal: (noticeId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  onNavigateTab,
  onOpenLetterModal,
}) => {
  const { 
    policy, 
    courses, 
    students, 
    notices, 
    excusals, 
    getStudentCourseSummary, 
    getAllShortageDefaulters,
    runAutomatedShortageScan,
    batchDispatchAllQueued,
    dispatchNotice
  } = useAttendance();

  const defaulters = getAllShortageDefaulters();
  const uniqueStudentsInShortage = new Set(defaulters.map((d) => d.student.id)).size;
  const queuedNotices = notices.filter((n) => n.status === 'queued');
  const dispatchedNotices = notices.filter((n) => n.status === 'dispatched');
  const pendingExcusals = excusals.filter((e) => e.status === 'pending');

  const handleRunScan = () => {
    runAutomatedShortageScan();
  };

  const handleBatchDispatch = () => {
    batchDispatchAllQueued();
  };

  // Compute course health statistics
  const courseStats = courses.map((course) => {
    let totalPercentSum = 0;
    let shortageCount = 0;
    students.forEach((s) => {
      const summary = getStudentCourseSummary(s.id, course.id);
      totalPercentSum += summary.percentage;
      if (summary.status === 'shortage' || summary.status === 'critical') {
        shortageCount += 1;
      }
    });

    const classAverage = students.length > 0 ? Math.round((totalPercentSum / students.length) * 10) / 10 : 0;

    return {
      course,
      classAverage,
      shortageCount,
    };
  });

  return (
    <div className="space-y-8">
      {/* Editorial University Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                <span>{policy.academicTerm}</span>
                <span aria-hidden="true">·</span>
                <span>Minimum Attendance Threshold: {policy.minimumThreshold}%</span>
                <span aria-hidden="true">·</span>
                <span>Debarment Cutoff: {policy.criticalDebarmentThreshold}%</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
                College Attendance & Automated Shortage Warning System
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Real-time tracking of lecture attendance, automated shortage detection across departments, 
                instant parental and student dispatch, and official debarment notice generation.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunScan}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-xs transition-colors"
              >
                <Radar className="w-4 h-4" />
                <span>Run Automated Shortage Scan</span>
              </button>
              {queuedNotices.length > 0 && (
                <button
                  onClick={handleBatchDispatch}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-100 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Dispatch {queuedNotices.length} Queued Warnings</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('marks-grades')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span>Change Marks & Grades</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
            <img
              src="/src/assets/images/mitm_college_campus_1793942454848.jpg"
              alt="Maharaja Institute of Technology Mysore (MITM) Engineering College"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4 text-white">
              <div className="text-xs">
                <p className="font-bold text-amber-300">MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE (MITM)</p>
                <p className="text-slate-200">Department of Computer Science & Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Density KPI Metric Grid (Tabular Numerals) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {students.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">across 5 courses</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <span>In Shortage (&lt;{policy.minimumThreshold}%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-700 dark:text-rose-400">
              {uniqueStudentsInShortage}
            </span>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
              ({defaulters.length} course defaulters)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Automated Notices</span>
            <Send className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {dispatchedNotices.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              +{queuedNotices.length} queued
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Pending Excusals</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingExcusals.length}
            </span>
            <button
              onClick={() => onNavigateTab('excusals')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Review petitions
            </button>
          </div>
        </div>
      </div>

      {/* Critical Shortage Warning Defaulter Board */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Current Attendance Shortage Registry</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Students falling below the mandatory {policy.minimumThreshold}% requirement. Automatically flagged for advisory or exam debarment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('shortage-registry')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              <span>View Full Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Attended / Held</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Recovery Classes Needed</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4 text-right">Official Letter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {defaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No Attendance Shortages Detected</p>
                    <p className="text-xs mt-1">All enrolled students currently meet or exceed {policy.minimumThreshold}% requirement.</p>
                  </td>
                </tr>
              ) : (
                defaulters.slice(0, 6).map(({ student, course, summary, latestNotice }) => {
                  const isCritical = summary.percentage < policy.criticalDebarmentThreshold;
                  return (
                    <tr 
                      key={`${student.id}-${course.id}`}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {student.rollNumber} · Sec {student.section}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {course.code}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[200px]">
                          {course.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {summary.attended} / {summary.classesHeld}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span 
                          className={`inline-block font-mono font-bold tabular-nums text-xs px-2 py-0.5 rounded ${
                            isCritical 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                          }`}
                        >
                          {summary.percentage}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                        {summary.isImpossible ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">
                            Mathematically Debarred
                          </span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            +{summary.mustAttend} classes
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {latestNotice ? (
                          <div className="flex items-center gap-1.5">
                            <span 
                              className={`text-[11px] font-medium ${
                                latestNotice.status === 'dispatched'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {latestNotice.status === 'dispatched' ? 'Notice Dispatched' : 'Queued for Dispatch'}
                            </span>
                            {latestNotice.status === 'queued' && (
                              <button
                                onClick={() => dispatchNotice(latestNotice.id, ['email', 'in_app', 'sms'])}
                                className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800"
                              >
                                Send Now
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleRunScan}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Generate Warning
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {latestNotice ? (
                          <button
                            onClick={() => onOpenLetterModal(latestNotice.id)}
                            className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                            title="View / Print Official University Shortage Notice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Letter</span>
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course-Wise Attendance Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Semester Courses Attendance Health
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Fall Semester 2026 · 5 Core Engineering Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseStats.map(({ course, classAverage, shortageCount }) => {
            const progress = (course.classesHeld / course.totalClassesScheduled) * 100;
            return (
              <div 
                key={course.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        {course.code}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {course.name}
                      </h3>
                    </div>
                    <span 
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        shortageCount > 0 
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' 
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {shortageCount} in shortage
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {course.instructor}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Sessions Completed:</span>
                      <span className="font-mono tabular-nums font-semibold">
                        {course.classesHeld} / {course.totalClassesScheduled} ({Math.round(progress)}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Cohort Average:</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {classAverage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onNavigateTab('mark-attendance')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    Take Roll Call
                  </button>
                  <button
                    onClick={() => onNavigateTab('shortage-registry')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  >
                    Defaulter list
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
