import { atom } from 'recoil';
import { STORE } from '../../contants';
import { persistAtom } from '../persist';

export const accountIdState = atom({
  key: STORE.ACCOUNT.ACCOUNT_ID,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accessTokenState = atom({
  key: STORE.ACCOUNT.ACCESS_TOKEN,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountNameState = atom({
  key: STORE.ACCOUNT.ACCOUNT_NAME,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountEmailState = atom({
  key: STORE.ACCOUNT.ACCOUNT_EMAIL,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountRoleState = atom({
  key: STORE.ACCOUNT.ACCOUNT_ROLE,
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export const accountStatusState = atom({
  key: STORE.ACCOUNT.ACCOUNT_STATUS,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountAvatarState = atom({
  key: STORE.ACCOUNT.ACCOUNT_AVATAR,
  default: '',
  effects_UNSTABLE: [persistAtom]
});
