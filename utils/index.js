import axiosServer from "../config/axiosServer.js";

export const getIdRoom = (userId1, userId2) => {
  if (+userId1 <= userId2) {
    return `${userId1}-${userId2}`;
  }
  return `${userId2}-${userId1}`;
};

export const updateStatusUser = (userId, status) => {
  if (!userId) {
    return;
  }
  axiosServer.put(`chats?user_id=${userId}&status=${status}`);
};

export const sendMessage = (data) => {
  const { from, to, text, file, message_type } = data;
  const dataMessage = {
    from_id: from.id,
    to_user: to.id,
    friend_id: to.id,
    message_type,
    message: text,
    file: file,
    is_subfolder: '',
  }
  console.log(dataMessage)
  return axiosServer.post('messages', dataMessage).catch(err => {
    console.log(err)
  });
};