import 'jest-extended';

import { User, UserRole } from './user.domain';

describe('User Domain', () => {
  it('Should return no sensitive data', () => {
    const user = new User({
      id: 'id',
      password: 'password',
      role: UserRole.GUEST,
      username: 'username',
    });

    expect(user.getWithoutSensitiveData()).not.toContainKeys(['password']);
  });
});
