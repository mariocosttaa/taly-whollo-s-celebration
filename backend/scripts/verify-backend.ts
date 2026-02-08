import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function verifyBackend() {
  console.log('🚀 Starting Backend Verification...');

  try {
    // 1. Login
    console.log('\n1. Testing Admin Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@talywhollo.com',
      password: 'admin',
    });
    const token = loginRes.data.access_token;
    console.log('✅ Login successful! Token obtained.');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2. Create New Admin User
    console.log('\n2. Testing Create New Admin...');
    const newEmail = `test.admin.${Date.now()}@talywhollo.com`;
    await axios.post(
      `${API_URL}/auth/register`,
      { email: newEmail, password: 'password123' },
      { headers: authHeaders }
    );
    console.log(`✅ Created new admin: ${newEmail}`);

    // 3. Test New Admin Login
    console.log('\n3. Testing Login with New Admin...');
    await axios.post(`${API_URL}/auth/login`, {
      email: newEmail,
      password: 'password123',
    });
    console.log('✅ New admin login successful!');

    // 4. Create RSVP
    console.log('\n4. Testing RSVP Creation...');
    await axios.post(`${API_URL}/rsvp`, {
      name: 'Test Guest',
      email: 'guest@example.com',
      attendance: 'confirmed',
      message: 'Cant wait!',
    });
    console.log('✅ RSVP created.');

    // 5. Track Visit (Home Page)
    console.log('\n5. Testing Visit Tracking (Home)...');
    await axios.post(`${API_URL}/visits`, { page: 'home' });
    console.log('✅ Visit tracked.');

    // 6. Verify Dashboard Stats
    console.log('\n6. Verifying Dashboard Stats...');
    const statsRes = await axios.get(`${API_URL}/rsvp/stats`, { headers: authHeaders });
    console.log('✅ Stats retrieved:', statsRes.data);

    console.log('\n🎉 ALL SYSTEMS GO! Backend is fully functional.');
  } catch (error: any) {
    console.error('\n❌ Verification Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

verifyBackend();
