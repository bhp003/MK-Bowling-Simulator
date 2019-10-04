const Game = require('./Game');

function setAllStrikes(gameTest) {
  gameTest.frames.length = 0;
  for (let frame = 1; frame <= 9; frame++) {
    gameTest.frames.push([gameTest.maxScorePerBowl, 0]);
  }
  gameTest.frames.push([gameTest.maxScorePerBowl, gameTest.maxScorePerBowl, gameTest.maxScorePerBowl]);
  gameTest.recordRolls();
}

function setAllSpares(gameTest) {
  gameTest.frames.length = 0;
  for (let frame = 1; frame <= 9; frame++) {
    gameTest.frames.push([0, gameTest.maxScorePerBowl]);
  }
  gameTest.frames.push([0, gameTest.maxScorePerBowl, gameTest.maxScorePerBowl]);
  gameTest.recordRolls();
}

function setIncrementScores(gameTest) {
  gameTest.frames.length = 0;
  // frame 1 will have all scores 0 incrementing
  // to frame 10 which has all scores 9
  for (let frame = 0; frame < gameTest.totalFrames; frame++) {
    let currentFrame = [frame, 0];
    gameTest.frames.push(currentFrame);
  }
  gameTest.recordRolls();
}

function compareTwoGames(game1Frames, game2Frames) {
  for (let i = 0; i < 10; i++) {
    if (game1Frames[i].length != game2Frames[i].length)
      return false;
    for (let j = 0; j < 2; j++) {
      if (game1Frames[i][j] != game2Frames[i][j])
        return false;
    }
  }
  return true;
}

function testSetAllStrike() {
  test('Game frames should be == testFrames', () => {
    const gameTest = new Game();
    setAllStrikes(gameTest);
    testFrames = [
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 0],
      [10, 10, 10]
    ];
    expect(compareTwoGames(gameTest.frames, testFrames)).toBe(true);
  });
}

function testSetAllSpares() {
  test('Game frames should be == testFrames', () => {
    const gameTest = new Game();
    setAllSpares(gameTest);
    testFrames = [
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10],
      [0, 10, 10],
    ];
    expect(compareTwoGames(gameTest.frames, testFrames)).toBe(true);
  });
}

function testIsStrike() {
  const gameTest = new Game();
  // testing with scores = [0, 10], [10, 0], [4, 6], [10, 0]
  gameTest.rolls = [0, 10, 10, 4, 6, 10];
  test('[0, 10] should not be strike', () => {
    expect(gameTest.isStrike(0)).toBe(false);
  });
  test('[10, 0] should be strike', () => {
    expect(gameTest.isStrike(2)).toBe(true);
  });
  test('[4, 6] should not be strike', () => {
    expect(gameTest.isStrike(3)).toBe(false);
  });
  test('[10, 0] should be strike', () => {
    expect(gameTest.isStrike(5)).toBe(true);
  });
}

function testIsSpare() {
  const gameTest = new Game();
  // testing with scores = [0, 10], [10, 0], [4, 6], [5, 2]
  gameTest.rolls.length = 0;
  gameTest.rolls = [0, 10, 10, 4, 6, 5, 2]
  test('[0, 10] should be spare', () => {
    expect(gameTest.isSpare(0)).toBe(true);
  });
  test('[10, 0] should not be spare', () => {
    expect(gameTest.isSpare(2)).toBe(false);
  });
  test('[4, 6] should be spare', () => {
    expect(gameTest.isSpare(3)).toBe(true);
  });
  test('[5, 2] should not be spare', () => {
    expect(gameTest.isSpare(5)).toBe(false);
  });
}

function testScoreAllStrike() {
  test('All strikes should have score 300', () => {
    const gameTest = new Game();
    setAllStrikes(gameTest);
    expect(gameTest.getScores()).toBe(300);
  });
}

function testScoreAllSpare() {
  test('All spares should have score 110', () => {
    const gameTest = new Game();
    setAllSpares(gameTest);
    expect(gameTest.getScores()).toBe(110);
  });
}

function testScoreIncrement() {
  test('Scores should be 45', () => {
    const gameTest = new Game();
    setIncrementScores(gameTest);
    expect(gameTest.getScores()).toBe(45);
  });
}

function testRecordRolls() {
  test('All strikes should be 12 10s', () => {
    const gameTest = new Game();
    const allStrikes = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    setAllStrikes(gameTest);
    expect(gameTest.rolls).toStrictEqual(allStrikes);
  });
  test('All spares should be [0, 10] for 9 frames and [0, 10, 10] for last game', () => {
    const gameTest = new Game();
    const allSpares = [
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10,
      0, 10, 10
    ];
    setAllSpares(gameTest);
    expect(gameTest.rolls).toStrictEqual(allSpares);
  });
}

testIsStrike();
testIsSpare();
testRecordRolls();
testSetAllStrike();
testSetAllSpares();
testScoreAllStrike();
testScoreAllSpare();
testScoreIncrement();