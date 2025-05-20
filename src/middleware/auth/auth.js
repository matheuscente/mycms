
const error = require('../../fns/error.js')
const userService = require('../../dependences-conteiners/services/user.js')
const sessionService = require('../../dependences-conteiners/services/session.js')
const security = require('../../dependences-conteiners/services/crypto.js')


class authMiddleware {
    auth(role) {
        return async (req, res, next) => {
          const {token} = req.cookies
    
          if (!token) {
            next(error(2, 'permissionDenied', 'token invalid or not provided'));
            return;
          }
    
          const isJwtValid = security.verifyJwt(token)
          if (!isJwtValid.isValid) {
            if(isJwtValid.decoded === 'tokenExpired') {
              next(error(2, 'permissionDenied', 'token expired'));
            return;
            }
            next(error(2, 'permissionDenied', 'token invalid or not provided'));
            return;
          }
    
          let session
          try {
            session = await sessionService.findSession(token)

            const isSessionValid = await sessionService.checkSessionValidate(session, sessionService)

            if(!isSessionValid) {
              await sessionService.deleteSession(session, req.transaction)
              res.clearCookie('token')
              res.clearCookie('rToken')

              throw error(2, 'permissionDenied', 'invalid session, please login again')
            }
            
          } catch(err) {
            next(err)
            return
        }
        
 
          if(isJwtValid.decoded.id !== session.user.id) {

            next(error(2, 'permissionDenied', 'forgot permission'))
            return
          }
       
        
         
          const verify = await userService.verify(isJwtValid.decoded.id, isJwtValid.decoded.role);
    
          if (!verify || (role && role !== isJwtValid.decoded.role)) {
            next(error(2, 'permissionDenied', 'forgot permission'));
            return;
          } 
          
          if(role && verify.role !== role) {
            next(error(2, 'permissionDenied', 'forgot permission'));
            return;
          }
    
          
          req.session = isJwtValid.decoded;
    
          next();
        }
      };
    
      authNewJwt(role) {
        return async (req, res, next) => {
          const {rToken} = req.cookies;
          const {token} = req.cookies;
    
          if (!token || !rToken) {
            next(error(2, 'permissionDenied', 'token invalid or not provided'));
            return;
          }
    
          const isJwtValid = security.verifyJwt(token)
          if (isJwtValid.isValid || isJwtValid.decoded !== "tokenExpired") {
            next(error(2, 'permissionDenied', "for gerenerate a new token, the atual token need to be invalid"));
            return
          }
    
    
          let session,
            sessionRefreshToken
          try {
            session = await sessionService.findSession(token)
            sessionRefreshToken = await sessionService.getRefreshToken(session)
            const isSessionValid = await sessionService.checkSessionValidate(session, sessionService)

            if(!isSessionValid) {
              await sessionService.deleteSession(session, req.transaction)
              res.clearCookie('token')
              res.clearCookie('rToken')

              throw error(2, 'permissionDenied', 'invalid session, please login again')
            }

          } catch(err) {
            next(err)
            return
          }

          
          if (isJwtValid.decoded === 'tokenExpired') {
              const isRefreshTokenValid = await security.compare(rToken, sessionRefreshToken)
              if (!isRefreshTokenValid) {
                next(error(2, 'permissionDenied', 'token invalid or not provided'));
                return;
              }

              const payload = security.decodePayload(token)
              const verify = await userService.verify(payload.id, payload.role)
              if (!verify && (role && role !== payload.role)) {
                next(error(2, 'permissionDenied', 'invalid session'));
                return;
              }

              if(role && verify.role !== role) {
            next(error(2, 'permissionDenied', 'forgot permission'));
            return;
          }
            
          }
          next();
          return
        }
      }

}

module.exports = new authMiddleware()
