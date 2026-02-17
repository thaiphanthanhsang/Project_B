
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
            const user = data.user;
            const token = data.token;

            // 2. Try Admin Access (GET /users)
            // Find Superadmin ID (Test ID: 3 based on seed)
            // We will try to exploit the PUT route using the Admin account
            if (expectedRole === 'admin') {
                console.log(`[TEST] Attempting to DEMOTE Superadmin as Admin...`);
                const targetId = 3; // Superadmin ID from seed
                const exploitRes = await fetch(`${BASE_URL}/users/${targetId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: "Hacked Admin",
                        email: "superadmin@gmail.com",
                        role: "user" // Attempt to demote
                    })
                });

                if (exploitRes.status === 403) {
                    console.log(`[PASS] Security Check Passed: Admin cannot modify Superadmin (403 Forbidden)`);
                } else if (exploitRes.ok) {
                    console.error(`[FAIL] SECURITY HOLE: Admin successfully modified Superadmin!`);
                } else {
                    console.log(`[INFO] Request failed with ${exploitRes.status} (Might be 404 if seed failed or ID changed)`);
                }
            }

        }
    } catch (err) {
        console.error(`[FAIL] Network/Script Error: ${err.message}`);
    }
}

async function runTests() {
    await testRole('admin@gmail.com', 'password123', 'admin', true);
}

runTests();
