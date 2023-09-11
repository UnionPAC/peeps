export const isSameSenderMargin = () => {};

export const isSameSender = () => {};

export const isLastMessage = () => {};

export const isSameUser = () => {};

export const getSender = (loggedInUser, users) => {
  return users[0]?._id === loggedInUser?._id ? users[1] : users[0];
};
