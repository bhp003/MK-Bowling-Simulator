$(document).ready(() => {
  startGame();
});

function startGame() {
  $('#play-button').click(() => {
    const game = new Game();
    game.play();
    const score = game.getScores();
    for (let frame = 0; frame < 10; frame++) {
      displayFrame(game, frame);
      displayScore(game, frame);
    }
  $('#score').val(score);
  });
}

function displayFrame(game, frame) {
  for (let i = 0; i < 2; i++) {
    // score 1 and score 2 of each frame
    $('#scoresheetTable tr:eq(1) td:eq(' + ((frame * 2) + i) + ')')
    .html(game.frames[frame][i]);
    
    // last frame 3rd score
    if (frame == game.frames.length - 1 && game.frames[frame].length == 3)
      $('#scoresheetTable tr:eq(1) td:eq(' + ((frame * 2) + 2) + ')')
      .html(game.frames[frame][2]);
  } 
}

function displayScore(game, frame) {
  $('#scoresheetTable tr:eq(2) td:eq(' + (frame) + ')')
  .html(game.scores[frame]);
}

class Game {
  constructor() {
    this.frames = []
    this.rolls = []
    this.scores = [];
    this.totalFrames = 10;
    this.bowlPerFrame = 2;
    this.maxScorePerBowl = 10;
  }

  play() {
    this.frames.length = 0;
    // random scores on the board
    for (let frame = 1; frame <= this.totalFrames; frame++) {
      let currentFrame = [];
      let maxScorePerBowl = this.maxScorePerBowl;
      for (let bowl = 1; bowl <= this.bowlPerFrame; bowl++) {
        const score = maxScorePerBowl -
          Math.floor(Math.random() * (maxScorePerBowl + 1));
        currentFrame.push(score);
        maxScorePerBowl -= score;
      }
      this.frames.push(currentFrame);
    }
    // add a 3rd score when strike or spare is scored in the last frame
    let lastFrame = this.frames[this.frames.length - 1];
    if ((lastFrame[0] > 0 || lastFrame[1] > 0) 
      && (lastFrame[0] + lastFrame[1]) % this.maxScorePerBowl === 0) {
      const extraBowlScore = 
      Math.floor(Math.random() * this.maxScorePerBowl + 1);
      lastFrame.push(extraBowlScore);
    }
    this.recordRolls();
  }

  recordRolls() {
    this.rolls.length = 0;
    // record each score for each throw
    // if strike, ignore the second 0 as it's easier to calculate
    // special scoring for strikes
    for (var i = 0; i < this.totalFrames - 1; i++) {
      this.rolls.push(this.frames[i][0]);
      if (this.frames[i][0] < this.maxScorePerBowl) {
        this.rolls.push(this.frames[i][1]);
      }
    }
    // last frame has no special scoring, keep it as normal
    this.frames[this.totalFrames - 1].forEach(
      score => this.rolls.push(score)
    );
  }

  isStrike(index) {
    return this.rolls[index] == this.maxScorePerBowl;
  }

  isSpare(index) {
    return this.rolls[index] + this.rolls[index + 1] === this.maxScorePerBowl;
  }

  getScores() {
    let score = 0;
    let index = 0;
    this.scores.length = 0;
    // Whenever we score a strike, we want to add 10 and the scores
    // of the next 2 rolls. Without the second 0 in rolls[] allows
    // us to achieve this easily without any strike/spare check for
    // the next frame. However, the first 0 in a spare is kept in
    // rolls[] like regular scores because the structure of rolls[]
    // is [score2OfPrevFrame, score1, score2, score1OfNextFrame] 
    // for every frame. This structure allows easy scoring for
    // spare.
    const nextFrame = 2;
    for (let frame = 0; frame < this.totalFrames; frame++) {
      if (this.isStrike(index)) {
        score += this.maxScorePerBowl 
          + this.rolls[index + 1] 
          + this.rolls[index + 2];
        index++;
      }
      else if (this.isSpare(index)) {
        score += this.maxScorePerBowl + this.rolls[index + nextFrame];
        index += nextFrame;
      }
      else {
        score += this.rolls[index] + this.rolls[index + 1];
        index += nextFrame;
      }
      this.scores.push(score);
    }
    return score;
  }
}