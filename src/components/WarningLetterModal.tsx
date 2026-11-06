import React, { useRef } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { WarningNotice } from '../types/attendance';
import { Printer, X, Download, Copy, Check, ShieldAlert } from 'lucide-react';

interface WarningLetterModalProps {
  noticeId: string | null;
  onClose: () => void;
}

export const WarningLetterModal: React.FC<WarningLetterModalProps> = ({ noticeId, onClose }) => {
  const { notices, students, policy } = useAttendance();
  const [copied, setCopied] = React.useState(false);

  if (!noticeId) return null;

  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) return null;

  const student = students.find((s) => s.id === notice.studentId);
  const deficit = Math.round((notice.requiredPercentage - notice.currentPercentage) * 10) / 10;
  const isDebarred = notice.warningLevel === 'L3_Debarment';

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE (MITM) - ATTENDANCE SHORTAGE NOTICE
Ref: REF/MITM/ATTN/2026/${notice.id.slice(-4)}
Student: ${notice.studentName} (USN: ${student?.usn || notice.rollNumber})
Subject: ${notice.courseCode} - ${notice.courseName}
Attendance: ${notice.currentPercentage}% (Required: ${notice.requiredPercentage}%)
Status: ${isDebarred ? 'DEBARRED FROM SEMESTER EXAMINATION' : 'SHORTAGE ADVISORY'}
Parent: ${notice.parentEmail}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Official University Notice Document
            </span>
            <span className="text-xs text-slate-400 font-mono">#{notice.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text' : 'Copy Notice'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Letter Container */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white space-y-6 font-serif select-text">
          {/* Official Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="flex justify-center mb-3">
              <img
                src="/src/assets/images/college_crest_seal_1793941514851.jpg"
                alt="University Seal"
                className="w-16 h-16 object-cover rounded-full border border-slate-300"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-sans text-slate-900">
              {policy.universityName}
            </h1>
            <p className="text-xs font-sans text-slate-600 mt-1 uppercase tracking-widest font-semibold">
              Office of the Dean of Academic Affairs · Attendance & Examination Board
            </p>
            <p className="text-[11px] font-sans text-slate-500">
              Academic Quadrangle, Tech Campus · Tel: (555) 019-4800 · Email: academics@{policy.universityName.toLowerCase().replace(/\s+/g, '')}.edu
            </p>
          </div>

          {/* Reference and Date */}
          <div className="flex justify-between items-baseline text-xs font-sans text-slate-700 pt-2">
            <div>
              <span className="font-semibold">Dispatch Ref: </span>
              <span className="font-mono">MITM/ACAD/{policy.academicTerm.slice(0, 4)}/WARN-{notice.id.slice(-6).toUpperCase()}</span>
            </div>
            <div>
              <span className="font-semibold">Date of Issuance: </span>
              <span>{notice.generatedAt}</span>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="text-xs font-sans space-y-1 text-slate-800 bg-slate-50 p-4 rounded border border-slate-200">
            <p className="font-bold text-slate-900">TO:</p>
            <p className="font-semibold">{student?.parentName} (Parent / Guardian of {notice.studentName})</p>
            <p>Student Roll No: <span className="font-mono font-semibold">{notice.rollNumber}</span></p>
            <p>Program: Bachelor of Technology (Computer Science & Engineering) · Semester {student?.semester}</p>
            <p>Registered Email: {student?.email} | Parent Contact: {notice.parentEmail}</p>
          </div>

          {/* Subject Line */}
          <div className="py-2 border-y border-slate-200">
            <p className="font-bold text-xs uppercase text-slate-900 font-sans tracking-wide">
              SUBJECT: {isDebarred ? 'FINAL NOTICE OF EXAMINATION DEBARMENT DUE TO CRITICAL ATTENDANCE SHORTAGE' : 'FORMAL ADVISORY NOTICE: ATTENDANCE SHORTAGE IN ACADEMIC COURSEWORK'}
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-xs font-sans leading-relaxed text-slate-800 space-y-3">
            <p>Dear Parent / Guardian,</p>

            <p>
              This is an official communication from the Academic Council of <strong>{policy.universityName}</strong> to formally inform you that your ward, <strong>{notice.studentName}</strong> (Roll No. <strong>{notice.rollNumber}</strong>), is currently facing a severe shortage of attendance in the course outlined below for <strong>{policy.academicTerm}</strong>.
            </p>

            {/* Attendance Matrix Table */}
            <table className="w-full text-xs font-sans border-collapse border border-slate-300 my-3">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-800 border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-left">Course Code & Title</th>
                  <th className="border border-slate-300 p-2 text-center">Sessions Conducted</th>
                  <th className="border border-slate-300 p-2 text-center">Sessions Attended</th>
                  <th className="border border-slate-300 p-2 text-center">Current Attendance %</th>
                  <th className="border border-slate-300 p-2 text-center">Mandatory Cutoff</th>
                  <th className="border border-slate-300 p-2 text-center">Deficit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium">
                    {notice.courseCode}: {notice.courseName}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{notice.heldCount}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{notice.attendedCount}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-rose-700">
                    {notice.currentPercentage}%
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{notice.requiredPercentage}%</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-rose-700">
                    -{deficit}%
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>Citation of University Statutory Regulations:</strong> As per Section 7.2 of the University Academic Regulations:
            </p>

            <blockquote className="p-3 bg-slate-50 border-l-2 border-slate-400 italic text-[11px] text-slate-700">
              "A candidate shall be permitted to appear for the End-Semester University Examinations in any given course only if he/she maintains a minimum cumulative attendance of {policy.minimumThreshold}% in that course. Candidates securing between {policy.condonationBandMin}% and {policy.minimumThreshold}% may be condoned solely on genuine medical grounds certified by the University Health Officer. Candidates having less than {policy.condonationBandMin}% shall be strictly detained and declared debarred."
            </blockquote>

            <p>
              {isDebarred ? (
                <span className="font-semibold text-rose-900">
                  Consequent to having attendance below the {policy.criticalDebarmentThreshold}% debarment threshold, your ward's semester examination hall ticket has been provisionally withheld. You are advised to immediately report to the Office of the Head of Department for a formal hearing.
                </span>
              ) : (
                <span>
                  Please ensure that your ward attends all remaining lecture sessions without failure. Immediate corrective attendance is imperative to restore eligibility prior to the issuance of examination hall tickets.
                </span>
              )}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-sans text-slate-800">
            <div>
              <div className="h-10 border-b border-slate-400 w-44 flex items-end pb-1 font-serif italic text-slate-600">
                Dr. Arthur Vance
              </div>
              <p className="font-bold mt-1 text-slate-900">Course Instructor / Advisor</p>
              <p className="text-[11px] text-slate-500">Department of Computer Science</p>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-44 ml-auto flex items-end justify-end pb-1 font-serif italic text-slate-600">
                Prof. R. M. Sterling
              </div>
              <p className="font-bold mt-1 text-slate-900">Dean of Academic Affairs</p>
              <p className="text-[11px] text-slate-500">{policy.universityName}</p>
            </div>
          </div>

          {/* Tear-Off Parent Acknowledgement Undertaking Slip */}
          <div className="pt-8 border-t-2 border-dashed border-slate-400 text-xs font-sans text-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>(Tear-Off Parent / Guardian Undertaking Form)</span>
              <span>Ref: {notice.rollNumber} / {notice.courseCode}</span>
            </div>

            <p className="text-[11px] leading-relaxed">
              I, ___________________________________ (Parent / Guardian), acknowledge receipt of Attendance Warning Notice Ref: <strong>#{notice.id}</strong> regarding my ward <strong>{notice.studentName}</strong> in <strong>{notice.courseCode}</strong>. I understand that failure to secure {policy.minimumThreshold}% attendance will result in debarment from the semester examination.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 text-[11px]">
              <div>
                <span>Parent Signature: __________________</span>
              </div>
              <div>
                <span>Phone: ___________________</span>
              </div>
              <div>
                <span>Date: ____________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
