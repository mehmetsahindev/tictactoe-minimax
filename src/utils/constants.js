export const gamePlayers = {
  User: "user",
  AI: "ai",
};

export const gamePlayerSymbols = {
  user: "O",
  ai: "X",
};

export const gameResults = {
  User: gamePlayers.User,
  AI: gamePlayers.AI,
  Tie: "tie",
};

export const gameScores = {
  [gameResults.User]: -10,
  [gameResults.AI]: 10,
  [gameResults.Tie]: 0,
};
