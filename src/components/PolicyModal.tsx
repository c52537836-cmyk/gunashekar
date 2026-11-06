import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Settings, X, RotateCcw, Save, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  const { policy, updatePolicy, resetAllData } = useAttendance();

  const [minThreshold, setMinThreshold] = useState<number>(policy.minimumThreshold);
  const [condonationMin, setCondonationMin] = useState<number>(policy.condonationBandMin);
  const [debarmentCutoff, setDebarmentCutoff] = useState<number>(policy.criticalDebarmentThreshold);
  const [autoScan, setAutoScan] = useState<boolean>(policy.autoScanOnAttendanceMark);
  const [allowMedical, setAllowMedical] = useState<boolean>(policy.allowMedicalExcusals);
  const [term, setTerm] = useState<string>(policy.academicTerm);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePolicy({
      minimumThreshold: minThreshold,
      condonationBandMin: condonationMin,
      criticalDebarmentThreshold: debarmentCutoff,
      autoScanOnAttendanceMark: autoScan,
      allowMedicalExcusals: allowMedical,
      academicTerm: term,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all attendance data, notices, and student records back to default demo state?')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              University Attendance Regulations & Policy
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Academic Term / Semester
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={minThreshold}
                onChange={(e) => setMinThreshold(parseInt(e.target.value) || 75)}
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Standard college cutoff</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condonation Band (%)
              </label>
              <input
                type="number"
                min={50}
                max={minThreshold}
                value={condonationMin}
                onChange={(e) => setCondonationMin(parseInt(e.target.value) || 65)}
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Medical pardon zone</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Debarment Cutoff (%)
              </label>
              <input
                type="number"
                min={40}
                max={condonationMin}
                value={debarmentCutoff}
                onChange={(e) => setDebarmentCutoff(parseInt(e.target.value) || 60)}
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white text-rose-600"
              />
              <span className="text-[10px] text-slate-400">Exam hall ticket hold</span>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScan}
                onChange={(e) => setAutoScan(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>Auto-Scan on Roll Call:</strong> Automatically detect shortages immediately whenever a faculty marks attendance.
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowMedical}
                onChange={(e) => setAllowMedical(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>Credit Approved Medical / OD:</strong> Count approved doctor excusals and sports on-duty certificates as present.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saved ? 'Saved!' : 'Save Regulations'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
