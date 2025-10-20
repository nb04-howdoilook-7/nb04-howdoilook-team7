import { loginSchema, signupSchema } from '../../schemas/AuthSchema.js';
import createValidator from '../validator.factory.js';

export const validateSignup = createValidator((req) => {
  signupSchema.parse(req.body);
});

export const validateLogin = createValidator((req) => {
  loginSchema.parse(req.body);
});
