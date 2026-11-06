import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Bell, 
  GraduationCap, 
  ShieldAlert, 
  CalendarCheck, 
  FileText, 
  Settings, 
  UserCheck,
  Radar,
  Award,
  LogOut,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenPolicy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenNotifications,
  onOpenPolicy,
}) => {
  const { 
    activeRole, 
    setActiveRole, 
    activeStudentId, 
    setActiveStudentId, 
    students,
    notices,
    currentSession,
    logout,
    runAutomatedShortageScan,
    unreadAlertsCount,
    policy
  } = useAttendance();

  const handleScanClick = () => {
    runAutomatedShortageScan();
    onOpenNotifications();
  };

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Top Banner & Context Info */}
      <div className="flex items-center justify-between gap-8 px-6 py-3">
        {/* Zone 1: College wordmark with crest - Returns to Starting Page */}
        <button
          onClick={logout}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="Return to Maharaja Institute of Technology Starting Page"
        >
          <img 
            src="/src/assets/images/college_crest_seal_1793941514851.jpg" 
            alt="MITM College Crest" 
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-amber-500/40 shadow-xs group-hover:scale-105 transition-transform" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
                MITM Mysore
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                Home
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate max-w-[220px] block">
              {policy.universityName}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {activeRole === 'faculty' ? (
            <>
              <button
                onClick={() => onTabChange('overview')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'overview'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onTabChange('shortage-registry')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'shortage-registry'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Shortage Registry
              </button>
              <button
                onClick={() => onTabChange('mark-attendance')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'mark-attendance'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Daily Roll Call
              </button>
              <button
                onClick={() => onTabChange('marks-grades')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'marks-grades'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Marks & Grades (CIE)
              </button>
              <button
                onClick={() => onTabChange('students-roster')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'students-roster'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                USN Directory
              </button>
              <button
                onClick={() => onTabChange('excusals')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'excusals'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Excusal Petitions
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onTabChange('student-portal')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'student-portal'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Attendance Sheet
              </button>
              <button
                onClick={() => onTabChange('student-marks')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'student-marks'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Marks & SGPA
              </button>
              <button
                onClick={() => onTabChange('bunk-calculator')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'bunk-calculator'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bunk & Margin Predictor
              </button>
              <button
                onClick={() => onTabChange('warning-letters')}
                className={`whitespace-nowrap transition-colors pb-0.5 ${
                  currentTab === 'warning-letters'
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Notices & Advisories
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions, Portal Switcher & Notification Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Account / Role Badge */}
          {currentSession ? (
            currentSession.role === 'student' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentSession.user.name}
                  </span>
                  <span className="ml-1.5 font-mono text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                    USN: {currentSession.user.identifier}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">
                  Student (Read-Only)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentSession.user.name}
                  </span>
                  <span className="ml-1.5 font-mono text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
                    Staff ID: {currentSession.user.identifier}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded">
                  Teacher (Full Access)
                </span>
              </div>
            )
          ) : null}

          {/* Student Selector when in Student View for Faculty preview only */}
          {activeRole === 'student' && currentSession?.role === 'faculty' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-[#f0e2ec] rounded-md px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                style={{ borderColor: '#f0e2ec' }}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.usn})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Automated Shortage Scan Button (for Faculty) */}
          {activeRole === 'faculty' && (
            <button
              onClick={handleScanClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors whitespace-nowrap"
              title="Scan all student attendance records and generate shortage warnings automatically"
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Auto-Scan</span>
            </button>
          )}

          {/* Policy Settings Icon */}
          <button
            onClick={onOpenPolicy}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="MITM Attendance & Grading Regulations"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications Drawer Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Shortage Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Dedicated Starting Page Button */}
          <button
            onClick={logout}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Return to Maharaja Institute of Technology Starting Page"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Starting Page</span>
          </button>

          {/* Logout / Switch User */}
          <button
            onClick={logout}
            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Sign out of MITM Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav row for small screens */}
      <div className="lg:hidden flex items-center gap-4 px-6 py-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={logout}
          className="whitespace-nowrap flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Starting Page</span>
        </button>
        {activeRole === 'faculty' ? (
          <>
            <button
              onClick={() => onTabChange('overview')}
              className={`whitespace-nowrap ${currentTab === 'overview' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('shortage-registry')}
              className={`whitespace-nowrap ${currentTab === 'shortage-registry' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Shortages
            </button>
            <button
              onClick={() => onTabChange('mark-attendance')}
              className={`whitespace-nowrap ${currentTab === 'mark-attendance' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Roll Call
            </button>
            <button
              onClick={() => onTabChange('marks-grades')}
              className={`whitespace-nowrap ${currentTab === 'marks-grades' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Marks & Grades
            </button>
            <button
              onClick={() => onTabChange('students-roster')}
              className={`whitespace-nowrap ${currentTab === 'students-roster' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              USN Directory
            </button>
            <button
              onClick={() => onTabChange('excusals')}
              className={`whitespace-nowrap ${currentTab === 'excusals' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Excusals
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onTabChange('student-portal')}
              className={`whitespace-nowrap ${currentTab === 'student-portal' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              My Attendance
            </button>
            <button
              onClick={() => onTabChange('student-marks')}
              className={`whitespace-nowrap ${currentTab === 'student-marks' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Marks & SGPA
            </button>
            <button
              onClick={() => onTabChange('bunk-calculator')}
              className={`whitespace-nowrap ${currentTab === 'bunk-calculator' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Bunk Predictor
            </button>
            <button
              onClick={() => onTabChange('warning-letters')}
              className={`whitespace-nowrap ${currentTab === 'warning-letters' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
            >
              Warnings
            </button>
          </>
        )}
      </div>
    </header>
  );
};
