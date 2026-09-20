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
  if (!card.recording) errors.sound = 'Add a recording, choose a sound, then save your mix.';
  else if (!card.sound) errors.sound = 'Choose a background sound, then save your mix.';
  else if (!card.mixed) errors.sound = 'Save your mix to finish Sound of The Moment.';
  return errors;
}
