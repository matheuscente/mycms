
let salt = process.env.BCRYPT_SALTS
salt = Number.parseInt(salt)

class Session {
  constructor(repository, crypto, error, userService) {
    this.repository = repository;
    this.security = crypto;
    this.error = error;
    this.userService = userService
  }
  async create(jwt, userId, transaction) {

    const isJwtValid = this.security.verifyJwt(jwt);
    if (!isJwtValid.isValid) {
      throw this.error(2, 'permissionDenied', `token invalid or not provided`);
    }
    const refreshToken = this.security.randomicPass();
    const hashedToken = await this.security.hash(refreshToken, salt);

    const session = await this.repository.create(
      { jwt, refreshToken: hashedToken, userId, isValid: true },
      transaction
    );
    return { refreshToken, createdAt: session.createdAt };
  }

  async findAllUserSessions(userId) {
    const sessions = await this.repository.findAll({ userId });
    return sessions;
  }

  async findSession(jwt) {

    const session = await this.repository.findOne({jwt});
    if (!session) {
      throw this.error(2, 'invalidSession', `invalid session, please login again`);
    }
    return session
  }

  async getRefreshToken(session, transaction) {
    if (!session) {
      throw this.error(2, 'invalidSession', `invalid session, please login again`);
    }
    const jwt = session.jwt;
    const sessionAllFields = await this.repository.findOneWithSensibleFields(
      { jwt },
      transaction
    );
    const refreshToken = sessionAllFields.refreshToken;
    return refreshToken;
  }

  async deleteSession(session, transaction) {
    return this.repository.delete(session, transaction);
  }

  async update(session, field, value, transaction) {
    if (!session) {
      throw this.error(2, 'invalidSession', `invalid session, please login again`);
    }
    let updatedSession;

    if (field === "jwt") {
      if (!value) {
        throw this.error(2, 'invalidAction', `cannot edit jwt`);
      }
      updatedSession = await this.repository.update(
       session,
        {jwt: value},
        transaction
      );
    } else {
      throw this.error(1, 'invalidAction', `invalid session modification`);
    }

    return updatedSession
  }

async login(userName, password, transaction) {
    if (!userName || !password) {
      throw this.error(1, 'missingLoginData', `userName or password not provided`);
    }

    let user
    try {
       user = await this.userService.findOneWithSensibleFields({userName: userName} , transaction);

       if(!user) {
        throw this.error(2, 'permissionDenied', `invalid username or password`);

       }

    } catch (err) {
      throw this.error(2, 'permissionDenied', `invalid username or password`);

    }

    const credentialsOk = await this.security.compare(password, user.password);

    if (!credentialsOk) {
      throw this.error(2, 'permissionDenied', `invalid username or password`);
    }

    const token = this.security.generateJwt(
      {
        id: user.id,
        role: user.role,
      },
      60 * 60
    );

    const session = await this.create(token, user.id, transaction);
    return {
      token,
      refreshToken: session.refreshToken,
      createdAt: session.createdAt,
    };
  }

  async logout(jwt, refreshToken, transaction) {
    const session = await this.findSession(jwt);

    if (!session) {
      throw this.error(2, 'permissionDenied', `invalid session, please login again`);
    }
    const sessionRefreshToken = await this.getRefreshToken(
      session,
      transaction
    );
    if (!refreshToken) {
      throw this.error(2, 'permissionDenied', `refresh token invalid or not provided`);
    }
    const isRTvalid = await this.security.compare(
      refreshToken,
      sessionRefreshToken
    );

    if (!isRTvalid) {
      throw this.error(2, 'permissionDenied', `refresh token invalid or not provided`);
    }

    return await this.deleteSession(session, transaction);
  }

  async getNewJwt(session, refreshToken, transaction) {
    if (!session) {
      throw this.error(2, 'invalidSession', `invalid session, please login again`);
    }

    const user = session.user;
    
    if(!user) {
      throw this.error(2, 'permissionDenied', `not found user`)
    }

    const sessionRefreshToken = await this.getRefreshToken(
      session,
      transaction
    );
    const isRefreshTokenCorrect = await this.security.compare(
      refreshToken,
      sessionRefreshToken
    );
    if (!isRefreshTokenCorrect) {
      throw this.error(2, 'permissionDenied', `refresh token invalid or not provided`);
    }


    const token = this.security.generateJwt(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      60 * 60

    );

    await this.update(
      session,
      "jwt",
      token,
      transaction
    );
    
    return token;
  }

  async checkSessionValidate(session) {
    const sessionCreated = session.createdAt
            const currentDate = Date.now()
            const lifeTimeSession = currentDate - sessionCreated
            if(lifeTimeSession >= 604800000) {
              return false
            }
            return true
  }
}

module.exports = Session
