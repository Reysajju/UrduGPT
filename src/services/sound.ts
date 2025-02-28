export const playMessageSentSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => console.error('Error playing sound:', err));
  } catch (error) {
    console.error('Error creating audio:', error);
  }
};

export const playMessageReceivedSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => console.error('Error playing sound:', err));
  } catch (error) {
    console.error('Error creating audio:', error);
  }
};