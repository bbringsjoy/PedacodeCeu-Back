import request from 'supertest';
import app from '../app';

describe('Teste de integração - Auth', () => {

  test('Login com credenciais válidas', async () => {
    const result = await request(app)
      .post('/auth/login')
      .send({ email: 'auth@test.com', senha: 'Senha@123' });

    expect(result.statusCode).toEqual(200);
  });

  test('Login com senha incorreta', async () => {
    const result = await request(app)
      .post('/auth/login')
      .send({ email: 'auth@test.com', senha: 'SenhaErrada@1' });

    expect(result.statusCode).toEqual(401);
  });

  test('Login com e-mail inválido', async () => {
    const result = await request(app)
      .post('/auth/login')
      .send({ email: 'emailinvalido', senha: 'Senha@123' });

    expect(result.statusCode).toEqual(400);
  });

  test('Login sem senha', async () => {
    const result = await request(app)
      .post('/auth/login')
      .send({ email: 'auth@test.com' });

    expect(result.statusCode).toEqual(400);
  });

});