import { Student, Course, AttendanceRecord, WarningNotice, ExcusalRequest, UniversityPolicy, FacultyUser } from '../types/attendance';

export const initialPolicy: UniversityPolicy = {
  minimumThreshold: 75,
  condonationBandMin: 65,
  criticalDebarmentThreshold: 60,
  autoScanOnAttendanceMark: true,
  enableParentAlerts: true,
  allowMedicalExcusals: true,
  universityName: 'Maharaja Institute of Technology',
  academicTerm: 'Academic Year 2026-27 (Odd Semester)',
};

export const initialCourses: Course[] = [
  {
    id: 'c-1',
    code: 'CS-301',
    name: 'Advanced Data Structures & Algorithms',
    credits: 4,
    instructor: 'Prof. Dr. Arthur Vance',
    instructorEmail: 'a.vance@mit.ac.in',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalClassesScheduled: 45,
    classesHeld: 32,
    requiredPercentage: 75,
  },
  {
    id: 'c-2',
    code: 'CS-302',
    name: 'Database Management Systems & Cloud Architecture',
    credits: 4,
    instructor: 'Prof. Elena Rostova',
    instructorEmail: 'e.rostova@mit.ac.in',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalClassesScheduled: 40,
    classesHeld: 28,
    requiredPercentage: 75,
  },
  {
    id: 'c-3',
    code: 'CS-303',
    name: 'Operating Systems & Virtualization',
    credits: 3,
    instructor: 'Assoc. Prof. Marcus Chen',
    instructorEmail: 'm.chen@mit.ac.in',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalClassesScheduled: 36,
    classesHeld: 26,
    requiredPercentage: 75,
  },
  {
    id: 'c-4',
    code: 'CS-304',
    name: 'Computer Networks & Security Protocols',
    credits: 3,
    instructor: 'Dr. Sarah Jenkins',
    instructorEmail: 's.jenkins@mit.ac.in',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalClassesScheduled: 38,
    classesHeld: 27,
    requiredPercentage: 75,
  },
  {
    id: 'c-5',
    code: 'CS-305',
    name: 'Artificial Intelligence & Machine Learning',
    credits: 4,
    instructor: 'Dr. Rajesh Nair',
    instructorEmail: 'r.nair@mit.ac.in',
    department: 'Computer Science & Engineering',
    semester: 5,
    totalClassesScheduled: 42,
    classesHeld: 30,
    requiredPercentage: 75,
  },
];

export const initialStudents: Student[] = [
  {
    id: 's-1',
    usn: '4MH21CS001',
    rollNumber: '2024-CSE-001',
    name: 'Alex Rivera',
    dateOfBirth: '2004-03-15',
    email: 'alex.rivera@mit.ac.in',
    phone: '+91 98450 12345',
    parentName: 'David Rivera',
    parentEmail: 'd.rivera@gmail.com',
    parentPhone: '+91 94480 87654',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-2',
    usn: '4MH21CS002',
    rollNumber: '2024-CSE-002',
    name: 'Maya Patel',
    dateOfBirth: '2004-07-22',
    email: 'maya.patel@mit.ac.in',
    phone: '+91 98450 23456',
    parentName: 'Sunil Patel',
    parentEmail: 's.patel@horizoncorp.com',
    parentPhone: '+91 94480 76543',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-3',
    usn: '4MH21CS003',
    rollNumber: '2024-CSE-003',
    name: 'Julian Hayes',
    dateOfBirth: '2004-11-08',
    email: 'julian.hayes@mit.ac.in',
    phone: '+91 98450 34567',
    parentName: 'Evelyn Hayes',
    parentEmail: 'evelyn.hayes@outlook.com',
    parentPhone: '+91 94480 65432',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-4',
    usn: '4MH21CS004',
    rollNumber: '2024-CSE-004',
    name: 'Zoe Zhang',
    dateOfBirth: '2004-09-19',
    email: 'zoe.zhang@mit.ac.in',
    phone: '+91 98450 45678',
    parentName: 'Li Wei Zhang',
    parentEmail: 'lw.zhang@pacificnet.cn',
    parentPhone: '+91 94480 54321',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-5',
    usn: '4MH21CS005',
    rollNumber: '2024-CSE-005',
    name: 'Lucas Thorne',
    dateOfBirth: '2004-01-30',
    email: 'lucas.thorne@mit.ac.in',
    phone: '+91 98450 56789',
    parentName: 'Robert Thorne',
    parentEmail: 'r.thorne@legalgroup.com',
    parentPhone: '+91 94480 43210',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-6',
    usn: '4MH21CS006',
    rollNumber: '2024-CSE-006',
    name: 'Fatima Al-Mansoor',
    dateOfBirth: '2004-06-12',
    email: 'fatima.m@mit.ac.in',
    phone: '+91 98450 67890',
    parentName: 'Tariq Al-Mansoor',
    parentEmail: 'tariq.mansoor@gulfchem.org',
    parentPhone: '+91 94480 32109',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-7',
    usn: '4MH21CS007',
    rollNumber: '2024-CSE-007',
    name: 'Ethan Cole',
    dateOfBirth: '2004-04-25',
    email: 'ethan.cole@mit.ac.in',
    phone: '+91 98450 78901',
    parentName: 'Patricia Cole',
    parentEmail: 'patricia.cole@medhealth.net',
    parentPhone: '+91 94480 21098',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-8',
    usn: '4MH21CS008',
    rollNumber: '2024-CSE-008',
    name: 'Aaliyah Washington',
    dateOfBirth: '2004-10-05',
    email: 'aaliyah.w@mit.ac.in',
    phone: '+91 98450 89012',
    parentName: 'Marcus Washington',
    parentEmail: 'm.washington@capitalgroup.com',
    parentPhone: '+91 94480 10987',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-9',
    usn: '4MH21CS009',
    rollNumber: '2024-CSE-009',
    name: 'Devin Brooks',
    dateOfBirth: '2004-12-18',
    email: 'devin.brooks@mit.ac.in',
    phone: '+91 98450 90123',
    parentName: 'Carol Brooks',
    parentEmail: 'c.brooks@aerospacedyn.org',
    parentPhone: '+91 94480 09876',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
  {
    id: 's-10',
    usn: '4MH21CS010',
    rollNumber: '2024-CSE-010',
    name: 'Priya Sharma',
    dateOfBirth: '2004-02-14',
    email: 'priya.sharma@mit.ac.in',
    phone: '+91 98450 01234',
    parentName: 'Vikram Sharma',
    parentEmail: 'v.sharma@techconsult.in',
    parentPhone: '+91 94480 98765',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
  },
];

export const initialFaculty: FacultyUser[] = [
  {
    id: 'f-1',
    facultyId: 'MIT-FAC-01',
    name: 'Prof. Dr. Arthur Vance',
    dateOfBirth: '1978-08-15',
    email: 'a.vance@mit.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department & Professor',
  },
  {
    id: 'f-2',
    facultyId: 'MIT-FAC-02',
    name: 'Prof. Elena Rostova',
    dateOfBirth: '1982-10-24',
    email: 'e.rostova@mit.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
  },
];

// Helper to seed realistic records
export function generateInitialRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = [
    '2026-09-02', '2026-09-04', '2026-09-07', '2026-09-09', '2026-09-11',
    '2026-09-14', '2026-09-16', '2026-09-18', '2026-09-21', '2026-09-23',
    '2026-09-25', '2026-09-28', '2026-09-30', '2026-10-02', '2026-10-05',
    '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-14', '2026-10-16',
    '2026-10-19', '2026-10-21', '2026-10-23', '2026-10-26', '2026-10-28',
    '2026-10-30', '2026-11-02', '2026-11-04', '2026-11-06', '2026-11-09',
    '2026-11-11', '2026-11-13'
  ];

  // Specific attendance profiles:
  // Alex Rivera: High absence in CS-301 (62%) and CS-303 (57%) -> Severe Shortage
  // Maya Patel: Borderline in CS-301 (72%), Safe in others (80%+)
  // Julian Hayes: High attendance (93%)
  // Zoe Zhang: Safe (88%)
  // Lucas Thorne: Shortage in CS-302 (67%)
  // Fatima Al-Mansoor: High attendance (96%)
  // Ethan Cole: Shortage in CS-304 (62%)
  // Aaliyah Washington: Safe (85%)
  // Devin Brooks: Critical across board (54%)
  // Priya Sharma: Safe (90%)

  initialCourses.forEach((course) => {
    const sessions = dates.slice(0, course.classesHeld);

    sessions.forEach((date, sessionIdx) => {
      initialStudents.forEach((student) => {
        let status: 'present' | 'absent' | 'excused' | 'on_duty' = 'present';

        // Deterministic pseudo-random attendance based on student profile
        if (student.id === 's-1') {
          // Alex Rivera: frequent absences in CS-301 & CS-303
          if (course.id === 'c-1' && sessionIdx % 3 === 0) status = 'absent';
          else if (course.id === 'c-3' && sessionIdx % 2 === 0) status = 'absent';
          else if (sessionIdx % 5 === 0) status = 'absent';
        } else if (student.id === 's-2') {
          // Maya Patel: borderline in CS-301
          if (course.id === 'c-1' && (sessionIdx === 2 || sessionIdx === 5 || sessionIdx === 8 || sessionIdx === 11 || sessionIdx === 15 || sessionIdx === 20 || sessionIdx === 24 || sessionIdx === 28 || sessionIdx === 30)) {
            status = 'absent';
          } else if (sessionIdx % 7 === 0) {
            status = 'absent';
          }
        } else if (student.id === 's-5') {
          // Lucas Thorne: low in CS-302
          if (course.id === 'c-2' && sessionIdx % 3 === 0) status = 'absent';
          else if (sessionIdx % 8 === 0) status = 'absent';
        } else if (student.id === 's-7') {
          // Ethan Cole: low in CS-304
          if (course.id === 'c-4' && sessionIdx % 3 === 0) status = 'absent';
          else if (sessionIdx % 6 === 0) status = 'absent';
        } else if (student.id === 's-9') {
          // Devin Brooks: very low
          if (sessionIdx % 2 === 0) status = 'absent';
          else if (sessionIdx % 5 === 0) status = 'excused';
        } else {
          // Julian, Zoe, Fatima, Aaliyah, Priya: rare absences
          if (sessionIdx === 4 && student.id === 's-3') status = 'excused';
          else if (sessionIdx === 12 && student.id === 's-4') status = 'absent';
          else if (sessionIdx === 18 && student.id === 's-6') status = 'on_duty';
          else if (sessionIdx === 22 && student.id === 's-8') status = 'absent';
          else if (sessionIdx === 15 && student.id === 's-10') status = 'excused';
        }

        records.push({
          id: `rec-${course.id}-${student.id}-${sessionIdx}`,
          studentId: student.id,
          courseId: course.id,
          date,
          sessionNumber: sessionIdx + 1,
          status,
        });
      });
    });
  });

  return records;
}

export const initialNotices: WarningNotice[] = [
  {
    id: 'warn-101',
    studentId: 's-1',
    studentName: 'Alex Rivera',
    rollNumber: '2024-CSE-001',
    parentEmail: 'd.rivera@gmail.com',
    courseId: 'c-1',
    courseCode: 'CS-301',
    courseName: 'Advanced Data Structures & Algorithms',
    currentPercentage: 62.5,
    requiredPercentage: 75,
    attendedCount: 20,
    heldCount: 32,
    warningLevel: 'L2_Critical',
    generatedAt: '2026-11-04 10:15 AM',
    dispatchedChannels: ['in_app', 'email'],
    status: 'dispatched',
    remarks: 'Attendance deficit of 12.5%. Student requires 16 consecutive attendances to regain 75% eligibility for end-term exams.',
  },
  {
    id: 'warn-102',
    studentId: 's-1',
    studentName: 'Alex Rivera',
    rollNumber: '2024-CSE-001',
    parentEmail: 'd.rivera@gmail.com',
    courseId: 'c-3',
    courseCode: 'CS-303',
    courseName: 'Operating Systems & Virtualization',
    currentPercentage: 57.7,
    requiredPercentage: 75,
    attendedCount: 15,
    heldCount: 26,
    warningLevel: 'L3_Debarment',
    generatedAt: '2026-11-05 08:30 AM',
    dispatchedChannels: ['in_app', 'email', 'sms'],
    status: 'dispatched',
    remarks: 'Attendance below 60% debarment threshold. Immediate parent-advisor consultation required.',
  },
  {
    id: 'warn-103',
    studentId: 's-2',
    studentName: 'Maya Patel',
    rollNumber: '2024-CSE-002',
    parentEmail: 's.patel@horizoncorp.com',
    courseId: 'c-1',
    courseCode: 'CS-301',
    courseName: 'Advanced Data Structures & Algorithms',
    currentPercentage: 71.9,
    requiredPercentage: 75,
    attendedCount: 23,
    heldCount: 32,
    warningLevel: 'L1_Advisory',
    generatedAt: '2026-11-05 02:45 PM',
    dispatchedChannels: ['in_app', 'email'],
    status: 'queued',
    remarks: 'Attendance marginally below 75%. Must attend next 4 consecutive sessions to cross threshold.',
  },
  {
    id: 'warn-104',
    studentId: 's-9',
    studentName: 'Devin Brooks',
    rollNumber: '2024-CSE-009',
    parentEmail: 'c.brooks@aerospacedyn.org',
    courseId: 'c-2',
    courseCode: 'CS-302',
    courseName: 'Database Management Systems & Cloud Architecture',
    currentPercentage: 53.6,
    requiredPercentage: 75,
    attendedCount: 15,
    heldCount: 28,
    warningLevel: 'L3_Debarment',
    generatedAt: '2026-11-04 11:00 AM',
    dispatchedChannels: ['in_app', 'email', 'sms'],
    status: 'dispatched',
    remarks: 'Critical shortage across major modules. Hall ticket holds pending condonation petition.',
  },
];

export const initialExcusals: ExcusalRequest[] = [
  {
    id: 'exc-1',
    studentId: 's-2',
    studentName: 'Maya Patel',
    rollNumber: '2024-CSE-002',
    courseId: 'c-1',
    courseCode: 'CS-301',
    date: '2026-11-02',
    reason: 'medical',
    description: 'Diagnosed with acute viral fever. Hospital admission certificate and physician discharge summary attached.',
    documentName: 'Medical_Certificate_Patel_DrMehta.pdf',
    status: 'pending',
    submittedAt: '2026-11-03 09:30 AM',
  },
  {
    id: 'exc-2',
    studentId: 's-3',
    studentName: 'Julian Hayes',
    rollNumber: '2024-CSE-003',
    courseId: 'c-2',
    courseCode: 'CS-302',
    date: '2026-09-14',
    reason: 'academic_conference',
    description: 'Represented Maharaja Institute of Technology Mysore (MITM) at National ACM Hackathon finals.',
    documentName: 'ACM_Finalist_Travel_Order.pdf',
    status: 'approved',
    submittedAt: '2026-09-16 11:20 AM',
    reviewedAt: '2026-09-17 03:00 PM',
    reviewerNotes: 'Approved as official On-Duty duty representation per Dean of Student Affairs circular.',
  },
];

export function calculateGradeFromMarks(totalMarks: number): { grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; gradePoints: number } {
  if (totalMarks >= 90) return { grade: 'S', gradePoints: 10 };
  if (totalMarks >= 80) return { grade: 'A', gradePoints: 9 };
  if (totalMarks >= 70) return { grade: 'B', gradePoints: 8 };
  if (totalMarks >= 60) return { grade: 'C', gradePoints: 7 };
  if (totalMarks >= 50) return { grade: 'D', gradePoints: 6 };
  if (totalMarks >= 40) return { grade: 'E', gradePoints: 5 };
  return { grade: 'F', gradePoints: 0 };
}

export function generateInitialGrades(): import('../types/attendance').StudentCourseGrade[] {
  const grades: import('../types/attendance').StudentCourseGrade[] = [];
  const baseScores: Record<string, { ia1: number; ia2: number; ia3: number; assignment: number; lab: number }> = {
    's-1': { ia1: 18, ia2: 21, ia3: 19, assignment: 7, lab: 14 }, // Alex
    's-2': { ia1: 22, ia2: 24, ia3: 23, assignment: 9, lab: 17 }, // Maya
    's-3': { ia1: 29, ia2: 28, ia3: 30, assignment: 10, lab: 20 }, // Julian
    's-4': { ia1: 26, ia2: 25, ia3: 27, assignment: 9, lab: 18 }, // Zoe
    's-5': { ia1: 20, ia2: 19, ia3: 21, assignment: 8, lab: 15 }, // Lucas
    's-6': { ia1: 28, ia2: 29, ia3: 28, assignment: 10, lab: 19 }, // Fatima
    's-7': { ia1: 21, ia2: 22, ia3: 20, assignment: 8, lab: 16 }, // Ethan
    's-8': { ia1: 25, ia2: 26, ia3: 24, assignment: 9, lab: 17 }, // Aaliyah
    's-9': { ia1: 14, ia2: 12, ia3: 15, assignment: 5, lab: 10 }, // Devin
    's-10': { ia1: 27, ia2: 28, ia3: 26, assignment: 9, lab: 18 }, // Priya
  };

  initialStudents.forEach((student) => {
    initialCourses.forEach((course) => {
      const base = baseScores[student.id] || { ia1: 22, ia2: 22, ia3: 22, assignment: 8, lab: 16 };
      // Slight course variance
      const courseOffset = (course.id.charCodeAt(course.id.length - 1) % 3) - 1;
      const ia1 = Math.min(30, Math.max(10, base.ia1 + courseOffset));
      const ia2 = Math.min(30, Math.max(10, base.ia2 + courseOffset));
      const ia3 = Math.min(30, Math.max(10, base.ia3 + courseOffset));
      const assignment = Math.min(10, Math.max(4, base.assignment));
      const lab = Math.min(20, Math.max(8, base.lab));

      // Best 2 IAs (out of 60) scaled to 40, plus assignment (10), lab (20), plus theory/final (30 scaled)
      const bestTwoIAs = [ia1, ia2, ia3].sort((a, b) => b - a).slice(0, 2);
      const iaTotal = bestTwoIAs[0] + bestTwoIAs[1]; // Out of 60
      const iaScaled40 = Math.round((iaTotal / 60) * 40);
      const totalMarks = Math.min(100, iaScaled40 + assignment + lab + 25);
      const { grade, gradePoints } = calculateGradeFromMarks(totalMarks);

      grades.push({
        id: `grd-${student.id}-${course.id}`,
        studentId: student.id,
        courseId: course.id,
        ia1,
        ia2,
        ia3,
        assignment,
        lab,
        totalMarks,
        grade,
        gradePoints,
        remarks: totalMarks >= 80 ? 'Excellent performance' : totalMarks >= 60 ? 'Satisfactory' : 'Needs improvement in internal tests',
        lastUpdated: '2026-11-04',
      });
    });
  });

  return grades;
}
