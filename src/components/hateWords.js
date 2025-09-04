// Content moderation utilities
export const hateWords = [
  // Offensive language
  'hate', 'stupid', 'idiot', 'moron', 'dumb', 'loser', 'pathetic',
  'worthless', 'useless', 'garbage', 'trash', 'scum', 'disgusting',
  
  // Discriminatory terms
  'racist', 'sexist', 'bigot', 'nazi', 'fascist',
  
  // Profanity (mild examples for demo)
  'damn', 'hell', 'crap', 'sucks',
  
  // Threats and violence
  'kill', 'die', 'murder', 'violence', 'hurt', 'harm', 'attack',
  'destroy', 'eliminate', 'annihilate',
  
  // Harassment
  'stalker', 'creep', 'pervert', 'freak', 'weirdo',
  
  // Spam indicators
  'spam', 'scam', 'fake', 'bot', 'virus', 'malware'
];

export const moderateContent = (text) => {
  if (!text || typeof text !== 'string') return { isClean: true, flaggedWords: [] };
  
  const lowerText = text.toLowerCase();
  const flaggedWords = hateWords.filter(word => 
    lowerText.includes(word.toLowerCase())
  );
  
  return {
    isClean: flaggedWords.length === 0,
    flaggedWords,
    severity: flaggedWords.length > 2 ? 'high' : flaggedWords.length > 0 ? 'medium' : 'low'
  };
};

export const cleanContent = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let cleanedText = text;
  hateWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedText = cleanedText.replace(regex, '*'.repeat(word.length));
  });
  
  return cleanedText;
};