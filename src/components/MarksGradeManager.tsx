import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Award, 
  Save, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Edit3,
  X,
  Sliders,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GradeLetter, StudentCourseGrade, Student } from '../types/attendance';
import { calculateGradeFromMarks } from '../data/initialData';

export const MarksGradeManager: React.FC = () => {
  const { 
    courses, 
    students, 
    grades, 
    updateStudentMarks, 
    getStudentCourseSummary, 
    policy,
    activeRole,
    activeStudentId
  } = useAttendance();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'c-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Local editing state for inline modifications
  const [localGrades, setLocalGrades] = useState<Record<string, Partial<StudentCourseGrade>>>({});

  // Detailed Modal Editing State
  const [editingModalStudent, setEditingModalStudent] = useState<Student | null>(null);
  const [modalIa1, setModalIa1] = useState(20);
  const [modalIa2, setModalIa2] = useState(22);
  const [modalIa3, setModalIa3] = useState(24);
  const [modalAssignment, setModalAssignment] = useState(8);
  const [modalLab, setModalLab] = useState(16);
  const [modalTotalMarks, setModalTotalMarks] = useState(80);
  const [modalGrade, setModalGrade] = useState<GradeLetter>('A');
  const [modalGradePoints, setModalGradePoints] = useState(9);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const openMarksModal = (student: Student) => {
    setEditingModalStudent(student);
    const existing = grades.find((g) => g.studentId === student.id && g.courseId === selectedCourseId);
    const edits = localGrades[student.id] || {};
    
    const ia1 = edits.ia1 !== undefined ? edits.ia1 : (existing?.ia1 ?? 20);
    const ia2 = edits.ia2 !== undefined ? edits.ia2 : (existing?.ia2 ?? 20);
    const ia3 = edits.ia3 !== undefined ? edits.ia3 : (existing?.ia3 ?? 20);
    const assignment = edits.assignment !== undefined ? edits.assignment : (existing?.assignment ?? 8);
    const lab = edits.lab !== undefined ? edits.lab : (existing?.lab ?? 15);
    
    const bestTwo = [ia1, ia2, ia3].sort((a, b) => b - a).slice(0, 2);
    const iaScaled40 = Math.round(((bestTwo[0] + bestTwo[1]) / 60) * 40);
    const total = edits.totalMarks !== undefined ? edits.totalMarks : Math.min(100, iaScaled40 + assignment + lab + 25);
    
    const { grade, gradePoints } = calculateGradeFromMarks(total);

    setModalIa1(ia1);
    setModalIa2(ia2);
    setModalIa3(ia3);
    setModalAssignment(assignment);
    setModalLab(lab);
    setModalTotalMarks(total);
    setModalGrade(edits.grade || grade);
    setModalGradePoints(edits.gradePoints !== undefined ? edits.gradePoints : gradePoints);
  };

  const handleModalMarksRecalculate = (newIa1: number, newIa2: number, newIa3: number, newAssign: number, newLab: number) => {
    setModalIa1(newIa1);
    setModalIa2(newIa2);
    setModalIa3(newIa3);
    setModalAssignment(newAssign);
    setModalLab(newLab);

    const bestTwo = [newIa1, newIa2, newIa3].sort((a, b) => b - a).slice(0, 2);
    const iaScaled40 = Math.round(((bestTwo[0] + bestTwo[1]) / 60) * 40);
    const computedTotal = Math.min(100, iaScaled40 + newAssign + newLab + 25);
    setModalTotalMarks(computedTotal);

    const { grade, gradePoints } = calculateGradeFromMarks(computedTotal);
    setModalGrade(grade);
    setModalGradePoints(gradePoints);
  };

  const handleSaveModalMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModalStudent) return;

    updateStudentMarks(editingModalStudent.id, selectedCourseId, {
      ia1: modalIa1,
      ia2: modalIa2,
      ia3: modalIa3,
      assignment: modalAssignment,
      lab: modalLab,
      totalMarks: modalTotalMarks,
      grade: modalGrade,
      gradePoints: modalGradePoints,
    });

    // Clear local edits
    setLocalGrades((prev) => {
      const copy = { ...prev };
      delete copy[editingModalStudent.id];
      return copy;
    });

    setSaveBanner(`Internal marks and grade updated for ${editingModalStudent.name} (${editingModalStudent.usn}).`);
    setEditingModalStudent(null);
    setTimeout(() => setSaveBanner(null), 4000);
  };

  const handleFieldChange = (studentId: string, field: keyof StudentCourseGrade, value: any) => {
    setLocalGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveStudentMarks = (studentId: string) => {
    const edits = localGrades[studentId];
    if (edits) {
      updateStudentMarks(studentId, selectedCourseId, edits);
      setSaveBanner(`Internal marks and grade updated for student.`);
      // Clear local edits for this student
      setLocalGrades((prev) => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
      setTimeout(() => setSaveBanner(null), 3000);
    }
  };

  const handleSaveAll = () => {
    Object.entries(localGrades).forEach(([studentId, edits]) => {
      updateStudentMarks(studentId, selectedCourseId, edits);
    });
    setLocalGrades({});
    setSaveBanner(`All modified marks and grades committed to MITM academic database.`);
    setTimeout(() => setSaveBanner(null), 4000);
  };

  const exportMarksCSV = () => {
    const headers = ['USN', 'Student Name', 'Course Code', 'IA-1 (30)', 'IA-2 (30)', 'IA-3 (30)', 'Assignment (10)', 'Lab (20)', 'Total Marks (100)', 'Grade', 'Grade Points', 'Attendance %', 'Exam Status'];
    const rows = students.map((student) => {
      const g = grades.find((gr) => gr.studentId === student.id && gr.courseId === selectedCourseId);
      const att = getStudentCourseSummary(student.id, selectedCourseId);
      const isDebarred = att.percentage < policy.minimumThreshold;
      return [
        student.usn,
        `"${student.name}"`,
        currentCourse.code,
        g?.ia1 || 0,
        g?.ia2 || 0,
        g?.ia3 || 0,
        g?.assignment || 0,
        g?.lab || 0,
        g?.totalMarks || 0,
        isDebarred ? 'F (Debarred)' : g?.grade || 'F',
        isDebarred ? 0 : g?.gradePoints || 0,
        `${att.percentage}%`,
        isDebarred ? 'DEBARRED (Shortage)' : 'ELIGIBLE',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MITM_Marks_${currentCourse.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.usn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Course Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
              Teacher Interface
            </span>
            <span>·</span>
            <span>Continuous Internal Evaluation (CIE) Marks & Grade Entry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Academic Marks & Grade Entry Console</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Teacher-exclusive console to enter and alter student marks (IA-1, IA-2, IA-3, Assignment, Lab) and compute final grades. Students have read-only access and cannot alter marks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportMarksCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Marksheet</span>
          </button>

          {Object.keys(localGrades).length > 0 && (
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes ({Object.keys(localGrades).length})</span>
            </button>
          )}
        </div>
      </div>

      {saveBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveBanner}</span>
          </div>
          <button onClick={() => setSaveBanner(null)} className="underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Control Bar: Subject Selector & Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Select Subject / Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setLocalGrades({});
              }}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-sm pt-4 sm:pt-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or USN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Course Instructor: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentCourse.instructor}</span> ({currentCourse.credits} Credits)
        </div>
      </div>

      {/* Marks & Grades Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student & USN</th>
                <th className="py-3 px-3 text-center">IA-1 (30)</th>
                <th className="py-3 px-3 text-center">IA-2 (30)</th>
                <th className="py-3 px-3 text-center">IA-3 (30)</th>
                <th className="py-3 px-3 text-center">Assignment (10)</th>
                <th className="py-3 px-3 text-center">Lab / Practical (20)</th>
                <th className="py-3 px-3 text-center">Total Marks (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Attendance Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((student) => {
                const storedGrade = grades.find(
                  (g) => g.studentId === student.id && g.courseId === selectedCourseId
                );
                const edits = localGrades[student.id] || {};

                // Current values with edits
                const ia1 = edits.ia1 !== undefined ? edits.ia1 : (storedGrade?.ia1 ?? 20);
                const ia2 = edits.ia2 !== undefined ? edits.ia2 : (storedGrade?.ia2 ?? 20);
                const ia3 = edits.ia3 !== undefined ? edits.ia3 : (storedGrade?.ia3 ?? 20);
                const assignment = edits.assignment !== undefined ? edits.assignment : (storedGrade?.assignment ?? 8);
                const lab = edits.lab !== undefined ? edits.lab : (storedGrade?.lab ?? 15);

                // Compute total marks
                const bestTwo = [ia1, ia2, ia3].sort((a, b) => b - a).slice(0, 2);
                const iaTotalScaled40 = Math.round(((bestTwo[0] + bestTwo[1]) / 60) * 40);
                const totalMarks = edits.totalMarks !== undefined ? edits.totalMarks : Math.min(100, iaTotalScaled40 + assignment + lab + 25);

                const computedGrade = calculateGradeFromMarks(totalMarks);
                const gradeLetter: GradeLetter = edits.grade || computedGrade.grade;
                const gradePoints = edits.gradePoints !== undefined ? edits.gradePoints : computedGrade.gradePoints;

                // Attendance deficit check
                const attSummary = getStudentCourseSummary(student.id, selectedCourseId);
                const isShortage = attSummary.percentage < policy.minimumThreshold;
                const isCritical = attSummary.percentage < policy.criticalDebarmentThreshold;

                const hasEdits = Boolean(localGrades[student.id]);

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      hasEdits ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        USN: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{student.usn}</span>
                      </div>
                    </td>

                    {/* IA-1 */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={ia1}
                        onChange={(e) =>
                          handleFieldChange(student.id, 'ia1', Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-14 text-center font-mono py-1 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* IA-2 */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={ia2}
                        onChange={(e) =>
                          handleFieldChange(student.id, 'ia2', Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-14 text-center font-mono py-1 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* IA-3 */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={ia3}
                        onChange={(e) =>
                          handleFieldChange(student.id, 'ia3', Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-14 text-center font-mono py-1 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Assignment */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={assignment}
                        onChange={(e) =>
                          handleFieldChange(student.id, 'assignment', Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-12 text-center font-mono py-1 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Lab */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={lab}
                        onChange={(e) =>
                          handleFieldChange(student.id, 'lab', Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-12 text-center font-mono py-1 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Total Marks */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={totalMarks}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          handleFieldChange(student.id, 'totalMarks', val);
                          const { grade, gradePoints } = calculateGradeFromMarks(val);
                          handleFieldChange(student.id, 'grade', grade);
                          handleFieldChange(student.id, 'gradePoints', gradePoints);
                        }}
                        className="w-16 text-center font-mono font-bold py-1 px-1 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded text-xs text-indigo-700 dark:text-indigo-300"
                      />
                    </td>

                    {/* Grade Selector */}
                    <td className="py-3 px-3 text-center">
                      <select
                        value={gradeLetter}
                        onChange={(e) => {
                          const g = e.target.value as GradeLetter;
                          handleFieldChange(student.id, 'grade', g);
                          const pointsMap: Record<GradeLetter, number> = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };
                          handleFieldChange(student.id, 'gradePoints', pointsMap[g]);
                        }}
                        className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
                          gradeLetter === 'S' || gradeLetter === 'A'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : gradeLetter === 'F'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="S">S (10 GP)</option>
                        <option value="A">A (9 GP)</option>
                        <option value="B">B (8 GP)</option>
                        <option value="C">C (7 GP)</option>
                        <option value="D">D (6 GP)</option>
                        <option value="E">E (5 GP)</option>
                        <option value="F">F (0 GP)</option>
                      </select>
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3 px-3 text-center">
                      {isShortage ? (
                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isCritical
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {isCritical ? 'DEBARRED (<60%)' : 'SHORTAGE (<75%)'}
                          </span>
                          <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                            {attSummary.percentage}% attendance
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                            Eligible
                          </span>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {attSummary.percentage}%
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openMarksModal(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Open detailed modal to alter all marks and continuous evaluation scores"
                        >
                          <Edit3 className="w-3 h-3 text-indigo-500" />
                          <span>Alter Marks</span>
                        </button>

                        {hasEdits ? (
                          <button
                            onClick={() => handleSaveStudentMarks(student.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] hidden sm:inline">Saved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alter Student Marks & Continuous Evaluation Modal */}
      {editingModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Alter Student Internal Marks & Grade Details
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {editingModalStudent.name} (USN: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{editingModalStudent.usn}</span>) · {currentCourse.name} ({currentCourse.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Attendance & Statutory Exam Clearance Banner */}
            {(() => {
              const att = getStudentCourseSummary(editingModalStudent.id, selectedCourseId);
              const isShortage = att.percentage < policy.minimumThreshold;
              return isShortage ? (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      <strong>Debarment Warning:</strong> Attendance is <strong>{att.percentage}%</strong> (Below {policy.minimumThreshold}% requirement). Semester exam hall ticket is withheld.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Statutory Attendance Cleared:</strong> Attendance is <strong>{att.percentage}%</strong>. Student is cleared for semester-end examination.
                  </span>
                </div>
              );
            })()}

            <form onSubmit={handleSaveModalMarks} className="space-y-4 text-xs">
              {/* Internal Assessments (IA-1, IA-2, IA-3) */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Continuous Internal Assessments (IA-1, IA-2, IA-3)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Max 30 marks each</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IA-1 (Max 30)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={modalIa1}
                      onChange={(e) =>
                        handleModalMarksRecalculate(
                          Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                          modalIa2,
                          modalIa3,
                          modalAssignment,
                          modalLab
                        )
                      }
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IA-2 (Max 30)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={modalIa2}
                      onChange={(e) =>
                        handleModalMarksRecalculate(
                          modalIa1,
                          Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                          modalIa3,
                          modalAssignment,
                          modalLab
                        )
                      }
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IA-3 (Max 30)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={modalIa3}
                      onChange={(e) =>
                        handleModalMarksRecalculate(
                          modalIa1,
                          modalIa2,
                          Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                          modalAssignment,
                          modalLab
                        )
                      }
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                  Best 2 IAs selected: {[modalIa1, modalIa2, modalIa3].sort((a,b) => b-a).slice(0, 2).join(' + ')} = {[modalIa1, modalIa2, modalIa3].sort((a,b) => b-a).slice(0, 2).reduce((a,b) => a+b, 0)}/60 (Scaled to {Math.round((([modalIa1, modalIa2, modalIa3].sort((a,b) => b-a).slice(0, 2).reduce((a,b) => a+b, 0))/60)*40)}/40)
                </div>
              </div>

              {/* Assignments & Lab Components */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Assignments & Practical Work</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assignment & Seminar (Max 10)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={modalAssignment}
                      onChange={(e) =>
                        handleModalMarksRecalculate(
                          modalIa1,
                          modalIa2,
                          modalIa3,
                          Math.min(10, Math.max(0, parseInt(e.target.value) || 0)),
                          modalLab
                        )
                      }
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Laboratory / Practical (Max 20)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={modalLab}
                      onChange={(e) =>
                        handleModalMarksRecalculate(
                          modalIa1,
                          modalIa2,
                          modalIa3,
                          modalAssignment,
                          Math.min(20, Math.max(0, parseInt(e.target.value) || 0))
                        )
                      }
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Total Marks & Grade Outcome */}
              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Total CIE Marks (100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={modalTotalMarks}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        setModalTotalMarks(val);
                        const { grade, gradePoints } = calculateGradeFromMarks(val);
                        setModalGrade(grade);
                        setModalGradePoints(gradePoints);
                      }}
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-900 dark:text-indigo-200 font-extrabold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Letter Grade
                    </label>
                    <select
                      value={modalGrade}
                      onChange={(e) => {
                        const g = e.target.value as GradeLetter;
                        setModalGrade(g);
                        const pointsMap: Record<GradeLetter, number> = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };
                        setModalGradePoints(pointsMap[g]);
                      }}
                      className="w-full text-center font-mono py-1.5 px-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-900 dark:text-indigo-200 font-bold text-sm"
                    >
                      <option value="S">Grade S (10 GP)</option>
                      <option value="A">Grade A (9 GP)</option>
                      <option value="B">Grade B (8 GP)</option>
                      <option value="C">Grade C (7 GP)</option>
                      <option value="D">Grade D (6 GP)</option>
                      <option value="E">Grade E (5 GP)</option>
                      <option value="F">Grade F (0 GP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                      Grade Points (GP)
                    </label>
                    <div className="font-mono font-black text-center py-1.5 px-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-900 dark:text-indigo-200 text-sm">
                      {modalGradePoints} / 10
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingModalStudent(null)}
                  className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Marks & Recalculate Grade</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
