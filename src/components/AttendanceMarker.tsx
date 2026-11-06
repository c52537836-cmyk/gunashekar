import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Calendar, 
  Check, 
  X, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AttendanceStatus } from '../types/attendance';

export const AttendanceMarker: React.FC = () => {
  const { 
    courses, 
    students, 
    policy, 
    markBatchAttendance, 
    getStudentCourseSummary 
  } = useAttendance();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'c-1');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-16');
  
  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const [sessionNumber, setSessionNumber] = useState<number>(
    currentCourse ? currentCourse.classesHeld + 1 : 1
  );

  // Local state for the session roll call
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; notes?: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; notes?: string }> = {};
    students.forEach((s) => {
      initial[s.id] = { status: 'present' };
    });
    return initial;
  });

  const [savedSuccessBanner, setSavedSuccessBanner] = useState<string | null>(null);

  // Update session number when course changes
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const targetCourse = courses.find((c) => c.id === courseId);
    if (targetCourse) {
      setSessionNumber(targetCourse.classesHeld + 1);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; notes?: string }> = {};
    students.forEach((s) => {
      updated[s.id] = { status, notes: attendanceMap[s.id]?.notes };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    markBatchAttendance(selectedCourseId, selectedDate, sessionNumber, attendanceMap);
    setSavedSuccessBanner(
      `Attendance for ${currentCourse.code} (Session #${sessionNumber} on ${selectedDate}) recorded successfully. Shortage scan updated.`
    );
    // Increment to next session
    setSessionNumber((prev) => prev + 1);
    setTimeout(() => setSavedSuccessBanner(null), 5000);
  };

  // Summary counts for this pending session
  const counts = Object.values(attendanceMap).reduce(
    (acc, cur) => {
      acc[cur.status] = (acc[cur.status] || 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, excused: 0, on_duty: 0 } as Record<AttendanceStatus, number>
  );

  return (
    <div className="space-y-6">
      {/* Header & Course Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Daily Attendance Marking & Roll Call</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mark lecture attendance. Real-time projected percentage calculation shows instant shortage risk before saving.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => markAll('present')}
            className="px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('absent')}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Clear / Mark Absent
          </button>
        </div>
      </div>

      {savedSuccessBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{savedSuccessBanner}</span>
          </div>
          <button onClick={() => setSavedSuccessBanner(null)} className="underline hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Session Controls Box */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Course / Subject
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lecture Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
          >
          </input>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Session Number
          </label>
          <input
            type="number"
            min={1}
            value={sessionNumber}
            onChange={(e) => setSessionNumber(parseInt(e.target.value) || 1)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col justify-end">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            Course Progress: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentCourse.classesHeld} / {currentCourse.totalClassesScheduled} completed</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, (currentCourse.classesHeld / currentCourse.totalClassesScheduled) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Session Roster Stats Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Present: {counts.present}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Absent: {counts.absent}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Excused / Medical: {counts.excused}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-purple-700 dark:text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>On-Duty: {counts.on_duty}</span>
          </div>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors ml-auto"
        >
          <Save className="w-4 h-4" />
          <span>Commit & Save Session Attendance</span>
        </button>
      </div>

      {/* Student Attendance Marking Roster */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Student Details</th>
              <th className="py-3 px-4 text-center">Current Attendance</th>
              <th className="py-3 px-4 text-center">Roll Call Status</th>
              <th className="py-3 px-4 text-center">Projected New %</th>
              <th className="py-3 px-4">Notes / Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student, idx) => {
              const currentSummary = getStudentCourseSummary(student.id, selectedCourseId);
              const selectedStatus = attendanceMap[student.id]?.status || 'present';

              // Project new percentage after this session
              const isPresentType = selectedStatus === 'present' || selectedStatus === 'on_duty' || (selectedStatus === 'excused' && policy.allowMedicalExcusals);
              const newAttended = currentSummary.attended + (isPresentType ? 1 : 0);
              const newHeld = currentSummary.classesHeld + 1;
              const projectedPercent = Math.round((newAttended / newHeld) * 1000) / 10;
              const willCauseShortage = projectedPercent < policy.minimumThreshold && currentSummary.percentage >= policy.minimumThreshold;

              return (
                <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {idx + 1}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {student.rollNumber} · Sec {student.section}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono font-bold tabular-nums text-xs px-2 py-0.5 rounded ${
                        currentSummary.status === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : currentSummary.status === 'shortage'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {currentSummary.percentage}%
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {currentSummary.attended}/{currentSummary.classesHeld} sessions
                    </div>
                  </td>

                  {/* Status Toggle Buttons */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                          selectedStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                          selectedStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                          selectedStatus === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Medical Leave / Doctor Certificate"
                      >
                        Medical
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'on_duty')}
                        className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                          selectedStatus === 'on_duty'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="On-Duty (College Fest, Hackathon, Sports)"
                      >
                        On-Duty
                      </button>
                    </div>
                  </td>

                  {/* Projected Percentage Indicator */}
                  <td className="py-3 px-4 text-center">
                    <div className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {projectedPercent}%
                    </div>
                    {willCauseShortage && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                        <AlertTriangle className="w-3 h-3" /> Drops into shortage!
                      </span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Optional notes..."
                      value={attendanceMap[student.id]?.notes || ''}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
