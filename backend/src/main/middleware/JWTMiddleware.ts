import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import jwtAuthz from 'express-jwt-authz';
dotenv.config();
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt: jwt.RequestHandler = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});