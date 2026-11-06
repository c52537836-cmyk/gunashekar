export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'on_duty';

export type ShortageLevel = 'safe' | 'borderline' | 'shortage' | 'critical';

export interface Student {
  id: string;
  usn: string; // University Seat Number (USN), e.g. "1AP24CS001"
  rollNumber: string; // Short code, e.g. "2024-CSE-001"
  name: string;
  dateOfBirth: string; // YYYY-MM-DD, e.g. "2004-05-14"
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  department: string;
  semester: number;
  section: string;
  avatarUrl?: string;
}

export interface FacultyUser {
  id: string;
  facultyId: string; // e.g. "FAC-CSE-01"
  name: string;
  dateOfBirth: string; // YYYY-MM-DD, e.g. "1980-08-15"
  email: string;
  department: string;
  designation: string;
}

export interface AuthSession {
  role: 'student' | 'faculty';
  user: {
    role: 'student' | 'faculty';
    id: string;
    identifier: string; // USN or Faculty ID
    name: string;
    email: string;
    department: string;
  };
  loginTime: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  instructorEmail: string;
  department: string;
  semester: number;
  totalClassesScheduled: number;
  classesHeld: number;
  requiredPercentage: number; // e.g. 75
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  sessionNumber: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  classesHeld: number;
  attended: number; // present + on_duty + excused
  absent: number;
  percentage: number;
  status: ShortageLevel;
  canBunk: number;
  mustAttend: number;
  isImpossible: boolean;
  totalScheduled: number;
  classesRemaining: number;
}

export interface WarningNotice {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  parentEmail: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  currentPercentage: number;
  requiredPercentage: number;
  attendedCount: number;
  heldCount: number;
  warningLevel: 'L1_Advisory' | 'L2_Critical' | 'L3_Debarment';
  generatedAt: string;
  dispatchedChannels: ('in_app' | 'email' | 'sms')[];
  status: 'queued' | 'dispatched' | 'acknowledged';
  acknowledgedAt?: string;
  remarks: string;
}

export interface ExcusalRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  courseCode: string;
  date: string;
  reason: 'medical' | 'sports_cultural' | 'family_emergency' | 'academic_conference';
  description: string;
  documentName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface UniversityPolicy {
  minimumThreshold: number; // e.g. 75
  condonationBandMin: number; // e.g. 65
  criticalDebarmentThreshold: number; // e.g. 60
  autoScanOnAttendanceMark: boolean;
  enableParentAlerts: boolean;
  allowMedicalExcusals: boolean;
  universityName: string;
  academicTerm: string;
}

export type GradeLetter = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface StudentCourseGrade {
  id: string;
  studentId: string;
  courseId: string;
  ia1: number; // Max 30
  ia2: number; // Max 30
  ia3: number; // Max 30
  assignment: number; // Max 10
  lab: number; // Max 20
  totalMarks: number; // Max 100
  grade: GradeLetter;
  gradePoints: number; // 0 to 10
  remarks?: string;
  lastUpdated: string;
}

