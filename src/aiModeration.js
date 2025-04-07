// Use this if API setup takes too long
const mockAI = {
    moderate: (text) => !['hate', 'violence'].some(word => text.includes(word))
  };