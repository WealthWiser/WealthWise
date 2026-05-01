import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_KEY = 'WEALTHWISE_REFRESH_TOKEN';

export const saveRefreshToken = async (token: string) => {
  await Keychain.setGenericPassword(
    REFRESH_TOKEN_KEY,
    token,
    {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    }
  );
};

export const getRefreshToken = async () => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) return null;
  return creds.password;
};

export const deleteRefreshToken = async () => {
  await Keychain.resetGenericPassword();
};
