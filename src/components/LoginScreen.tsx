import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  GraduationCap, 
  KeyRound, 
  Calendar, 
  UserCheck, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Mail,
  Building,
  ExternalLink
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { policy, loginStudent, loginFaculty, students, facultyList } = useAttendance();

  const [activeTab, setActiveTab] = useState<'student' | 'faculty'>('student');
  
  // Student inputs
  const [usn, setUsn] = useState('');
  const [studentDob, setStudentDob] = useState('2004-03-15');

  // Faculty inputs
  const [facultyId, setFacultyId] = useState('MIT-FAC-01');
  const [facultyDob, setFacultyDob] = useState('1978-08-15');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!usn.trim() || !studentDob.trim()) {
      setErrorMessage('Please enter both your University Seat Number (USN) and Date of Birth.');
      return;
    }
    const res = loginStudent(usn, studentDob);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your USN and Date of Birth.');
    }
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!facultyId.trim() || !facultyDob.trim()) {
      setErrorMessage('Please enter both your Faculty Employee ID and Date of Birth.');
      return;
    }
    const res = loginFaculty(facultyId, facultyDob);
    if (!res.success) {
      setErrorMessage(res.error || 'Faculty login failed. Please verify credentials.');
    }
  };

  const quickLoginStudent = (demoUsn: string, demoDob: string) => {
    setUsn(demoUsn);
    setStudentDob(demoDob);
    setErrorMessage(null);
    loginStudent(demoUsn, demoDob);
  };

  const quickLoginFaculty = (demoId: string, demoDob: string) => {
    setFacultyId(demoId);
    setFacultyDob(demoDob);
    setErrorMessage(null);
    loginFaculty(demoId, demoDob);
  };

  const scrollToLogin = () => {
    const el = document.getElementById('login-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src="/src/assets/images/college_crest_seal_1793941514851.jpg"
              alt="Maharaja Institute of Technology Mysore Crest"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-amber-500/50 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  Maharaja Institute of Technology Mysore
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase tracking-wider">
                  MITM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Affiliated to VTU Belagavi · Approved by AICTE · Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 sm:p-8 backdrop-blur-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mission & Highlights */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Year 2025–2026 · 5th Semester B.E. (CSE)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                College Attendance, Continuous Evaluation & Shortage Warning System
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Official academic governance portal for <strong>Maharaja Institute of Technology Mysore</strong>. 
                Continuously tracks lecture attendance, enforces the statutory 75% VTU criteria, automates 
                parental shortage warning notices, and maintains Continuous Internal Evaluation (CIE) marksheets.
              </p>

              {/* Key Regulation Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                  <div className="text-lg font-black font-mono text-emerald-400">75%</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Mandatory Minimum</div>
                  <div className="text-[10px] text-slate-400">For VTU Exam Hall Ticket</div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                  <div className="text-lg font-black font-mono text-rose-400">&lt;65%</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Debarment Cutoff</div>
                  <div className="text-[10px] text-slate-400">Strict Non-Eligibility</div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                  <div className="text-lg font-black font-mono text-amber-400">3-Stage</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Automated Alerts</div>
                  <div className="text-[10px] text-slate-400">Advisory, Warning & Debar</div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl">
                  <div className="text-lg font-black font-mono text-indigo-400">CIE + SGPA</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Marks & Grades</div>
                  <div className="text-[10px] text-slate-400">Continuous Assessment</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('student');
                    scrollToLogin();
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Login (USN & DOB)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('faculty');
                    scrollToLogin();
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700 shadow-xs transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Faculty & HOD Console</span>
                </button>
              </div>
            </div>

            {/* Right Column: Authentic Campus Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-xl group">
                <img
                  src="/src/assets/images/mitm_college_campus_1793942454848.jpg"
                  alt="Maharaja Institute of Technology Mysore Engineering College Campus"
                  className="w-full h-[260px] sm:h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Maharaja Institute of Technology Mysore (MITM)</div>
                      <div className="text-[11px] text-slate-400">Belawadi, Srirangapatna Taluk, Mandya - 571477</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1-Click Instant Previews (Try Any Scenario Immediately) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>One-Click Instant Access (Explore Without Typing)</span>
            </div>
            <span className="text-xs text-slate-400">Click any card below to launch directly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Alex Rivera - Debarred Shortage */}
            <button
              type="button"
              onClick={() => quickLoginStudent('4MH21CS001', '2004-03-15')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-rose-900/60 hover:border-rose-600/80 text-left transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Alex Rivera
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  Debarred
                </span>
              </div>
              <div className="font-mono text-xs text-rose-400 font-bold mt-1">
                USN: 4MH21CS001 · 62.5% Attendance
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Critical shortage in 3 subjects. Official debarment notice issued; hall ticket withheld.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <span>Test Debarment Portal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Maya Patel - Advisory Shortage */}
            <button
              type="button"
              onClick={() => quickLoginStudent('4MH21CS002', '2004-07-22')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-900/60 hover:border-amber-600/80 text-left transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Maya Patel
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Advisory Risk
                </span>
              </div>
              <div className="font-mono text-xs text-amber-400 font-bold mt-1">
                USN: 4MH21CS002 · 71.9% Attendance
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Borderline attendance. Automated recovery calculator shows +4 classes needed to clear 75%.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <span>Test Advisory Portal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Julian Hayes - Safe Standing */}
            <button
              type="button"
              onClick={() => quickLoginStudent('4MH21CS003', '2004-11-08')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-emerald-900/60 hover:border-emerald-600/80 text-left transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  Julian Hayes
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Safe (Cleared)
                </span>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold mt-1">
                USN: 4MH21CS003 · 93.8% Attendance
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Regular attendance across all courses. Full exam eligibility, 8.8 SGPA, and 6 bunk allowance.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>Test Regular Portal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Prof. Dr. Arthur Vance - Faculty Console */}
            <button
              type="button"
              onClick={() => quickLoginFaculty('MIT-FAC-01', '1978-08-15')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-indigo-900/60 hover:border-indigo-600/80 text-left transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Prof. Dr. Arthur Vance
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Faculty HOD
                </span>
              </div>
              <div className="font-mono text-xs text-indigo-400 font-bold mt-1">
                ID: MIT-FAC-01 · Head of Department
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Alter student details by USN, adjust marks/grades (IA & Lab), auto-scan and dispatch warnings.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                <span>Enter Faculty Console</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </section>

        {/* Authentication Card Section */}
        <section id="login-section" className="max-w-xl mx-auto pt-4">
          <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
            <div className="text-center pb-5 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Official MITM Academic Credential Gateway
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Sign in to Your Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered credentials below to access records
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="mt-6 flex p-1 bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Login (USN & DOB)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('faculty');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Faculty / Staff Login</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-950/70 border border-rose-800 text-rose-200 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Student Form */}
            {activeTab === 'student' ? (
              <form onSubmit={handleStudentSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    University Seat Number (USN) *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4MH21CS001"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono tracking-wider uppercase bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Available sample USNs: 4MH21CS001, 4MH21CS002, 4MH21CS003 to 4MH21CS010
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Date of Birth (as per College Admission Form) *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={studentDob}
                      onChange={(e) => setStudentDob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Access Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Faculty Form */
              <form onSubmit={handleFacultySubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Faculty Employee ID *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MIT-FAC-01"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono uppercase bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sample faculty IDs: MIT-FAC-01 (Prof. Dr. Vance, HOD) or MIT-FAC-02 (Dr. Ramanathan)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={facultyDob}
                      onChange={(e) => setFacultyDob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Access Faculty Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Institutional Regulations Overview */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-white">
              Institutional Regulations & Academic Policies
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guidelines enforced across Maharaja Institute of Technology Mysore under VTU directives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                75%
              </div>
              <h3 className="font-bold text-sm text-white">Statutory Attendance Rule</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As per VTU regulations, students must maintain a minimum of 75% attendance in each registered theory and laboratory subject to secure examination hall ticket clearance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">3-Stage Shortage Warnings</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The automated warning engine detects deficits daily: Stage 1 Advisory Notice (&lt;75%), Stage 2 Formal Warning Notice to Parents (&lt;70%), and Stage 3 Debarment Hearing (&lt;65%).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Continuous Evaluation (CIE)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Faculty can alter and maintain continuous marks for IA-1, IA-2, IA-3, Assignments, and Lab components. Final SGPA and letter grades are calculated in accordance with VTU standards.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Official Institutional Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/college_crest_seal_1793941514851.jpg"
              alt="MITM Seal"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
            />
            <div>
              <div className="font-bold text-white">Maharaja Institute of Technology Mysore (MITM)</div>
              <div className="text-[11px] text-slate-500">Belawadi, Srirangapatna Taluk, Mandya, Karnataka 571477</div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            <div>Department of Computer Science & Engineering · Academic Year 2025–2026</div>
            <div>Affiliated to Visvesvaraya Technological University (VTU), Belagavi</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
