import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Calendar, 
  KeyRound,
  GraduationCap,
  Sparkles,
  LogIn,
  X
} from 'lucide-react';
import { Student } from '../types/attendance';

export const StudentManager: React.FC = () => {
  const { 
    students, 
    courses, 
    policy, 
    addStudentByUSN, 
    deleteStudent, 
    editStudent, 
    bulkEnrollStudents,
    getStudentOverallSummary,
    loginStudent
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [newUsn, setNewUsn] = useState('');
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('2004-06-15');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98450 00000');
  const [newParentName, setNewParentName] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('+91 94480 00000');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Engineering');
  const [newSemester, setNewSemester] = useState(5);
  const [newSection, setNewSection] = useState('A');
  const [initialAttProfile, setInitialAttProfile] = useState<number>(85);

  // Bulk paste text
  const [bulkText, setBulkText] = useState(
`4MH21CS011, Rahul Kumar, 2004-05-18, rahul.k@mit.ac.in
4MH21CS012, Sneha Patil, 2004-09-22, sneha.p@mit.ac.in
4MH21CS013, Karthik Gowda, 2004-01-14, karthik.g@mit.ac.in`
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Edit Student Form State
  const [editUsn, setEditUsn] = useState('');
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSemester, setEditSemester] = useState(5);
  const [editSection, setEditSection] = useState('A');

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditUsn(student.usn);
    setEditName(student.name);
    setEditDob(student.dateOfBirth);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setEditParentName(student.parentName);
    setEditParentEmail(student.parentEmail);
    setEditParentPhone(student.parentPhone);
    setEditDepartment(student.department);
    setEditSemester(student.semester);
    setEditSection(student.section);
    setFormError(null);
  };

  const handleSaveEditedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editUsn.trim() || !editName.trim() || !editDob.trim()) {
      setFormError('USN, Full Name, and Date of Birth are mandatory.');
      return;
    }

    editStudent(editingStudent.id, {
      usn: editUsn.trim().toUpperCase(),
      rollNumber: editUsn.trim().toUpperCase(),
      name: editName.trim(),
      dateOfBirth: editDob.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      parentName: editParentName.trim(),
      parentEmail: editParentEmail.trim(),
      parentPhone: editParentPhone.trim(),
      department: editDepartment.trim(),
      semester: Number(editSemester),
      section: editSection.trim(),
    });

    setSuccessBanner(`Successfully altered all details for ${editName.trim()} (${editUsn.trim().toUpperCase()}).`);
    setEditingStudent(null);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newUsn.trim() || !newName.trim() || !newDob.trim()) {
      setFormError('USN, Full Name, and Date of Birth are mandatory.');
      return;
    }

    const email = newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '.')}@mit.ac.in`;
    const parentEmail = newParentEmail.trim() || 'parent@example.com';

    const res = addStudentByUSN(
      {
        usn: newUsn.trim().toUpperCase(),
        rollNumber: newUsn.trim().toUpperCase(),
        name: newName.trim(),
        dateOfBirth: newDob.trim(),
        email,
        phone: newPhone.trim(),
        parentName: newParentName.trim() || 'Parent / Guardian',
        parentEmail,
        parentPhone: newParentPhone.trim(),
        department: newDepartment,
        semester: newSemester,
        section: newSection,
      },
      initialAttProfile
    );

    if (!res.success) {
      setFormError(res.error || 'Failed to enroll student.');
      return;
    }

    setSuccessBanner(`Student ${newName} with USN ${newUsn.toUpperCase()} enrolled successfully in MITM database!`);
    setShowAddModal(false);
    resetForm();
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsedList: Array<{ usn: string; name: string; dateOfBirth: string; email?: string }> = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        parsedList.push({
          usn: parts[0],
          name: parts[1],
          dateOfBirth: parts[2],
          email: parts[3],
        });
      }
    }

    if (parsedList.length === 0) {
      setFormError('Please provide students in CSV format: USN, Full Name, YYYY-MM-DD');
      return;
    }

    const res = bulkEnrollStudents(parsedList);
    setSuccessBanner(`Bulk enrollment complete: ${res.added} student(s) included based on their USN.`);
    setShowBulkModal(false);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const resetForm = () => {
    setNewUsn('');
    setNewName('');
    setNewDob('2004-06-15');
    setNewEmail('');
    setNewParentName('');
    setNewParentEmail('');
    setInitialAttProfile(85);
  };

  const handleDelete = (student: Student) => {
    if (window.confirm(`Are you sure you want to remove ${student.name} (USN: ${student.usn}) from Maharaja Institute of Technology records?`)) {
      deleteStudent(student.id);
      setSuccessBanner(`Student ${student.name} (${student.usn}) removed.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  const handleDirectLogin = (student: Student) => {
    loginStudent(student.usn, student.dateOfBirth);
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
              Teacher Interface
            </span>
            <span>·</span>
            <span>Student Names & USN Admission Roster</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Student Name & USN Directory (Teacher Entry)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Teacher-exclusive console to enter student names, enroll by USN, and alter student admission records. Students have read-only access and cannot alter names or roster entries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBulkModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Import USNs</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student by USN</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Search and Stats */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student USN (e.g. 4MH21CS001) or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Total Registered: <strong className="text-slate-800 dark:text-white">{students.length}</strong> students in Semester 5 (Sec A)
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">University Seat Number (USN)</th>
                <th className="py-3 px-4">Student Full Name</th>
                <th className="py-3 px-4 text-center">Date of Birth (Login DOB)</th>
                <th className="py-3 px-4">Contact & Parent Email</th>
                <th className="py-3 px-4 text-center">Attendance Standing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((student) => {
                const overall = getStudentOverallSummary(student.id);
                const isShortage = overall.overallStatus === 'shortage' || overall.overallStatus === 'critical';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded">
                        {student.usn}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {student.department} · Sec {student.section}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                      {student.dateOfBirth}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-700 dark:text-slate-300">
                        {student.email}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Parent: {student.parentEmail}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isShortage
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {overall.overallPercentage}%
                      </span>
                      {isShortage && (
                        <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                          {overall.shortageCoursesCount} subjects shortage
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(student)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Alter all student details (USN, DOB, contact, parent records)"
                        >
                          <Edit3 className="w-3 h-3 text-indigo-500" />
                          <span>Alter Details</span>
                        </button>

                        <button
                          onClick={() => handleDirectLogin(student)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-2 py-1 bg-indigo-50 dark:bg-indigo-950 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
                          title="Simulate portal login as this student"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Portal</span>
                        </button>

                        <button
                          onClick={() => handleDelete(student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Remove student from MITM registry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student by USN Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Enroll New Student Based on USN
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    University Seat Number (USN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4MH21CS011"
                    value={newUsn}
                    onChange={(e) => setNewUsn(e.target.value.toUpperCase())}
                    className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth (Login DOB) *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College Email
                  </label>
                  <input
                    type="email"
                    placeholder="rahul.k@mit.ac.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Kumar"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent Email (For Shortage Dispatches)
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Attendance Standing Profile
                </label>
                <select
                  value={initialAttProfile}
                  onChange={(e) => setInitialAttProfile(parseInt(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  <option value={88}>Safe Standing (88% - Regular Student)</option>
                  <option value={96}>High Attender (96% - Excellent Attendance)</option>
                  <option value={72}>Borderline Risk (72% - Triggers Advisory Shortage Warning)</option>
                  <option value={55}>Critical Shortage (55% - Triggers Debarment Warning Notice)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Automatically initializes lecture session records and internal marks for all 5 department courses.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-xs"
                >
                  Enroll in MITM Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Bulk Include Students by USN Roster
                </h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paste Student Entries (CSV: USN, Full Name, YYYY-MM-DD, Email)
                </label>
                <textarea
                  rows={6}
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full font-mono text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-xs"
                >
                  Import All by USN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Alter Student Details Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Alter Student Academic & Contact Details
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Update student records, USN identity, and parental contact details for automated warnings
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingStudent(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditedStudent} className="space-y-4 text-xs">
              {/* Section 1: Academic Identity */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-700/50">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Academic & University Seat Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      University Seat Number (USN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editUsn}
                      onChange={(e) => setEditUsn(e.target.value.toUpperCase())}
                      className="w-full font-mono uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth (Login DOB) *
                    </label>
                    <input
                      type="date"
                      required
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Department
                    </label>
                    <input
                      type="text"
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sem & Sec
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={editSemester}
                        onChange={(e) => setEditSemester(parseInt(e.target.value) || 5)}
                        className="w-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white text-center"
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={editSection}
                        onChange={(e) => setEditSection(e.target.value.toUpperCase())}
                        className="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white text-center uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-700/50">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Student & Parental Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student College Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student Mobile Phone
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={editParentName}
                      onChange={(e) => setEditParentName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent Email (For Notices)
                    </label>
                    <input
                      type="email"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parent Mobile (SMS)
                    </label>
                    <input
                      type="text"
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Commit & Save Alterations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
