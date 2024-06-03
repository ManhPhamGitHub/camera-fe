import { atom } from 'recoil';
import { STORE } from '../../contants/';

export const loadingState = atom({
  key: STORE.APP.LOADING,
  default: false
});

export const notificationState = atom({
  key: STORE.APP.NOTIFICATION,
  default: ''
});

export const pageErrorMessageState = atom({
  key: STORE.APP.ERROR_MESSAGE,
  default: ''
});
