
export const playMessageSentSound = () => {
  const audio = new Audio('/sounds/message-sent.mp3');
  audio.volume = 0.5;
  audio.play().catch(err => console.error('Error playing sound:', err));
};

export const playMessageReceivedSound = () => {
  const audio = new Audio('/sounds/message-received.mp3');
  audio.volume = 0.5;
  audio.play().catch(err => console.error('Error playing sound:', err));
};
