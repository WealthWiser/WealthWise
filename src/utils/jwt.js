import {jwtDecode} from 'jwt-decode';

export const decodeUserFromToken = (token) => {
  try {
    console.log("JWT toke in jwt utils: ", token)
    const decoded = jwtDecode(token);
    console.log('Authslice jwt decode: ', decoded);
    return {
      id: decoded.sub,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
