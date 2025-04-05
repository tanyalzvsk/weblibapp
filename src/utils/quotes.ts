
const quotes = [
    "make reading a daily habit—set a goal for pages or chapters each day",
    "create a cozy reading nook",
    "explore new genres to broaden your horizons",
    "keep a reading journal to capture your thoughts and favorite quotes",
    "schedule dedicated time for reading—treat",
    "swap screen time for reading before bed",
    "listen to audiobooks during commutes",
    "share your favorite reads with friends",
    "don't read books while driving a car"
  ];
  
  export const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

