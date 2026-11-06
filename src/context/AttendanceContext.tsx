import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Student,
  Course,
  AttendanceRecord,
  WarningNotice,
  ExcusalRequest,
  UniversityPolicy,
  AttendanceStatus,
  AttendanceSummary,
  ShortageLevel,
  FacultyUser,
  AuthSession,
  StudentCourseGrade,
} from '../types/attendance';
import {
  initialPolicy,
  initialCourses,
  initialStudents,
  initialFaculty,
  generateInitialRecords,
  initialNotices,
  initialExcusals,
  generateInitialGrades,
  calculateGradeFromMarks,
} from '../data/initialData';
import { calculateSummary } from '../utils/attendanceCalculator';

interface AttendanceContextType {
  policy: UniversityPolicy;
  students: Student[];
  courses: Course[];
  records: AttendanceRecord[];
  notices: WarningNotice[];
  excusals: ExcusalRequest[];
  facultyList: FacultyUser[];
  currentSession: AuthSession | null;
  activeRole: 'faculty' | 'student';
  activeStudentId: string;
  setActiveRole: (role: 'faculty' | 'student') => void;
  setActiveStudentId: (id: string) => void;
  grades: StudentCourseGrade[];
  updateStudentMarks: (studentId: string, courseId: string, marks: Partial<StudentCourseGrade>) => void;

  // Authentication
  loginStudent: (usn: string, dob: string) => { success: boolean; error?: string };
  loginFaculty: (facultyId: string, dob: string) => { success: boolean; error?: string };
  logout: () => void;

  // Actions
  markBatchAttendance: (
    courseId: string,
    date: string,
    sessionNumber: number,
    statuses: Record<string, { status: AttendanceStatus; notes?: string }>
  ) => { newlyInShortage: string[] };

  runAutomatedShortageScan: () => {
    generatedCount: number;
    affectedStudents: number;
  };

  dispatchNotice: (noticeId: string, channels: ('in_app' | 'email' | 'sms')[]) => void;
  batchDispatchAllQueued: () => number;
  acknowledgeNotice: (noticeId: string) => void;
  submitExcusal: (request: {
    studentId: string;
    courseId: string;
    date: string;
    reason: 'medical' | 'sports_cultural' | 'family_emergency' | 'academic_conference';
    description: string;
    documentName?: string;
  }) => void;
  reviewExcusal: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  updatePolicy: (updates: Partial<UniversityPolicy>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addStudentByUSN: (
    student: Omit<Student, 'id'>,
    initialAttendancePercent?: number
  ) => { success: boolean; error?: string; studentId?: string };
  deleteStudent: (studentId: string) => void;
  editStudent: (studentId: string, updates: Partial<Student>) => void;
  bulkEnrollStudents: (
    list: Array<{
      usn: string;
      name: string;
      dateOfBirth: string;
      email?: string;
      parentEmail?: string;
      department?: string;
      section?: string;
    }>
  ) => { added: number; errors: string[] };
  addCourse: (course: Omit<Course, 'id' | 'classesHeld'>) => void;
  resetAllData: () => void;

  // Calculations
  getStudentCourseSummary: (studentId: string, courseId: string) => AttendanceSummary;
  getStudentOverallSummary: (studentId: string) => {
    totalHeld: number;
    totalAttended: number;
    overallPercentage: number;
    overallStatus: ShortageLevel;
    shortageCoursesCount: number;
    courseSummaries: { course: Course; summary: AttendanceSummary }[];
  };
  getAllShortageDefaulters: () => {
    student: Student;
    course: Course;
    summary: AttendanceSummary;
    latestNotice?: WarningNotice;
  }[];
  unreadAlertsCount: number;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'mitm_attendance_v2_';

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [policy, setPolicy] = useState<UniversityPolicy>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}policy`);
    return saved ? JSON.parse(saved) : initialPolicy;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}courses`);
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}records`);
    return saved ? JSON.parse(saved) : generateInitialRecords();
  });

  const [notices, setNotices] = useState<WarningNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notices`);
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [excusals, setExcusals] = useState<ExcusalRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}excusals`);
    return saved ? JSON.parse(saved) : initialExcusals;
  });

  const [facultyList] = useState<FacultyUser[]>(initialFaculty);
  const [grades, setGrades] = useState<StudentCourseGrade[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}grades`);
    return saved ? JSON.parse(saved) : generateInitialGrades();
  });
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(null);

  const [activeRole, setActiveRole] = useState<'faculty' | 'student'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}session`);
    if (saved) {
      try {
        const sess = JSON.parse(saved);
        return sess.user?.role || 'faculty';
      } catch {
        return 'faculty';
      }
    }
    return 'faculty';
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}session`);
    if (saved) {
      try {
        const sess = JSON.parse(saved);
        if (sess.user?.role === 'student') return sess.user.id;
      } catch {
        // fallback
      }
    }
    return 's-1';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}policy`, JSON.stringify(policy));
  }, [policy]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}records`, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}excusals`, JSON.stringify(excusals));
  }, [excusals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}grades`, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}session`, JSON.stringify(currentSession));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}session`);
    }
  }, [currentSession]);

  // Summary per student & course
  const getStudentCourseSummary = (studentId: string, courseId: string): AttendanceSummary => {
    const course = courses.find((c) => c.id === courseId);
    const totalScheduled = course ? course.totalClassesScheduled : 45;
    const studentRecords = records.filter(
      (r) => r.studentId === studentId && r.courseId === courseId
    );
    return calculateSummary(studentRecords, totalScheduled, policy);
  };

  // Overall student summary
  const getStudentOverallSummary = (studentId: string) => {
    let totalHeld = 0;
    let totalAttended = 0;
    let shortageCount = 0;
    const courseSummaries: { course: Course; summary: AttendanceSummary }[] = [];

    courses.forEach((c) => {
      const summary = getStudentCourseSummary(studentId, c.id);
      totalHeld += summary.classesHeld;
      totalAttended += summary.attended;
      if (summary.status === 'shortage' || summary.status === 'critical') {
        shortageCount += 1;
      }
      courseSummaries.push({ course: c, summary });
    });

    const raw = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 100;
    const overallPercentage = Math.round(raw * 10) / 10;

    let overallStatus: ShortageLevel = 'safe';
    if (overallPercentage < policy.criticalDebarmentThreshold) {
      overallStatus = 'critical';
    } else if (overallPercentage < policy.minimumThreshold) {
      overallStatus = 'shortage';
    } else if (overallPercentage < policy.minimumThreshold + 5) {
      overallStatus = 'borderline';
    } else {
      overallStatus = 'safe';
    }

    return {
      totalHeld,
      totalAttended,
      overallPercentage,
      overallStatus,
      shortageCoursesCount: shortageCount,
      courseSummaries,
    };
  };

  // Get all instances of shortage across entire college
  const getAllShortageDefaulters = () => {
    const defaulters: {
      student: Student;
      course: Course;
      summary: AttendanceSummary;
      latestNotice?: WarningNotice;
    }[] = [];

    students.forEach((student) => {
      courses.forEach((course) => {
        const summary = getStudentCourseSummary(student.id, course.id);
        if (summary.status === 'shortage' || summary.status === 'critical') {
          const latestNotice = notices
            .filter((n) => n.studentId === student.id && n.courseId === course.id)
            .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];

          defaulters.push({
            student,
            course,
            summary,
            latestNotice,
          });
        }
      });
    });

    return defaulters;
  };

  // Core automated shortage scan logic
  const runAutomatedShortageScan = () => {
    let generatedCount = 0;
    const affectedStudentsSet = new Set<string>();
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setNotices((prevNotices) => {
      const updatedNotices = [...prevNotices];

      students.forEach((student) => {
        courses.forEach((course) => {
          const summary = getStudentCourseSummary(student.id, course.id);

          if (summary.status === 'shortage' || summary.status === 'critical') {
            affectedStudentsSet.add(student.id);

            // Determine warning level
            let level: 'L1_Advisory' | 'L2_Critical' | 'L3_Debarment' = 'L1_Advisory';
            if (summary.percentage < policy.criticalDebarmentThreshold) {
              level = 'L3_Debarment';
            } else if (summary.percentage < policy.condonationBandMin) {
              level = 'L2_Critical';
            }

            // Check if there is already an existing active notice for this student & course
            const existingIdx = updatedNotices.findIndex(
              (n) => n.studentId === student.id && n.courseId === course.id
            );

            const remarks =
              level === 'L3_Debarment'
                ? `CRITICAL DEBARMENT NOTICE: Attendance at ${summary.percentage}% (below ${policy.criticalDebarmentThreshold}% cutoff). Student is officially barred from semester examinations pending Academic Council review.`
                : level === 'L2_Critical'
                ? `ATTENDANCE SHORTAGE WARNING: Attendance at ${summary.percentage}% is in condonation danger zone. Must attend ${summary.mustAttend} consecutive sessions to re-qualify.`
                : `ADVISORY WARNING: Attendance dipped to ${summary.percentage}%, below required ${policy.minimumThreshold}%. Deficit of ${Math.round((policy.minimumThreshold - summary.percentage) * 10) / 10}%.`;

            if (existingIdx >= 0) {
              // Update existing notice with fresh percentage
              updatedNotices[existingIdx] = {
                ...updatedNotices[existingIdx],
                currentPercentage: summary.percentage,
                attendedCount: summary.attended,
                heldCount: summary.classesHeld,
                warningLevel: level,
                remarks,
                status: updatedNotices[existingIdx].status === 'acknowledged' ? 'queued' : updatedNotices[existingIdx].status,
              };
            } else {
              // Create brand new notice
              const newNotice: WarningNotice = {
                id: `warn-auto-${Date.now()}-${student.id}-${course.id}`,
                studentId: student.id,
                studentName: student.name,
                rollNumber: student.rollNumber,
                parentEmail: student.parentEmail,
                courseId: course.id,
                courseCode: course.code,
                courseName: course.name,
                currentPercentage: summary.percentage,
                requiredPercentage: policy.minimumThreshold,
                attendedCount: summary.attended,
                heldCount: summary.classesHeld,
                warningLevel: level,
                generatedAt: timestamp,
                dispatchedChannels: ['in_app', 'email'],
                status: 'queued',
                remarks,
              };
              updatedNotices.unshift(newNotice);
              generatedCount += 1;
            }
          }
        });
      });

      return updatedNotices;
    });

    return {
      generatedCount,
      affectedStudents: affectedStudentsSet.size,
    };
  };

  // Mark attendance for a session
  const markBatchAttendance = (
    courseId: string,
    date: string,
    sessionNumber: number,
    statuses: Record<string, { status: AttendanceStatus; notes?: string }>
  ) => {
    const newlyInShortage: string[] = [];

    // Check before marking
    const priorStatuses: Record<string, ShortageLevel> = {};
    students.forEach((s) => {
      priorStatuses[s.id] = getStudentCourseSummary(s.id, courseId).status;
    });

    // Add new records (or replace if same session exists)
    setRecords((prev) => {
      // Filter out any existing records for this course, date, and session
      const filtered = prev.filter(
        (r) => !(r.courseId === courseId && r.date === date && r.sessionNumber === sessionNumber)
      );

      const newRecs: AttendanceRecord[] = Object.entries(statuses).map(([studentId, data]) => ({
        id: `rec-${courseId}-${studentId}-${date}-s${sessionNumber}`,
        studentId,
        courseId,
        date,
        sessionNumber,
        status: data.status,
        notes: data.notes,
      }));

      return [...filtered, ...newRecs];
    });

    // Increment classesHeld for the course if this is a new session
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id === courseId) {
          const maxSession = Math.max(c.classesHeld, sessionNumber);
          return { ...c, classesHeld: maxSession };
        }
        return c;
      })
    );

    // If auto scan is enabled, run scan
    if (policy.autoScanOnAttendanceMark) {
      setTimeout(() => {
        runAutomatedShortageScan();
      }, 50);
    }

    return { newlyInShortage };
  };

  const dispatchNotice = (noticeId: string, channels: ('in_app' | 'email' | 'sms')[]) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === noticeId
          ? {
              ...n,
              status: 'dispatched',
              dispatchedChannels: Array.from(new Set([...n.dispatchedChannels, ...channels])),
            }
          : n
      )
    );
  };

  const batchDispatchAllQueued = () => {
    let count = 0;
    setNotices((prev) =>
      prev.map((n) => {
        if (n.status === 'queued') {
          count += 1;
          return {
            ...n,
            status: 'dispatched',
            dispatchedChannels: ['in_app', 'email', 'sms'],
          };
        }
        return n;
      })
    );
    return count;
  };

  const acknowledgeNotice = (noticeId: string) => {
    const timestamp = new Date().toLocaleString();
    setNotices((prev) =>
      prev.map((n) =>
        n.id === noticeId
          ? {
              ...n,
              status: 'acknowledged',
              acknowledgedAt: timestamp,
            }
          : n
      )
    );
  };

  const submitExcusal = (req: {
    studentId: string;
    courseId: string;
    date: string;
    reason: 'medical' | 'sports_cultural' | 'family_emergency' | 'academic_conference';
    description: string;
    documentName?: string;
  }) => {
    const student = students.find((s) => s.id === req.studentId);
    const course = courses.find((c) => c.id === req.courseId);

    const newReq: ExcusalRequest = {
      id: `exc-${Date.now()}`,
      studentId: req.studentId,
      studentName: student ? student.name : 'Unknown Student',
      rollNumber: student ? student.rollNumber : 'REG-000',
      courseId: req.courseId,
      courseCode: course ? course.code : 'COURSE',
      date: req.date,
      reason: req.reason,
      description: req.description,
      documentName: req.documentName || 'Proof_Document.pdf',
      status: 'pending',
      submittedAt: new Date().toLocaleString(),
    };

    setExcusals((prev) => [newReq, ...prev]);
  };

  const reviewExcusal = (id: string, status: 'approved' | 'rejected', notes?: string) => {
    const target = excusals.find((e) => e.id === id);
    if (!target) return;

    setExcusals((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              reviewedAt: new Date().toLocaleString(),
              reviewerNotes: notes,
            }
          : e
      )
    );

    // If approved, update corresponding attendance record to 'excused' or 'on_duty'
    if (status === 'approved') {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.studentId === target.studentId && r.courseId === target.courseId && r.date === target.date) {
            return {
              ...r,
              status: target.reason === 'sports_cultural' || target.reason === 'academic_conference' ? 'on_duty' : 'excused',
              notes: `Excusal approved: ${notes || target.reason}`,
            };
          }
          return r;
        })
      );
    }
  };

  const updatePolicy = (updates: Partial<UniversityPolicy>) => {
    setPolicy((prev) => ({ ...prev, ...updates }));
  };

  const addStudent = (newS: Omit<Student, 'id'>) => {
    addStudentByUSN(newS, 85);
  };

  const addStudentByUSN = (
    newS: Omit<Student, 'id'>,
    initialAttendancePercent: number = 85
  ): { success: boolean; error?: string; studentId?: string } => {
    // Permission check: Only teachers have access to enter student names & details
    if (currentSession && currentSession.role !== 'faculty') {
      return { success: false, error: 'Unauthorized: Students do not have access to enter student names or roster records.' };
    }

    const cleanUSN = newS.usn.trim().toUpperCase().replace(/[-\s]/g, '');
    const cleanDOB = newS.dateOfBirth.trim();

    // Check duplicate
    const exists = students.some(
      (s) => s.usn.toUpperCase().replace(/[-\s]/g, '') === cleanUSN
    );
    if (exists) {
      return {
        success: false,
        error: `A student with USN "${newS.usn}" is already registered in Maharaja Institute of Technology records.`,
      };
    }

    const newId = `s-${Date.now()}`;
    const student: Student = {
      ...newS,
      id: newId,
      usn: newS.usn.trim().toUpperCase(),
      rollNumber: newS.rollNumber || newS.usn.trim().toUpperCase(),
      email: newS.email || `${newS.name.toLowerCase().replace(/\s+/g, '.')}@mit.ac.in`,
    };

    setStudents((prev) => [...prev, student]);

    // Baseline records for courses
    const dates = [
      '2026-09-02', '2026-09-04', '2026-09-07', '2026-09-09', '2026-09-11',
      '2026-09-14', '2026-09-16', '2026-09-18', '2026-09-21', '2026-09-23',
      '2026-09-25', '2026-09-28', '2026-09-30', '2026-10-02', '2026-10-05',
      '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-14', '2026-10-16',
      '2026-10-19', '2026-10-21', '2026-10-23', '2026-10-26', '2026-10-28',
      '2026-10-30', '2026-11-02', '2026-11-04', '2026-11-06', '2026-11-09',
      '2026-11-11', '2026-11-13'
    ];

    const newRecords: AttendanceRecord[] = [];
    const newGrades: StudentCourseGrade[] = [];

    courses.forEach((course) => {
      const held = course.classesHeld;
      let attendedCount = 0;

      for (let i = 0; i < held; i++) {
        const sessionDate = dates[i % dates.length];
        const isPresent = ((attendedCount + 1) / (i + 1)) * 100 <= initialAttendancePercent + 2;
        if (isPresent) attendedCount++;

        newRecords.push({
          id: `rec-${course.id}-${newId}-${i}`,
          studentId: newId,
          courseId: course.id,
          date: sessionDate,
          sessionNumber: i + 1,
          status: isPresent ? 'present' : 'absent',
        });
      }

      // Initial marks
      const ia1 = 22;
      const ia2 = 24;
      const ia3 = 23;
      const assignment = 8;
      const lab = 16;
      const totalMarks = 78;
      const { grade, gradePoints } = calculateGradeFromMarks(totalMarks);

      newGrades.push({
        id: `grd-${newId}-${course.id}`,
        studentId: newId,
        courseId: course.id,
        ia1,
        ia2,
        ia3,
        assignment,
        lab,
        totalMarks,
        grade,
        gradePoints,
        remarks: 'Enrolled via USN Admission Registry',
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
    });

    setRecords((prev) => [...prev, ...newRecords]);
    setGrades((prev) => [...prev, ...newGrades]);

    // Run automated scan in background
    setTimeout(() => {
      runAutomatedShortageScan();
    }, 100);

    return { success: true, studentId: newId };
  };

  const deleteStudent = (studentId: string) => {
    // Permission check: Only teachers can delete students
    if (currentSession && currentSession.role !== 'faculty') {
      console.warn('Unauthorized: Students cannot delete student records.');
      return;
    }

    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setRecords((prev) => prev.filter((r) => r.studentId !== studentId));
    setNotices((prev) => prev.filter((n) => n.studentId !== studentId));
    setExcusals((prev) => prev.filter((e) => e.studentId !== studentId));
    setGrades((prev) => prev.filter((g) => g.studentId !== studentId));

    if (activeStudentId === studentId) {
      const remaining = students.filter((s) => s.id !== studentId);
      if (remaining.length > 0) {
        setActiveStudentId(remaining[0].id);
      }
    }
  };

  const editStudent = (studentId: string, updates: Partial<Student>) => {
    // Permission check: Only teachers can alter student names, USN, or details
    if (currentSession && currentSession.role !== 'faculty') {
      console.warn('Unauthorized: Students cannot enter or alter student names or details.');
      return;
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
  };

  const bulkEnrollStudents = (
    list: Array<{
      usn: string;
      name: string;
      dateOfBirth: string;
      email?: string;
      parentEmail?: string;
      department?: string;
      section?: string;
    }>
  ) => {
    let added = 0;
    const errors: string[] = [];

    list.forEach((item) => {
      const res = addStudentByUSN(
        {
          usn: item.usn,
          rollNumber: item.usn,
          name: item.name,
          dateOfBirth: item.dateOfBirth,
          email: item.email || `${item.name.toLowerCase().replace(/\s+/g, '.')}@mit.ac.in`,
          phone: '+91 98450 00000',
          parentName: 'Parent / Guardian',
          parentEmail: item.parentEmail || 'parent@example.com',
          parentPhone: '+91 94480 00000',
          department: item.department || 'Computer Science & Engineering',
          semester: 5,
          section: item.section || 'A',
        },
        85
      );

      if (res.success) {
        added++;
      } else {
        errors.push(`${item.usn}: ${res.error}`);
      }
    });

    return { added, errors };
  };

  const addCourse = (newC: Omit<Course, 'id' | 'classesHeld'>) => {
    const c: Course = {
      ...newC,
      id: `c-${Date.now()}`,
      classesHeld: 0,
    };
    setCourses((prev) => [...prev, c]);
  };

  const loginStudent = (usn: string, dob: string): { success: boolean; error?: string } => {
    const cleanUSN = usn.trim().toUpperCase().replace(/[-\s]/g, '');
    const cleanDOB = dob.trim();

    const matched = students.find((s) => {
      const sUSN = s.usn.toUpperCase().replace(/[-\s]/g, '');
      const sRoll = s.rollNumber.toUpperCase().replace(/[-\s]/g, '');
      return (sUSN === cleanUSN || sRoll === cleanUSN) && s.dateOfBirth === cleanDOB;
    });

    if (!matched) {
      return {
        success: false,
        error: 'Authentication failed. Please verify your University Seat Number (USN) and Date of Birth with the Maharaja Institute of Technology examination records.',
      };
    }

    const session: AuthSession = {
      role: 'student',
      user: {
        role: 'student',
        id: matched.id,
        identifier: matched.usn,
        name: matched.name,
        email: matched.email,
        department: matched.department,
      },
      loginTime: new Date().toLocaleString(),
    };

    setCurrentSession(session);
    setActiveRole('student');
    setActiveStudentId(matched.id);
    return { success: true };
  };

  const loginFaculty = (facultyId: string, dob: string): { success: boolean; error?: string } => {
    const cleanId = facultyId.trim().toUpperCase().replace(/[-\s]/g, '');
    const cleanDOB = dob.trim();

    const matched = facultyList.find((f) => {
      const fId = f.facultyId.toUpperCase().replace(/[-\s]/g, '');
      return fId === cleanId && f.dateOfBirth === cleanDOB;
    });

    if (!matched) {
      return {
        success: false,
        error: 'Faculty credentials invalid. Verify your Faculty Employee ID and Date of Birth.',
      };
    }

    const session: AuthSession = {
      role: 'faculty',
      user: {
        role: 'faculty',
        id: matched.id,
        identifier: matched.facultyId,
        name: matched.name,
        email: matched.email,
        department: matched.department,
      },
      loginTime: new Date().toLocaleString(),
    };

    setCurrentSession(session);
    setActiveRole('faculty');
    return { success: true };
  };

  const logout = () => {
    setCurrentSession(null);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}session`);
  };

  const updateStudentMarks = (studentId: string, courseId: string, updates: Partial<StudentCourseGrade>) => {
    // Permission check: Only teachers have access to enter or alter marks! Students do not have access.
    if (currentSession && currentSession.role !== 'faculty') {
      console.warn('Unauthorized: Students do not have access to enter or modify marks.');
      return;
    }

    setGrades((prev) =>
      prev.map((g) => {
        if (g.studentId === studentId && g.courseId === courseId) {
          const merged = { ...g, ...updates };
          const bestTwoIAs = [merged.ia1, merged.ia2, merged.ia3].sort((a, b) => b - a).slice(0, 2);
          const iaTotal = bestTwoIAs[0] + bestTwoIAs[1];
          const iaScaled40 = Math.round((iaTotal / 60) * 40);
          const computedTotal = Math.min(
            100,
            Math.max(
              0,
              updates.totalMarks !== undefined
                ? updates.totalMarks
                : iaScaled40 + merged.assignment + merged.lab + 25
            )
          );
          const { grade, gradePoints } =
            updates.grade && updates.gradePoints
              ? { grade: updates.grade, gradePoints: updates.gradePoints }
              : calculateGradeFromMarks(computedTotal);

          return {
            ...merged,
            totalMarks: computedTotal,
            grade,
            gradePoints,
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        }
        return g;
      })
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}policy`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}students`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}courses`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}records`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notices`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}excusals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}grades`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}session`);

    setPolicy(initialPolicy);
    setStudents(initialStudents);
    setCourses(initialCourses);
    setRecords(generateInitialRecords());
    setNotices(initialNotices);
    setExcusals(initialExcusals);
    setGrades(generateInitialGrades());
    setCurrentSession(null);
  };

  const unreadAlertsCount = useMemo(() => {
    if (activeRole === 'student') {
      return notices.filter((n) => n.studentId === activeStudentId && n.status !== 'acknowledged').length;
    }
    return notices.filter((n) => n.status === 'queued').length;
  }, [notices, activeRole, activeStudentId]);

  return (
    <AttendanceContext.Provider
      value={{
        policy,
        students,
        courses,
        records,
        notices,
        excusals,
        facultyList,
        currentSession,
        activeRole,
        activeStudentId,
        setActiveRole,
        setActiveStudentId,
        grades,
        updateStudentMarks,
        loginStudent,
        loginFaculty,
        logout,
        markBatchAttendance,
        runAutomatedShortageScan,
        dispatchNotice,
        batchDispatchAllQueued,
        acknowledgeNotice,
        submitExcusal,
        reviewExcusal,
        updatePolicy,
        addStudent,
        addStudentByUSN,
        deleteStudent,
        editStudent,
        bulkEnrollStudents,
        addCourse,
        resetAllData,
        getStudentCourseSummary,
        getStudentOverallSummary,
        getAllShortageDefaulters,
        unreadAlertsCount,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error('useAttendance must be used within an AttendanceProvider');
  return ctx;
};
