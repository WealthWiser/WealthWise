import api from '../api/client';
import { AxiosError } from 'axios'
import { saveRefreshToken } from '../utils/tokenStorage';

type RegisterPayload = {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  gender: string,
  country: string,
  dob: Date,
};


type RegisterData = {
  access_token: string,
  refresh_token: string,
}

export const loginUser = async (email : string, password: string) => {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    const { access_token, refresh_token } : RegisterData = res.data;
    // console.log("JWT: ", access_token);
    await saveRefreshToken(refresh_token);
    return access_token
  } catch (error) {
    if(error instanceof(AxiosError)){
      if(error.response?.data?.detail == "TOKEN_EXPIRED"){
        // Try Refresh Token
        console.log("Error: JWT");
      }
      else{
        console.error(error);
      }
    }
    else console.error(error);

  }
};

export const registerUser = async (payload: RegisterPayload) => {
  const res = await api.post('/auth/signup', payload);

  const { access_token, refresh_token } : RegisterData = res.data;

  await saveRefreshToken(refresh_token);
  return access_token;

  // dispatch(setAuthenticated({accessToken: access_token,user,}));
};
