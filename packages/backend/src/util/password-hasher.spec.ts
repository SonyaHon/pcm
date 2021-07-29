import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHasher } from './password-hasher';

describe('Password Hasher', () => {
  let hasher: PasswordHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHasher],
    }).compile();

    hasher = module.get<PasswordHasher>(PasswordHasher);
  });

  it('should hash password', async () => {
    const samplePassword = 'amskldmlkmas;ldkfm';
    const hashed = await hasher.hash(samplePassword);

    expect(hashed).not.toBe(samplePassword);
  });

  it('should check right password', async () => {
    const samplePassword = 'amskldmlkmas;ldkfm';
    const hashed = await hasher.hash(samplePassword);
    const checkResult = await hasher.check(samplePassword, hashed);

    expect(checkResult).toBe(true);
  });

  it('should return false with wrong password', async () => {
    const samplePassword = 'amskldmlkmas;ldkfm';
    const hashed = await hasher.hash(samplePassword);
    const checkResult = await hasher.check('not this password', hashed);

    expect(checkResult).toBe(false);
  });
});
