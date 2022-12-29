import './App.css';
import React, { useState, useEffect } from 'react';


const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => (
      <div key={starId} className="star" />
    ))}
  </>
);

const PlayNumber = props => (
  <button className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => props.onClick(props.number, props.status)}>
    {props.number}
  </button>
);

const PlayAgain = props => (
	<div className="game-done">
  	<div 
    	className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >
  	  {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
  	</div>
	  <button onClick={props.onClick}>Play Again</button>
	</div>
);

const StarMatch = () => {
  const [gameId,setGameId] = useState(1);
  return <Game key={gameId} startNewGame= {() => {setGameId(gameId+1)}}/>
}

const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  // candiateNums = Numbers 
  //availableNums = Numbers which are not yet cicked and are available
  // usedNums = it is just the opposite of the availableNums
  // wrongNumber = if selected number + already available candidate numbers is greater than number of stars.
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

   //Two functions to implement the timer
  // setInterval and setTimeout 

  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0)  {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1)
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidateNum) => {
    if (utils.sum(newCandidateNum) !== stars) {
      setCandidateNums(newCandidateNum);
    } else {
      const newAvailableNums = availableNums.filter(
        num => !newCandidateNum.includes(num)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  return {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState
  };
}

const Game = (props) => {
  
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState
  } = useGameState();

 
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active'; 

  const numberStatus = (number) => {
    if (!availableNums.includes(number))
      return "used";

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }

    return "available";
  }

  const onNumberClick = (number, status) => {
    // console.log(status);
    if (status === "used" || gameStatus !== 'active')
      return;
    const newCandidateNum = status === 'available' ?
      candidateNums.concat(number) : candidateNums.filter(num => num !== number);

    setGameState(newCandidateNum);
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber key={number}
              number={number}
              status={numberStatus(number)}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
