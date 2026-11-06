import { AttendanceRecord, AttendanceSummary, ShortageLevel, UniversityPolicy } from '../types/attendance';

export function calculateSummary(
  records: AttendanceRecord[],
  totalScheduled: number,
  policy: UniversityPolicy
): AttendanceSummary {
  const held = records.length;
  if (held === 0) {
    return {
      classesHeld: 0,
      attended: 0,
      absent: 0,
      percentage: 100,
      status: 'safe',
      canBunk: 0,
      mustAttend: 0,
      isImpossible: false,
      totalScheduled,
      classesRemaining: Math.max(0, totalScheduled - held),
    };
  }

  let attended = 0;
  let absent = 0;

  for (const r of records) {
    if (r.status === 'present' || r.status === 'on_duty') {
      attended += 1;
    } else if (r.status === 'excused') {
      // Excused counts as attended if allowed under policy
      if (policy.allowMedicalExcusals) {
        attended += 1;
      } else {
        absent += 1;
      }
    } else {
      absent += 1;
    }
  }

  const rawPercent = (attended / held) * 100;
  const percentage = Math.round(rawPercent * 10) / 10;
  const threshold = policy.minimumThreshold; // e.g. 75
  const tFrac = threshold / 100;

  let status: ShortageLevel = 'safe';
  if (percentage < policy.criticalDebarmentThreshold) {
    status = 'critical';
  } else if (percentage < threshold) {
    status = 'shortage';
  } else if (percentage < threshold + 5) {
    status = 'borderline';
  } else {
    status = 'safe';
  }

  const classesRemaining = Math.max(0, totalScheduled - held);

  // Bunk calculation: k <= (attended / tFrac) - held
  let canBunk = 0;
  if (percentage >= threshold) {
    const maxMissable = Math.floor(attended / tFrac - held);
    canBunk = Math.max(0, maxMissable);
  }

  // Recovery calculation: m >= (tFrac * held - attended) / (1 - tFrac)
  let mustAttend = 0;
  let isImpossible = false;

  if (percentage < threshold) {
    const needed = Math.ceil((tFrac * held - attended) / (1 - tFrac));
    mustAttend = Math.max(1, needed);

    // If needed classes exceed total remaining classes in the semester
    if (mustAttend > classesRemaining) {
      isImpossible = true;
    }
  }

  return {
    classesHeld: held,
    attended,
    absent,
    percentage,
    status,
    canBunk,
    mustAttend,
    isImpossible,
    totalScheduled,
    classesRemaining,
  };
}

/**
 * Predict what percentage will be after attending or missing next N classes
 */
export function predictAttendance(
  currentAttended: number,
  currentHeld: number,
  attendNext: number,
  missNext: number
): number {
  const newAttended = currentAttended + attendNext;
  const newHeld = currentHeld + attendNext + missNext;
  if (newHeld === 0) return 100;
  return Math.round((newAttended / newHeld) * 1000) / 10;
}
