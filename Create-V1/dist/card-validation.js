export const cardFieldLabels = {
  name: 'Card name',
  photo: 'Photo',
  words: 'Words to write down',
  sound: 'Sound of The Moment'
};

const hasText = value => typeof value === 'string' && value.trim().length > 0;

export function cardErrors(card) {
  const errors = {};
  if (!hasText(card.name)) errors.name = 'Enter a name for your card.';
  if (!hasText(card.photo)) errors.photo = 'Choose a background or a photo.';
  if (!hasText(card.words)) errors.words = 'Write a few words for your card.';
  if (!card.recording && !card.sound) errors.sound = 'Add a recording or choose a background sound.';
  return errors;
}
