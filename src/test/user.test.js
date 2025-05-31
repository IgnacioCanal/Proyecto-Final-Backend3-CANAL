import request from 'supertest';
import mongoose from 'mongoose';
import { fakerES as faker } from '@faker-js/faker';
import app from '../../server.js';
import { userModel } from '../models/user.model.js';
import { hashPassword } from '../utils/password.utils.js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const mockUser = async () => {
  const password = faker.internet.password();
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 99 }),
    email: faker.internet.email(),
    password: await hashPassword(password),
    rawPassword: password,
    isTestUser: true,
  };
};

describe('Conjunto de pruebas API USERS', () => {
  let server;

  beforeAll(async () => {
    await app.configureApp();
    server = http.createServer(app);
    server.listen(0);
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (server) server.close();
  });

  afterEach(async () => {
    await userModel.deleteMany({ isTestUser: true });
  });

  test('[POST] /api/sessions/register', async () => {
    const userData = await mockUser();
    const response = await request(app)
      .post('/api/sessions/register')
      .send({
        first_name: userData.first_name,
        last_name: userData.last_name,
        age: userData.age,
        email: userData.email,
        password: userData.rawPassword,
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login?message=register-success');
  });

  test('[POST] /api/sessions/register - Error email duplicado', async () => {
    const userData = await mockUser();
    await request(app).post('/api/sessions/register').send({
      first_name: userData.first_name,
      last_name: userData.last_name,
      age: userData.age,
      email: userData.email,
      password: userData.rawPassword,
    });
    const response = await request(app)
      .post('/api/sessions/register')
      .send({
        first_name: userData.first_name,
        last_name: userData.last_name,
        age: userData.age,
        email: userData.email,
        password: userData.rawPassword,
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('error=Usuario%20ya%20existe');
  });

  test('[POST] /api/sessions/login', async () => {
    const userData = await mockUser();
    await request(app).post('/api/sessions/register').send({
      first_name: userData.first_name,
      last_name: userData.last_name,
      age: userData.age,
      email: userData.email,
      password: userData.rawPassword,
    });
    const loginResponse = await request(app)
      .post('/api/sessions/login')
      .send({ email: userData.email, password: userData.rawPassword });

    expect(loginResponse.statusCode).toBe(302);
    expect(loginResponse.headers.location).toBe('/');
    expect(loginResponse.headers['set-cookie']).toBeDefined();
  });
});


app.configureApp = configureApp;