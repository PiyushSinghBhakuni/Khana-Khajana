// =============================================
//  KHANA KHAJANA — App State & Constants
// =============================================

const AVATARS = [
  '🧑‍🍳','👨‍🍳','👩‍🍳','🙋','🙋‍♂️','🙋‍♀️',
  '👦','👧','👨','👩','🧔','👴','👵','🧑','🤴','👸'
];

const FOOD_EMOJIS = [
  '🍛','🍲','🥘','🍜','🥗','🍱','🥙','🫕','🍝',
  '🥩','🍗','🥦','🍳','🥞','🫔','🫓','🥨','🧆',
  '🌮','🌯','🫛','🥕','🍅','🥐','🍞','🧇','🥚','🥣'
];

let state = {
  page:            'loading',  // loading | landing | auth | charPicker | kitchenChoice | kitchenAuth | kitchenCreate | kitchen
  authMode:        null,       // 'login' | 'register'
  currentUser:     null,
  currentKitchen:  null,
  kitchenTab:      'home',     // home | inventory | poll | history | settings
  alert:           null,       // { msg, type }
  loading:         false,
  _tempChar:       '🧑‍🍳',
  _pendingUser:    null        // full user object waiting for char pick
};
