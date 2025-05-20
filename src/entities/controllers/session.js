const user = require("../models/user");

class sessionController {
    constructor(service, security, userService) {
        this.service = service
        this.security = security
        this.userService = userService
    }
  async login(req, res, next) {
    try {
            const { userName, password } = req.body;

      const token = await this.service.login(userName, password, req.transaction);
      req.session = this.security.verifyJwt(token.token).decoded

      await req.transaction.commit()      
      res.cookie('token', token.token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
        maxAge: 2592000000
      });

      res.cookie('rToken', token.refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
        maxAge: 2592000000
      });
      res.status(200).json({ success: 'login successfully' });
    } catch (err) {
      next(err);
      return;
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken  = req.cookies.rToken;
      const jwt = req.cookies.token;
      const session = await this.service.logout(jwt, refreshToken,  req.transaction);
      await req.transaction.commit()
      res.clearCookie('token');    
      res.clearCookie('rToken');   

      res.status(200).json({ session });
    } catch (err) {
      next(err);
      return;
    }
  }

  async getNewJwt(req, res, next) {
    try {

      const jwt = req.cookies.token;
      const token  = req.cookies.rToken;

      const session = await this.service.findSession(jwt)
      if(!session) {
        
      }
      const newJwt = await this.service.getNewJwt(session, token,  req.transaction);
      await req.transaction.commit()
      
      res.clearCookie('token');    
      res.cookie('token', newJwt, {
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
        maxAge: 2592000000
      });

      res.status(200).json({ success: 'new token created successfully' });
    } catch (err) {
      next(err);
      return;
    }
  }

}

module.exports = sessionController
