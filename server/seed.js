const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Department = require('./models/Department');
const Event = require('./models/Event');
const Finance = require('./models/Finance');
const Project = require('./models/Project');
const Meeting = require('./models/Meeting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Department.deleteMany(),
      Event.deleteMany(),
      Finance.deleteMany(),
      Project.deleteMany(),
      Meeting.deleteMany(),
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@clubops.com', password: 'admin123', role: 'admin' },
      { name: 'Arjun Mehta', email: 'arjun@clubops.com', password: 'member123', role: 'member' },
      { name: 'Priya Sharma', email: 'priya@clubops.com', password: 'member123', role: 'member' },
      { name: 'Rahul Kumar', email: 'rahul@clubops.com', password: 'viewer123', role: 'viewer' },
      { name: 'Sneha Patel', email: 'sneha@clubops.com', password: 'member123', role: 'member' },
    ]);
    console.log('Users created');

    // Create departments
    const departments = await Department.create([
      {
        name: 'Web Development',
        type: 'technical',
        description: 'Building web applications and platforms',
        lead: users[1]._id,
        members: [
          { user: users[1]._id, role: 'lead' },
          { user: users[2]._id, role: 'member' },
        ],
        tasks: [
          { title: 'Redesign landing page', status: 'in-progress', progress: 65, assignedTo: users[1]._id },
          { title: 'API Integration', status: 'pending', progress: 20, assignedTo: users[2]._id },
        ],
      },
      {
        name: 'AI/ML Research',
        type: 'technical',
        description: 'Artificial Intelligence and Machine Learning research',
        lead: users[2]._id,
        members: [
          { user: users[2]._id, role: 'lead' },
          { user: users[4]._id, role: 'member' },
        ],
        tasks: [
          { title: 'Train sentiment model', status: 'completed', progress: 100, assignedTo: users[2]._id },
          { title: 'Data pipeline setup', status: 'in-progress', progress: 45, assignedTo: users[4]._id },
        ],
      },
      {
        name: 'Marketing',
        type: 'non-technical',
        description: 'Social media and event promotion',
        lead: users[4]._id,
        members: [
          { user: users[4]._id, role: 'lead' },
          { user: users[3]._id, role: 'member' },
        ],
        tasks: [
          { title: 'Design event posters', status: 'completed', progress: 100, assignedTo: users[4]._id },
        ],
      },
      {
        name: 'Content & Editorial',
        type: 'non-technical',
        description: 'Content creation, blogs, and documentation',
        lead: users[1]._id,
        members: [
          { user: users[1]._id, role: 'lead' },
        ],
        tasks: [
          { title: 'Write monthly newsletter', status: 'pending', progress: 10, assignedTo: users[1]._id },
        ],
      },
    ]);
    console.log('Departments created');

    // Create events
    const events = await Event.create([
      {
        title: 'HackNova 2026',
        description: 'Annual 24-hour hackathon with prizes worth ₹50,000',
        date: new Date('2026-05-15'),
        time: '09:00 AM',
        venue: 'Main Auditorium',
        organizer: users[0]._id,
        coordinators: [users[1]._id, users[2]._id],
        department: departments[0]._id,
        type: 'hackathon',
        status: 'upcoming',
        registration: { limit: 200, deadline: new Date('2026-05-10') },
        approvalChecklist: { swcApproval: true, sponsorship: true, venueBooked: true, budgetApproved: true },
      },
      {
        title: 'AI Workshop Series',
        description: 'Introduction to Machine Learning with hands-on coding sessions',
        date: new Date('2026-04-20'),
        time: '02:00 PM',
        venue: 'Lab 301',
        onlineLink: 'https://meet.google.com/abc-defg-hij',
        organizer: users[2]._id,
        coordinators: [users[4]._id],
        department: departments[1]._id,
        type: 'workshop',
        status: 'upcoming',
        registration: { limit: 50, deadline: new Date('2026-04-18') },
      },
      {
        title: 'Tech Talk: Cloud Computing',
        description: 'Guest lecture on modern cloud architecture and deployment strategies',
        date: new Date('2026-03-10'),
        time: '04:00 PM',
        venue: 'Seminar Hall B',
        organizer: users[0]._id,
        type: 'seminar',
        status: 'completed',
      },
    ]);
    console.log('Events created');

    // Create finance records
    await Finance.create([
      { type: 'sponsorship', category: 'sponsorship', title: 'TechCorp Gold Sponsorship', amount: 25000, status: 'completed', date: new Date('2026-03-01'), createdBy: users[0]._id, sponsor: { name: 'TechCorp', type: 'active' } },
      { type: 'sponsorship', category: 'sponsorship', title: 'DataFlow Silver Sponsorship', amount: 15000, status: 'completed', date: new Date('2026-03-05'), createdBy: users[0]._id, sponsor: { name: 'DataFlow', type: 'active' } },
      { type: 'income', category: 'event', title: 'HackNova Registration Fees', amount: 10000, status: 'pending', event: events[0]._id, date: new Date('2026-04-01'), createdBy: users[0]._id },
      { type: 'income', category: 'membership', title: 'Membership Dues Q1', amount: 5000, status: 'completed', date: new Date('2026-01-15'), createdBy: users[0]._id },
      { type: 'expense', category: 'venue', title: 'Auditorium Booking - HackNova', amount: 8000, status: 'completed', event: events[0]._id, date: new Date('2026-03-20'), createdBy: users[0]._id },
      { type: 'expense', category: 'equipment', title: 'Workshop Equipment', amount: 3500, status: 'completed', date: new Date('2026-02-10'), createdBy: users[0]._id },
      { type: 'expense', category: 'marketing', title: 'Social Media Ads', amount: 2000, status: 'pending', date: new Date('2026-04-01'), createdBy: users[0]._id },
    ]);
    console.log('Finance records created');

    // Create projects
    await Project.create([
      {
        title: 'CLUB-OPS Platform',
        description: 'The very system you are looking at — our internal operations dashboard',
        status: 'ongoing',
        lead: users[1]._id,
        department: departments[0]._id,
        members: [{ user: users[1]._id, role: 'lead' }, { user: users[2]._id, role: 'contributor' }],
        funding: 12000,
        tags: ['react', 'node.js', 'mongodb'],
        github: 'https://github.com/cyscom/club-ops',
        startDate: new Date('2026-01-01'),
        achievements: [{ title: 'MVP Launch', description: 'First working prototype deployed', date: new Date('2026-03-01') }],
      },
      {
        title: 'Smart Campus Navigator',
        description: 'AI-powered campus navigation system with indoor mapping',
        status: 'ongoing',
        lead: users[2]._id,
        department: departments[1]._id,
        members: [{ user: users[2]._id, role: 'lead' }, { user: users[4]._id, role: 'contributor' }],
        funding: 8000,
        tags: ['python', 'tensorflow', 'flutter'],
        startDate: new Date('2026-02-01'),
      },
      {
        title: 'Alumni Connect Portal',
        description: 'Platform connecting current students with alumni for mentorship',
        status: 'completed',
        lead: users[1]._id,
        members: [{ user: users[1]._id, role: 'lead' }],
        funding: 5000,
        tags: ['next.js', 'postgresql'],
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-15'),
        achievements: [
          { title: 'Beta Launch', description: '200+ alumni registered', date: new Date('2025-11-01') },
          { title: 'Full Release', description: 'Platform live with 500+ users', date: new Date('2025-12-15') },
        ],
      },
      {
        title: 'IoT Weather Station',
        description: 'Raspberry Pi based weather monitoring station on campus',
        status: 'new',
        lead: users[4]._id,
        department: departments[0]._id,
        members: [{ user: users[4]._id, role: 'lead' }],
        funding: 3000,
        tags: ['iot', 'raspberry-pi', 'python'],
      },
    ]);
    console.log('Projects created');

    // Create meetings
    await Meeting.create([
      {
        title: 'Weekly Sync - April W1',
        description: 'Weekly team synchronization meeting',
        date: new Date('2026-04-07'),
        time: '06:00 PM',
        venue: 'Conference Room A',
        type: 'general',
        status: 'scheduled',
        createdBy: users[0]._id,
        agenda: [
          { topic: 'HackNova Planning Update', duration: 20, presenter: users[1]._id },
          { topic: 'Budget Review', duration: 15, presenter: users[0]._id },
          { topic: 'New Member Onboarding', duration: 10 },
        ],
        announcements: [
          { content: 'HackNova registrations open next week!', priority: 'high' },
          { content: 'Submit project reports by Friday', priority: 'medium' },
        ],
      },
      {
        title: 'Department Leads Review',
        description: 'Monthly review with all department leads',
        date: new Date('2026-04-14'),
        time: '05:00 PM',
        venue: 'Board Room',
        type: 'review',
        status: 'scheduled',
        createdBy: users[0]._id,
        agenda: [
          { topic: 'Department KPIs', duration: 30, presenter: users[0]._id },
          { topic: 'Resource Allocation', duration: 20 },
        ],
      },
      {
        title: 'Tech Talk Planning',
        description: 'Planning the next tech talk series',
        date: new Date('2026-03-25'),
        time: '04:00 PM',
        venue: 'Lab 301',
        type: 'department',
        status: 'completed',
        createdBy: users[2]._id,
        minutes: 'Discussed topics for upcoming tech talks. Decided on Cloud Computing, DevOps, and System Design. Assigned speakers for each session.',
        attendees: [users[0]._id, users[1]._id, users[2]._id, users[4]._id],
      },
    ]);
    console.log('Meetings created');

    console.log('\n\x1b[32m✓ Database seeded successfully!\x1b[0m');
    console.log('\x1b[36mLogin credentials:\x1b[0m');
    console.log('  Admin:  admin@clubops.com / admin123');
    console.log('  Member: arjun@clubops.com / member123');
    console.log('  Viewer: rahul@clubops.com / viewer123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
