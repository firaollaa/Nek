export interface AstuSchool {
  name: string;
  code: string;
  departments: string[];
}

export const ASTU_SCHOOLS: AstuSchool[] = [
  {
    name: 'School of Electrical Engineering & Computing (SoEEC)',
    code: 'SoEEC',
    departments: [
      'Software Engineering',
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Electrical Power & Control Engineering',
    ],
  },
  {
    name: 'School of Mechanical, Chemical & Materials Engineering (SoMCME)',
    code: 'SoMCME',
    departments: [
      'Mechanical Engineering',
      'Chemical Engineering',
      'Materials Science & Engineering',
      'Electromechanical Engineering',
    ],
  },
  {
    name: 'School of Civil Engineering & Architecture (SoCEA)',
    code: 'SoCEA',
    departments: [
      'Civil Engineering',
      'Architecture',
      'Water Resources & Irrigation Engineering',
    ],
  },
  {
    name: 'School of Applied Natural Sciences (SoANS)',
    code: 'SoANS',
    departments: [
      'Applied Biology & Biotechnology',
      'Applied Chemistry',
      'Applied Physics',
      'Applied Geology',
    ],
  },
  {
    name: 'Freshman / Pre-Engineering Division',
    code: 'Freshman',
    departments: [
      'Pre-Engineering Studies',
      'Natural Science Foundation',
    ],
  },
];

export const ASTU_CAMPUS_SPOTS = [
  'Library 2 Quiet Zone (3rd Floor)',
  'Central Digital Library (SoEEC)',
  'Main Cafeteria Terrace',
  'Gate 1 Green Garden & Fountain',
  'ASTU Stadium & Football Pitch',
  'Innovation & Robotics Lab',
  'Architecture Studio & Courtyard',
  'Bole Lounge & Cafe Macchiato',
  'Posta Campus Walkway',
  'Kebele 04 Evening Chill',
  'Block 50s Dorm Quads',
];

export const POPULAR_INTERESTS = [
  'Competitive Coding',
  'Library Study Marathons',
  'Macchiato & Coffee Talks',
  'Campus Football',
  'Late Night Algorithm Prep',
  'Acoustic Guitar & Music',
  'Chess & Table Tennis',
  'Hackathons & Startups',
  'Hiking to Wonji / Sodere',
  'Anime & Manga',
  'Robotics Club',
  'Gym & Fitness',
  'Photography & Design',
  'Debate & Philosophy',
  'Weekend Adama Lounging',
  'AI & Machine Learning',
];

export const GRADUATION_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
