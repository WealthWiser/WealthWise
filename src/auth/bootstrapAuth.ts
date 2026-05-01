import api from '../api/client';
import {
  getRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
} from '../utils/tokenStorage';
import { decodeUserFromToken } from '../utils/jwt';
import {
  setAuthenticated,
  setUnauthenticated,
} from '../redux/slices/authSlice';

export const bootstrapAuth = async (dispatch) => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      dispatch(setUnauthenticated());
      return;
    }

    const res = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } = res.data;

    if (newRefreshToken) {
      await saveRefreshToken(newRefreshToken);
    }

    const user = decodeUserFromToken(access_token);
    if (!user) throw new Error('Invalid token');

    dispatch(
      setAuthenticated({
        accessToken: access_token,
        user,
      })
    );
  } catch (err) {
    await deleteRefreshToken();
    dispatch(setUnauthenticated());
  }
};
