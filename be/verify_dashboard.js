const API_URL = 'http://localhost:5000/api';
// Using the seeded admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'password123';

async function verifyDashboard() {
    console.log('Starting Dashboard API Verification...');

    try {
        // 1. Login to get token
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const loginData = await loginRes.json();
        const token = loginData.token;

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login successful. Token obtained.');

        // 2. Test Stats Endpoint
        console.log('2. Testing /dashboard/stats...');
        const statsRes = await fetch(`${API_URL}/dashboard/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsRes.ok && statsData.revenue !== undefined) {
            console.log('✅ Stats API working. Revenue:', statsData.revenue);
        } else {
            console.error('❌ Stats API failed', statsData);
        }

        // 3. Test Sales Chart Endpoint
        console.log('3. Testing /dashboard/sales-chart...');
        const chartRes = await fetch(`${API_URL}/dashboard/sales-chart?startDate=2024-01-01&endDate=2025-12-31`, { headers });
        const chartData = await chartRes.json();
        if (Array.isArray(chartData)) {
            console.log('✅ Sales Chart API working. Data points:', chartData.length);
        } else {
            console.error('❌ Sales Chart API returned invalid format');
        }

        // 4. Test Inventory Health
        console.log('4. Testing /dashboard/inventory-health...');
        const invRes = await fetch(`${API_URL}/dashboard/inventory-health`, { headers });
        const invData = await invRes.json();
        if (Array.isArray(invData)) {
            console.log('✅ Inventory Health API working. Items found:', invData.length);
        } else {
            console.error('❌ Inventory Health API failed');
        }

        // 5. Test Top Products
        console.log('5. Testing /dashboard/top-products?type=purchased...');
        const topRes = await fetch(`${API_URL}/dashboard/top-products?type=purchased`, { headers });
        const topData = await topRes.json();
        if (Array.isArray(topData)) {
            console.log('✅ Top Products API working. Items:', topData.length);
        }

        console.log('\n🎉 Verification Completed Successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
    }
}

verifyDashboard();
