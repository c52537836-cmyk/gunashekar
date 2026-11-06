import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Check, X, FileText, Clock, AlertCircle, CheckCircle2, Search } from 'lucide-react';

export const ExcusalReviewBoard: React.FC = () => {
  const { excusals, reviewExcusal, students, courses, policy } = useAttendance();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filtered = excusals.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    const note = reviewNote[id] || (status === 'approved' ? 'Approved by Academic Affairs Officer' : 'Insufficient medical evidence');
    reviewExcusal(id, status, note);
    setActionSuccess(`Petition marked as ${status.toUpperCase()}. Student attendance record updated.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Student Excusal & Medical Leave Petitions</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review student hospital discharge certificates, sports duty representations, and conference leaves. Approved entries credit to cumulative attendance.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({excusals.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending Review ({excusals.filter((e) => e.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'approved'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Approved ({excusals.filter((e) => e.status === 'approved').length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="underline text-xs">Dismiss</button>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-500 text-xs">
            No petitions found under this filter.
          </div>
        ) : (
          filtered.map((exc) => {
            return (
              <div
                key={exc.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {exc.studentName}
                    </span>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      {exc.rollNumber}
                    </span>
                    <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {exc.courseCode}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        exc.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : exc.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {exc.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold capitalize">{exc.reason.replace('_', ' ')} Leave</span> on{' '}
                    <span className="font-mono font-semibold">{exc.date}</span>: {exc.description}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{exc.documentName || 'Certificate_Scan.pdf'}</span>
                    </span>
                    <span>·</span>
                    <span>Submitted: {exc.submittedAt}</span>
                    {exc.reviewedAt && (
                      <>
                        <span>·</span>
                        <span>Reviewed: {exc.reviewedAt}</span>
                      </>
                    )}
                  </div>

                  {exc.reviewerNotes && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                      <strong>Decision Remark:</strong> {exc.reviewerNotes}
                    </div>
                  )}
                </div>

                {exc.status === 'pending' ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <input
                      type="text"
                      placeholder="Reviewer remarks..."
                      value={reviewNote[exc.id] || ''}
                      onChange={(e) =>
                        setReviewNote((prev) => ({ ...prev, [exc.id]: e.target.value }))
                      }
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none min-w-[200px]"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(exc.id, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleAction(exc.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-xs text-slate-400">
                    Decision recorded
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
