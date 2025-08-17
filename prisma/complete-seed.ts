import { PrismaClient, Semester } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting complete database seeding...');

  // Clear existing data in correct order
  console.log('🧹 Clearing existing data...');
  await prisma.courseExamSession.deleteMany();
  await prisma.timeTableCourse.deleteMany();
  await prisma.timeTable.deleteMany();
  await prisma.facultyHall.deleteMany();
  await prisma.faculty.deleteMany();

  // Create faculties
  console.log('🏛️ Creating faculties...');
  const scienceFaculty = await prisma.faculty.create({
    data: {
      name: 'Faculty of Science',
    },
  });

  const artsFaculty = await prisma.faculty.create({
    data: {
      name: 'Faculty of Arts',
    },
  });

  const educationFaculty = await prisma.faculty.create({
    data: {
      name: 'Faculty of Education',
    },
  });

  // Create halls for Faculty of Science
  console.log('🏢 Creating halls for Faculty of Science...');
  const scienceHalls = await Promise.all([
    prisma.facultyHall.create({
      data: {
        name: 'Science Room 4',
        facultyId: scienceFaculty.id,
        maxCapacity: 85,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Science Complex Hall 1',
        facultyId: scienceFaculty.id,
        maxCapacity: 250,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Science Room 2',
        facultyId: scienceFaculty.id,
        maxCapacity: 150,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Science Lecture Theatre',
        facultyId: scienceFaculty.id,
        maxCapacity: 300,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Computer Lab A',
        facultyId: scienceFaculty.id,
        maxCapacity: 60,
      },
    }),
  ]);

  // Create halls for Faculty of Arts
  console.log('🏢 Creating halls for Faculty of Arts...');
  const artsHalls = await Promise.all([
    prisma.facultyHall.create({
      data: {
        name: 'Arts Auditorium',
        facultyId: artsFaculty.id,
        maxCapacity: 400,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Arts Hall 1',
        facultyId: artsFaculty.id,
        maxCapacity: 200,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Arts Hall 2',
        facultyId: artsFaculty.id,
        maxCapacity: 180,
      },
    }),
  ]);

  // Create halls for Faculty of Education
  console.log('🏢 Creating halls for Faculty of Education...');
  const educationHalls = await Promise.all([
    prisma.facultyHall.create({
      data: {
        name: 'Education Main Hall',
        facultyId: educationFaculty.id,
        maxCapacity: 350,
      },
    }),
    prisma.facultyHall.create({
      data: {
        name: 'Education Room 1',
        facultyId: educationFaculty.id,
        maxCapacity: 120,
      },
    }),
  ]);

  // Create timetables
  console.log('📅 Creating timetables...');
  const scienceTimetable = await prisma.timeTable.create({
    data: {
      name: 'Default',
      facultyId: scienceFaculty.id,
      session: '2023/2024',
      semester: Semester.FIRST,
      examStartDate: new Date('2025-01-09'), // January 9, 2025 (Thursday)
    },
  });

  const artsTimetable = await prisma.timeTable.create({
    data: {
      name: 'First Semester Exams',
      facultyId: artsFaculty.id,
      session: '2023/2024',
      semester: Semester.FIRST,
      examStartDate: new Date('2025-01-13'), // January 13, 2025 (Monday)
    },
  });

  const educationTimetable = await prisma.timeTable.create({
    data: {
      name: 'Main Exams',
      facultyId: educationFaculty.id,
      session: '2023/2024',
      semester: Semester.FIRST,
      examStartDate: new Date('2025-01-20'), // January 20, 2025 (Monday)
    },
  });

  // Create courses for Faculty of Science (with varying student numbers to test multi-hall)
  console.log('📚 Creating courses for Faculty of Science...');
  await Promise.all([
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'CSC 101',
        courseTitle: 'Introduction to Computer Science',
        courseUnit: 3,
        numberOfStudents: 500, // Requires multiple halls
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'CSC 102',
        courseTitle: 'Introduction to Computer Science 2',
        courseUnit: 2,
        numberOfStudents: 400, // Requires multiple halls
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'CSC 103',
        courseTitle: 'Introduction to Computer Science 3',
        courseUnit: 3,
        numberOfStudents: 300, // Can fit in single large hall
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'MTH 101',
        courseTitle: 'General Mathematics I',
        courseUnit: 3,
        numberOfStudents: 600, // Requires multiple halls
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'PHY 101',
        courseTitle: 'Introduction to Physics',
        courseUnit: 3,
        numberOfStudents: 250, // Fits in largest hall
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'CHM 101',
        courseTitle: 'General Chemistry I',
        courseUnit: 3,
        numberOfStudents: 180, // Fits in medium hall
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: scienceTimetable.id,
        courseCode: 'BIO 101',
        courseTitle: 'Introduction to Biology',
        courseUnit: 3,
        numberOfStudents: 320, // Requires multiple halls
      },
    }),
  ]);

  // Create courses for Faculty of Arts
  console.log('📚 Creating courses for Faculty of Arts...');
  await Promise.all([
    prisma.timeTableCourse.create({
      data: {
        timeTableId: artsTimetable.id,
        courseCode: 'ENG 101',
        courseTitle: 'English Language and Composition',
        courseUnit: 3,
        numberOfStudents: 450, // Requires multiple halls
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: artsTimetable.id,
        courseCode: 'HIS 101',
        courseTitle: 'Introduction to History',
        courseUnit: 3,
        numberOfStudents: 200, // Fits in single hall
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: artsTimetable.id,
        courseCode: 'POL 101',
        courseTitle: 'Introduction to Political Science',
        courseUnit: 3,
        numberOfStudents: 300, // Fits in auditorium
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: artsTimetable.id,
        courseCode: 'SOC 101',
        courseTitle: 'Introduction to Sociology',
        courseUnit: 3,
        numberOfStudents: 250, // Requires multiple halls
      },
    }),
  ]);

  // Create courses for Faculty of Education
  console.log('📚 Creating courses for Faculty of Education...');
  await Promise.all([
    prisma.timeTableCourse.create({
      data: {
        timeTableId: educationTimetable.id,
        courseCode: 'EDU 101',
        courseTitle: 'Foundations of Education',
        courseUnit: 3,
        numberOfStudents: 400, // Requires multiple halls
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: educationTimetable.id,
        courseCode: 'EDU 102',
        courseTitle: 'Educational Psychology',
        courseUnit: 3,
        numberOfStudents: 280, // Fits in main hall
      },
    }),
    prisma.timeTableCourse.create({
      data: {
        timeTableId: educationTimetable.id,
        courseCode: 'EDU 103',
        courseTitle: 'Curriculum and Instruction',
        courseUnit: 3,
        numberOfStudents: 150, // Fits in multiple halls combinations
      },
    }),
  ]);

  console.log('✅ Complete seeding finished successfully!');
  console.log('\n📊 Summary:');
  console.log(`🏛️ Faculties: 3`);
  console.log(`🏢 Halls: ${scienceHalls.length + artsHalls.length + educationHalls.length}`);
  console.log(`📅 Timetables: 3`);
  console.log(`📚 Courses: 14 total`);
  console.log(`   - Faculty of Science: 7 courses (including multi-hall scenarios)`);
  console.log(`   - Faculty of Arts: 4 courses`);
  console.log(`   - Faculty of Education: 3 courses`);
  console.log('\n🎯 Multi-Hall Test Cases:');
  console.log(`   - CSC 101: 500 students (needs 2+ halls)`);
  console.log(`   - CSC 102: 400 students (needs 2+ halls)`);
  console.log(`   - MTH 101: 600 students (needs 2+ halls)`);
  console.log(`   - BIO 101: 320 students (needs 2+ halls)`);
  console.log(`   - ENG 101: 450 students (needs 2+ halls)`);
  console.log(`   - EDU 101: 400 students (needs 2+ halls)`);
  console.log('\nNow run auto-schedule to test multi-hall functionality! 🚀');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });