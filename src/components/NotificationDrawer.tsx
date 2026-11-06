import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  X, 
  Send, 
  Mail, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLetter: (noticeId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenLetter,
}) => {
  const { 
    notices, 
    dispatchNotice, 
    batchDispatchAllQueued, 
    acknowledgeNotice, 
    activeRole, 
    activeStudentId,
    students
  } = useAttendance();

  const [previewNoticeId, setPreviewNoticeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const relevantNotices = activeRole === 'student'
    ? notices.filter((n) => n.studentId === activeStudentId)
    : notices;

  const queued = relevantNotices.filter((n) => n.status === 'queued');
  const dispatched = relevantNotices.filter((n) => n.status === 'dispatched');
  const acknowledged = relevantNotices.filter((n) => n.status === 'acknowledged');

  const selectedPreview = notices.find((n) => n.id === previewNoticeId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Automated Warning Dispatch Center
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Batch Dispatch Action */}
        {activeRole === 'faculty' && queued.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-800 dark:text-amber-200">
              {queued.length} warning notice(s) pending dispatch
            </span>
            <button
              onClick={() => batchDispatchAllQueued()}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-xs text-xs"
            >
              <Send className="w-3 h-3" />
              <span>Send All</span>
            </button>
          </div>
        )}

        {/* List of Notices */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {relevantNotices.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No attendance shortage notices found.
            </div>
          ) : (
            relevantNotices.map((notice) => {
              const isDebarred = notice.warningLevel === 'L3_Debarment';
              return (
                <div
                  key={notice.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                    isDebarred
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {notice.studentName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {notice.rollNumber}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                        {notice.courseCode} · {notice.courseName}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        isDebarred
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {notice.currentPercentage}%
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {notice.remarks}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{notice.parentEmail}</span>
                    </span>
                    <span>{notice.generatedAt}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onOpenLetter(notice.id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Letter</span>
                      </button>

                      <button
                        onClick={() => setPreviewNoticeId(notice.id)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Preview SMS/Email
                      </button>
                    </div>

                    {activeRole === 'student' ? (
                      notice.status !== 'acknowledged' ? (
                        <button
                          onClick={() => acknowledgeNotice(notice.id)}
                          className="px-2.5 py-1 text-[11px] bg-indigo-600 text-white rounded font-medium"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )
                    ) : notice.status === 'queued' ? (
                      <button
                        onClick={() => dispatchNotice(notice.id, ['email', 'in_app', 'sms'])}
                        className="px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Dispatch
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] capitalize">
                        {notice.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dispatch Message Preview Modal */}
        {selectedPreview && (
          <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Automated Multi-Channel Notification Preview
                </h3>
                <button onClick={() => setPreviewNoticeId(null)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Mock */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email to Parent & Student</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  To: {selectedPreview.parentEmail}
                </div>
                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  Subject: OFFICIAL: Attendance Shortage Warning for {selectedPreview.studentName} ({selectedPreview.courseCode})
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Dear Parent/Guardian, This is an automated advisory from the Academic Board. Your ward {selectedPreview.studentName} has secured {selectedPreview.currentPercentage}% in {selectedPreview.courseCode}, which is below the mandatory 75% cutoff. Please ensure immediate remedial attendance.
                </p>
              </div>

              {/* SMS Mock */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS Alert (Dispatched to Registered Mobile)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  [MITM MYSORE] ALERT: {selectedPreview.studentName} attendance in {selectedPreview.courseCode} is {selectedPreview.currentPercentage}% (Shortage). Exam hall ticket may be held. Check portal: mitmysore.in
                </p>
              </div>

              <button
                onClick={() => setPreviewNoticeId(null)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
