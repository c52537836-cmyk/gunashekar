import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  FileText, 
  Send, 
  Upload, 
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { predictAttendance } from '../utils/attendanceCalculator';

interface StudentPortalProps {
  onOpenLetterModal: (noticeId: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onOpenLetterModal }) => {
  const { 
    students, 
    courses, 
    records, 
    notices, 
    excusals, 
    grades,
    policy, 
    activeStudentId, 
    getStudentCourseSummary, 
    getStudentOverallSummary,
    acknowledgeNotice,
    submitExcusal
  } = useAttendance();

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const overall = getStudentOverallSummary(currentStudent.id);

  // Student specific notices, excusals & grades
  const studentNotices = notices.filter((n) => n.studentId === currentStudent.id);
  const studentExcusals = excusals.filter((e) => e.studentId === currentStudent.id);
  const studentGrades = grades.filter((g) => g.studentId === currentStudent.id);

  // Calculate SGPA
  let totalCredits = 0;
  let totalWeightedPoints = 0;
  courses.forEach((c) => {
    const g = studentGrades.find((gr) => gr.courseId === c.id);
    const att = getStudentCourseSummary(currentStudent.id, c.id);
    const isDebarred = att.percentage < policy.minimumThreshold;
    const effectivePoints = isDebarred ? 0 : (g?.gradePoints || 0);

    totalCredits += c.credits;
    totalWeightedPoints += c.credits * effectivePoints;
  });
  const sgpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;

  // State for What-If Simulator
  const [simulatorCourseId, setSimulatorCourseId] = useState<string>(courses[0]?.id || 'c-1');
  const [simAttendNext, setSimAttendNext] = useState<number>(5);
  const [simMissNext, setSimMissNext] = useState<number>(0);

  // State for Excusal Petition Modal/Form
  const [showExcusalForm, setShowExcusalForm] = useState<boolean>(false);
  const [excusalCourseId, setExcusalCourseId] = useState<string>(courses[0]?.id || 'c-1');
  const [excusalDate, setExcusalDate] = useState<string>('2026-11-10');
  const [excusalReason, setExcusalReason] = useState<'medical' | 'sports_cultural' | 'family_emergency' | 'academic_conference'>('medical');
  const [excusalDescription, setExcusalDescription] = useState<string>('');
  const [excusalFileName, setExcusalFileName] = useState<string>('Doctor_Medical_Certificate.pdf');
  const [petitionSuccess, setPetitionSuccess] = useState<boolean>(false);

  // Calculate simulation result
  const simCourseSummary = getStudentCourseSummary(currentStudent.id, simulatorCourseId);
  const simCurrentCourse = courses.find((c) => c.id === simulatorCourseId) || courses[0];
  const projectedSimulationPercent = predictAttendance(
    simCourseSummary.attended,
    simCourseSummary.classesHeld,
    simAttendNext,
    simMissNext
  );

  const handleSubmitPetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excusalDescription.trim()) return;

    submitExcusal({
      studentId: currentStudent.id,
      courseId: excusalCourseId,
      date: excusalDate,
      reason: excusalReason,
      description: excusalDescription,
      documentName: excusalFileName,
    });

    setPetitionSuccess(true);
    setExcusalDescription('');
    setTimeout(() => {
      setPetitionSuccess(false);
      setShowExcusalForm(false);
    }, 2000);
  };

  const hasShortageAlert = overall.shortageCoursesCount > 0;

  return (
    <div className="space-y-6">
      {/* Student Interface Role Notice */}
      <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                Student Interface (Authorized View-Only Access)
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                USN: {currentStudent.usn}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              Students have read-only access to view lecture attendance percentage, semester exam clearance status, Continuous Internal Evaluation (CIE) marksheets, and submit medical excusal petitions. Entering marks, student names, and altering records is strictly restricted to the <strong>Teacher Interface</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Student Welcome & Status Card */}
      <div
        className={`p-6 rounded-xl border transition-all ${
          overall.overallStatus === 'critical'
            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
            : overall.overallStatus === 'shortage'
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        } shadow-xs`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-lg">
              {currentStudent.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentStudent.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded">
                  USN: {currentStudent.usn}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentStudent.department} · Semester {currentStudent.semester} (Section {currentStudent.section})
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                <span>DOB: <strong className="text-slate-600 dark:text-slate-300 font-mono">{currentStudent.dateOfBirth}</strong></span>
                <span>·</span>
                <span>Parent: {currentStudent.parentName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                  {overall.overallPercentage}%
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    overall.overallStatus === 'critical'
                      ? 'bg-rose-600 text-white'
                      : overall.overallStatus === 'shortage'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {overall.overallStatus === 'critical'
                    ? 'DEBARMENT ZONE'
                    : overall.overallStatus === 'shortage'
                    ? 'SHORTAGE'
                    : 'GOOD STANDING'}
                </span>
              </div>
            </div>

            <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Current SGPA
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {sgpa}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Attended {overall.totalAttended} of {overall.totalHeld} total sessions
              </p>
            </div>
          </div>
        </div>

        {/* Shortage Warning Advisory Notice Callout */}
        {hasShortageAlert && (
          <div className="mt-5 p-3.5 bg-rose-100/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-lg flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Official Shortage Alert:</span> You have an active attendance shortage in{' '}
              <span className="font-semibold">{overall.shortageCoursesCount} subject(s)</span>. 
              Under University Regulation Section 7.2, students with less than {policy.minimumThreshold}% attendance will not be permitted to sit for final semester examinations without formal Academic Council condonation.
            </div>
          </div>
        )}
      </div>

      {/* Official Notices Received Strip */}
      {studentNotices.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Official Shortage Notices & Advisories Issued</span>
            </h2>
            <span className="text-xs text-slate-500">{studentNotices.length} active notice(s)</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentNotices.map((notice) => (
              <div key={notice.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs font-mono text-indigo-600 dark:text-indigo-400">
                      {notice.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {notice.courseName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        notice.warningLevel === 'L3_Debarment'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                      }`}
                    >
                      {notice.warningLevel.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {notice.remarks}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Generated: {notice.generatedAt}</span>
                    <span>·</span>
                    <span>Dispatched to: {notice.dispatchedChannels.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenLetterModal(notice.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Formal Letter</span>
                  </button>

                  {notice.status === 'acknowledged' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeNotice(notice.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                    >
                      Acknowledge Notice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive What-If Bunk & Attendance Recovery Simulator */}
      <div className="p-6 rounded-xl border border-indigo-200 dark:border-indigo-950/80 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Smart Bunk & Attendance Recovery Predictor</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Simulate upcoming lectures to see how your attendance percentage will change and plan your schedule to remain safe.
            </p>
          </div>

          <select
            value={simulatorCourseId}
            onChange={(e) => setSimulatorCourseId(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                <span>Attend next upcoming classes:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                  +{simAttendNext} sessions
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10, simCourseSummary.classesRemaining)}
                value={simAttendNext}
                onChange={(e) => setSimAttendNext(parseInt(e.target.value) || 0)}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                <span>Miss / Bunk next classes:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                  +{simMissNext} sessions
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10, simCourseSummary.classesRemaining)}
                value={simMissNext}
                onChange={(e) => setSimMissNext(parseInt(e.target.value) || 0)}
                className="w-full accent-rose-600"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Current Status: {simCourseSummary.attended} / {simCourseSummary.classesHeld} ({simCourseSummary.percentage}%)</span>
              <span>Remaining in term: {simCourseSummary.classesRemaining}</span>
            </div>
          </div>

          {/* Outcome Result Card */}
          <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Projected Attendance for {simCurrentCourse.code}
            </span>
            <div className="mt-2 text-4xl font-extrabold font-mono tabular-nums">
              <span
                className={
                  projectedSimulationPercent >= policy.minimumThreshold
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }
              >
                {projectedSimulationPercent}%
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {projectedSimulationPercent >= policy.minimumThreshold ? (
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Clears the {policy.minimumThreshold}% Threshold
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Shortage Warning Remains Active
                </span>
              )}
            </p>

            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2.5">
              {simCourseSummary.status === 'safe' || simCourseSummary.status === 'borderline' ? (
                <span>
                  Safe Margin: You can miss up to <strong>{simCourseSummary.canBunk}</strong> classes today without dropping below {policy.minimumThreshold}%.
                </span>
              ) : (
                <span>
                  Recovery Goal: You must attend <strong>{simCourseSummary.mustAttend}</strong> consecutive classes without any absence.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Semester Courses Attendance Breakdown
          </h2>
          <button
            onClick={() => setShowExcusalForm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Medical Leave / Excusal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const summary = getStudentCourseSummary(currentStudent.id, course.id);
            const isShortage = summary.status === 'shortage' || summary.status === 'critical';

            return (
              <div
                key={course.id}
                className={`p-5 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between ${
                  isShortage
                    ? 'border-rose-200 dark:border-rose-900/50'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {course.code}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        {course.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        summary.status === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : summary.status === 'shortage'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {summary.percentage}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {course.instructor}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Attended: {summary.attended} / {summary.classesHeld}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Target: {policy.minimumThreshold}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          summary.percentage >= policy.minimumThreshold
                            ? 'bg-emerald-500'
                            : summary.percentage >= policy.criticalDebarmentThreshold
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, summary.percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Guidance Box */}
                  <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                    {isShortage ? (
                      <div className="text-rose-700 dark:text-rose-400 font-medium">
                        {summary.isImpossible ? (
                          <span>⚠️ Critical: Debarment unavoidable without condonation approval.</span>
                        ) : (
                          <span>⚠️ Must attend next <strong>{summary.mustAttend}</strong> lectures to regain eligibility.</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-600 dark:text-slate-300">
                        <span>Safe: You can miss up to <strong>{summary.canBunk}</strong> sessions.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{summary.absent} missed sessions</span>
                  <button
                    onClick={() => {
                      setSimulatorCourseId(course.id);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Simulate &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marks, Grades & Examination Eligibility Ledger */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Internal Assessment Marks & Examination Eligibility</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CIE score breakdown for {policy.academicTerm} · Exam clearance requires &ge;{policy.minimumThreshold}% cumulative attendance
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Semester SGPA</span>
            <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">{sgpa} / 10.0</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-3 text-center">IA-1 (30)</th>
                <th className="py-2.5 px-3 text-center">IA-2 (30)</th>
                <th className="py-2.5 px-3 text-center">IA-3 (30)</th>
                <th className="py-2.5 px-3 text-center">Assignment (10)</th>
                <th className="py-2.5 px-3 text-center">Lab (20)</th>
                <th className="py-2.5 px-3 text-center">Total (100)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-4 text-center">Exam Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => {
                const g = studentGrades.find((gr) => gr.courseId === course.id);
                const att = getStudentCourseSummary(currentStudent.id, course.id);
                const isShortage = att.percentage < policy.minimumThreshold;

                return (
                  <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{course.code}</span>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">{course.name}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{g?.ia1 ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono">{g?.ia2 ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono">{g?.ia3 ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono">{g?.assignment ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono">{g?.lab ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {g?.totalMarks ?? '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isShortage
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : g?.grade === 'S' || g?.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {isShortage ? 'F (Debarred)' : g?.grade || 'F'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isShortage ? (
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Shortage Hold
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hall Ticket Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excusal / Medical Leave Petitions History */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            My Submitted Excusal Petitions & Medical Records
          </h2>
          <button
            onClick={() => setShowExcusalForm(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + File New Petition
          </button>
        </div>

        {studentExcusals.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No medical or on-duty petitions submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {studentExcusals.map((exc) => (
              <div
                key={exc.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <span className="font-mono text-indigo-600">{exc.courseCode}</span>
                    <span>Date: {exc.date}</span>
                    <span className="capitalize text-slate-500 font-normal">({exc.reason.replace('_', ' ')})</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{exc.description}</p>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>{exc.documentName}</span>
                    <span>· Submitted {exc.submittedAt}</span>
                  </div>
                  {exc.reviewerNotes && (
                    <div className="mt-1 text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[11px]">
                      HOD / Faculty Note: {exc.reviewerNotes}
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded self-start sm:self-auto ${
                    exc.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : exc.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {exc.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Excusal Submission Modal */}
      {showExcusalForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Excusal / Medical Leave Petition
              </h3>
              <button
                onClick={() => setShowExcusalForm(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {petitionSuccess ? (
              <div className="py-8 text-center text-emerald-600 font-semibold text-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p>Petition filed successfully! Routed to Academic Advisor & HOD for review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPetition} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Course
                  </label>
                  <select
                    value={excusalCourseId}
                    onChange={(e) => setExcusalCourseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} · {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Absence
                    </label>
                    <input
                      type="date"
                      value={excusalDate}
                      onChange={(e) => setExcusalDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reason Category
                    </label>
                    <select
                      value={excusalReason}
                      onChange={(e) => setExcusalReason(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    >
                      <option value="medical">Medical Illness / Hospitalization</option>
                      <option value="sports_cultural">Sports / Inter-Collegiate Fest</option>
                      <option value="academic_conference">Academic Conference / Hackathon</option>
                      <option value="family_emergency">Family Bereavement / Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Explanation & Doctor/Advisor Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide justification, doctor's registration number or event name..."
                    value={excusalDescription}
                    onChange={(e) => setExcusalDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supporting Document (PDF or Doctor's Certificate)
                  </label>
                  <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3 text-center bg-slate-50 dark:bg-slate-800">
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{excusalFileName}</p>
                    <p className="text-[10px] text-slate-400">Mock attached certified scan (Max 5MB)</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExcusalForm(false)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                  >
                    Submit Petition
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
