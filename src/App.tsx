import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ShortageRegistry } from './components/ShortageRegistry';
import { AttendanceMarker } from './components/AttendanceMarker';
import { MarksGradeManager } from './components/MarksGradeManager';
import { StudentPortal } from './components/StudentPortal';
import { StudentManager } from './components/StudentManager';
import { ExcusalReviewBoard } from './components/ExcusalReviewModal';
import { WarningLetterModal } from './components/WarningLetterModal';
import { PolicyModal } from './components/PolicyModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeRole, currentSession, policy } = useAttendance();
  const isTeacher = currentSession?.role === 'faculty';
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedNoticeIdForLetter, setSelectedNoticeIdForLetter] = useState<string | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);

  // If no user is logged in, show the USN and Date of Birth Login Screen
  if (!currentSession) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenPolicy={() => setIsPolicyModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isTeacher ? (
          <>
            {currentTab === 'overview' && (
              <FacultyDashboard
                onNavigateTab={setCurrentTab}
                onOpenLetterModal={(id) => setSelectedNoticeIdForLetter(id)}
              />
            )}
            {currentTab === 'shortage-registry' && (
              <ShortageRegistry
                onOpenLetterModal={(id) => setSelectedNoticeIdForLetter(id)}
              />
            )}
            {currentTab === 'mark-attendance' && <AttendanceMarker />}
            {currentTab === 'marks-grades' && <MarksGradeManager />}
            {currentTab === 'students-roster' && <StudentManager />}
            {currentTab === 'excusals' && <ExcusalReviewBoard />}
          </>
        ) : (
          <StudentPortal
            onOpenLetterModal={(id) => setSelectedNoticeIdForLetter(id)}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <WarningLetterModal
        noticeId={selectedNoticeIdForLetter}
        onClose={() => setSelectedNoticeIdForLetter(null)}
      />

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onOpenLetter={(id) => setSelectedNoticeIdForLetter(id)}
      />

      {/* Editorial Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Maharaja Institute of Technology Mysore (MITM)
            </span>
            <span>· Academic Attendance & Examination Eligibility System</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Mandatory Cutoff: {policy.minimumThreshold}%</span>
            <span>·</span>
            <span>Debarment Threshold: {policy.criticalDebarmentThreshold}%</span>
            <span>·</span>
            <span>Term: {policy.academicTerm}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <MainContent />
    </AttendanceProvider>
  );
}
