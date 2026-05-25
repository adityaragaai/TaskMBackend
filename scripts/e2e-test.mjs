const API_URL = process.env.API_URL || 'http://localhost:5001/api';

let adminToken = '';
let memberToken = '';
let projectId = '';
let taskId = '';
let memberId = '';

const testRandomEmail1 = `admin${Date.now()}@test.com`;
const testRandomEmail2 = `member${Date.now()}@test.com`;

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function runTests() {
  try {
    console.log('--- Starting End-to-End Test ---');
    console.log(`API: ${API_URL}`);

    const adminRes = await fetchAPI('/auth/signup', 'POST', {
      name: 'Test Admin',
      email: testRandomEmail1,
      password: 'password123',
      role: 'Admin',
    });
    adminToken = adminRes.token;
    console.log('   Admin signed up');

    const memberRes = await fetchAPI('/auth/signup', 'POST', {
      name: 'Test Member',
      email: testRandomEmail2,
      password: 'password123',
      role: 'Member',
    });
    memberToken = memberRes.token;
    memberId = memberRes._id;
    console.log('   Member signed up');

    const projectRes = await fetchAPI(
      '/projects',
      'POST',
      { title: 'Alpha Project', description: 'Test project description' },
      adminToken
    );
    projectId = projectRes._id;
    console.log(`   Project created (${projectId})`);

    const taskRes = await fetchAPI(
      '/tasks',
      'POST',
      {
        title: 'Initial Task',
        description: 'Complete the test',
        status: 'Todo',
        priority: 'High',
        dueDate: new Date().toISOString(),
        projectId,
        assignedTo: memberId,
      },
      adminToken
    );
    taskId = taskRes._id;
    console.log(`   Task created (${taskId})`);

    await fetchAPI(`/tasks/${taskId}`, 'PUT', { status: 'Done' }, memberToken);
    console.log('   Task status updated');

    const statsRes = await fetchAPI('/dashboard/stats', 'GET', null, adminToken);
    console.log('   Dashboard stats:', JSON.stringify(statsRes));

    console.log('--- All tests passed ---');
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
