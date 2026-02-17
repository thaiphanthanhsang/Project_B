const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'password123';

async function verifyUnifiedAPI() {
    console.log('Starting Unified API Verification...');

    try {
        // 1. Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const { token } = await loginRes.json();
        const headers = { 'Authorization': `Bearer ${token}` };

        // 2. Test Stats (Standard Endpoint)
        console.log('Testing /dashboard/stats...');
        const statsRes = await fetch(`${API_URL}/dashboard/stats`, { headers });
        const statsData = await statsRes.json();

        if (statsData.success === true && statsData.code === 200 && statsData.data) {
            console.log('✅ /stats returns correct Unified format');
        } else {
            console.error('❌ /stats FAILED Unified format check', statsData);
        }

        // 3. Test Search Analytics (Moved Logic)
        console.log('Testing /dashboard/search-analytics...');
        const searchRes = await fetch(`${API_URL}/dashboard/search-analytics`, { headers });
        const searchData = await searchRes.json();

        if (searchData.success === true && searchData.code === 200 && Array.isArray(searchData.data)) {
            console.log('✅ /search-analytics returns correct Unified format');
        } else {
            console.error('❌ /search-analytics FAILED Unified format check', searchData);
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
    }
}

verifyUnifiedAPI();
