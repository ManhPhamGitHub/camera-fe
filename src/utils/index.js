import defaultAvatar from '../assets/images/default_avatar.jpg';
import process from 'process/browser';

export const getAPIHostName = () => {
  console.log('process.env.BACKEND_BASE_URL', process.env.REACT_APP_BACKEND_BASE_URL);
  return process.env.REACT_APP_BACKEND_BASE_URL;
};

export const normalizeDate = date => {
  return date?.split('T')[0].split('-').join('/') || 'Unknow date';
};

export const getPriorityRole = roles => {
  return roles?.includes('Admin') ? 'Admin' : 'HR';
};

export const fallbackToDefaultAvatar = avatarUrl => {
  return avatarUrl ? avatarUrl : defaultAvatar;
};

export const removeTimeFromDate = timeStamp => {
  return timeStamp?.split('T')[0] || timeStamp;
};

export const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const blobToFile = (theBlob, fileName) => {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const randomText = length => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const translateStatus = status => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Làm việc tại trường';
    case 'inActive':
      return 'Đã nghỉ việc';
    case 'onBoarding':
      return 'Đi công tác';
    case 'completed':
      return 'Đã ký';
    case 'pending':
      return 'Đang chờ';
    case 'cancelled':
      return 'Đã huỷ';
    default:
      return 'Làm việc tại trường';
  }
};

export const convertDateStringToUnixDateTime = dateString => {
  const dateObj = new Date(dateString);
  const unixTimestamp = Math.floor(dateObj.getTime() / 1000);

  return unixTimestamp;
};

export const convertRouteToVNS = route => {
  switch (route) {
    case '/':
      return '>> Trang chủ';
    case '/employee':
      return '>> Nhân viên';
    case '/reports':
      return '>> Báo cáo';
    case '/department':
      return '>> Phòng ban';
    case '/contract':
      return '>> Hợp đồng';
    case '/benefit':
      return '>> Quyền lợi';
    case '/settings':
      return '>> Phân quyền';
    case '/notification':
      return '>> Thông báo';
    default:
      return '/';
  }
};

export const checkIsEmpty = value => {
  return value?.toString().trim() === '';
};

export const locale = {
  emptyText: <div>Không có dữ liệu</div>
};
