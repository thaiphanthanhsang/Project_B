import bcrypt from 'bcrypt';

export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('users').del();

    const saltRounds = 10;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await knex('users').insert([
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: hashedPassword,
            phone: '0123456789',
            role: 'admin'
        },
        {
            id: 2,
            name: 'Test Customer',
            email: 'user@gmail.com',
            password: hashedPassword,
            phone: '0987654321',
            role: 'user'
        },
        {
            id: 3,
            name: 'Super Admin',
            email: 'superadmin@gmail.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'superadmin'
        }
    ]);

    console.log('Users seeded successfully');
}
