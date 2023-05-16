const supertest = require('supertest');
const app = require('../app');
const truncate = require('../utils/truncate');

// reset database user
truncate.user();

const user = {
    name: 'sabrina',
    email: 'sabrina3@mail.com',
    password: 'password123',
    token: ''
};

// register
describe('TEST /auth/register endpoint', () => {
    // positive
    test('Register berhasil : email belum terdaftar', async () => {
        try {

            const res = await supertest(app)
                .post('/auth/register')
                .send(user);

            console.log(res.body);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('name');
            expect(res.body.data).toHaveProperty('email');
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('user created!');

        } catch (error) {
            expect(error).toBe('error');
        }
    });

    // negative
    test('Register gagal : email sudah terdaftar', async () => {
        try {

            const res = await supertest(app)
                .post('/auth/register')
                .send(user);

            console.log(res.body);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('email already used!');

        } catch (error) {
            expect(error).toBe('error');
        }
    });
});


// login 
describe('TEST /auth/login endpoint', () => {
    test('Login berhasil : email dan password valid', async () => {
        try {

            const res = await supertest(app)
                .post('/auth/login')
                .send(user);

            console.log(res.body);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('login success!');

            user.token = res.body.token;
        } catch (error) {
            expect(error).toBe('error');
        }
    });

    test('Login gagal : email dan password tidak valid', async () => {
        try {

            const res = await supertest(app)
                .post('/auth/login')
                .send({
                    email: user.email,
                    password: `${user.password}45`
                });

            console.log(res.body);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('credential is not valid!');

        } catch (error) {
            expect(error).toBe('error');
        }
    });
});

// whoami
describe('TEST /auth/whoami endpoint', () => {
    test('Fetch user berhasil : token di provide', async () => {
        try {

            const res = await supertest(app)
                .get('/auth/whoami')
                .set('Authorization', user.token);


            console.log(res.body);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('login success!');

        } catch (error) {
            expect(error).toBe('error');
        }
    });

    test('Fetch user gagal : token tidak di provide', async () => {
        try {

            const res = await supertest(app)
                .get('/auth/whoami');

            console.log(res.body);

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('you\'re not authorized!');

        } catch (error) {
            expect(error).toBe('error');
        }
    });
});