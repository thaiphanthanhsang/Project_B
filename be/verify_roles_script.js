
const BASE_URL = 'http://localhost:5000/api';

async function testRole(email, password, expectedRole, shouldHaveAdminAccess) {
    console.log(`\n--- Testing ${expectedRole} (${email}) ---`);
    try {
        // 1. Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            console.log(`[PASS] Login successful`);
            const user = data.user;
            const token = data.token;

            if (user.role === expectedRole) {
                console.log(`[PASS] Role matches: ${user.role}`);
            } else {
                console.error(`[FAIL] Expected role ${expectedRole}, got ${user.role}`);
            }

            // 2. Try Admin Access (GET /users)
            const adminRes = await fetch(`${BASE_URL}/users`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (adminRes.ok) {
                if (shouldHaveAdminAccess) {
                    console.log(`[PASS] Admin access granted (Expected)`);
                } else {
                    console.error(`[FAIL] Admin access granted BUT SHOULD BE DENIED`);
                }
            } else {
                if (!shouldHaveAdminAccess && adminRes.status === 403) {
                    console.log(`[PASS] Admin access denied (Expected 403)`);
                } else if (shouldHaveAdminAccess) {
                    console.error(`[FAIL] Admin access denied: ${adminRes.status}`);
                } else {
                    console.log(`[UNK] Unexpected status: ${adminRes.status}`);
                }
            }

        } else {
            const errData = await loginRes.text();
            console.error(`[FAIL] Login failed: ${loginRes.status} - ${errData}`);
        }
    } catch (err) {
        console.error(`[FAIL] Network/Script Error: ${err.message}`);
    }
}

async function runTests() {
    await testRole('superadmin@gmail.com', 'password123', 'superadmin', true);
    await testRole('admin@gmail.com', 'password123', 'admin', true);
    await testRole('user@gmail.com', 'password123', 'user', false);
}

runTests();
