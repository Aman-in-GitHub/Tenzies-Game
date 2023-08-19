import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import Dice from './Components/Dice';
import { useEffect, useState } from 'react';

function App() {
  const [dice, setDice] = useState(createDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    const allDone = dice.every((item) => item.isHeld);
    const firstVal = dice[0].value;
    if (allDone && firstVal) {
      setTenzies(true);
      clearInterval(timer);
    }
  }, [dice, timerInterval]);

  useEffect(() => {
    if (timerInterval && !tenzies) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerInterval, tenzies]);

  function createDice() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(generateDice());
    }
    return arr;
  }

  function generateDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }

  function holdDice(id) {
    setDice((prev) => {
      const updatedDice = prev.map((item) => {
        if (item.id === id) {
          return { ...item, isHeld: !item.isHeld };
        }
        return item;
      });

      if (!timerStarted && updatedDice.some((item) => item.isHeld)) {
        setTimerInterval(true);
        setTimerStarted(true);
      }

      return updatedDice;
    });
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false);
      setDice(createDice());
      setRolls(0);
      setTimer(0);
      setTimerInterval(false);
      setTimerStarted(false);
      return;
    }

    setDice((prev) => {
      setRolls((prev) => prev + 1);
      return prev.map((item) => {
        if (item.isHeld) {
          return item;
        }
        return generateDice();
      });
    });
  }

  const arrayOfAllDice = dice.map((item) => {
    return (
      <Dice
        value={item.value}
        key={item.id}
        isHeld={item.isHeld}
        hold={() => holdDice(item.id)}
      />
    );
  });

  return (
    <>
      {tenzies ? (
        <Confetti
          width={window.innerWidth - 5}
          height={window.innerHeight - 5}
        />
      ) : null}
      <main className="bg-[#2B283A] h-[100dvh] flex justify-center items-center px-5">
        <div className="bg-white h-[80vh] flex justify-center items-center flex-col px-4 md:px-20 relative">
          <div>
            <h1 className="text-4xl text-center font-black select-none underline underline-offset-8 text-[#5035FF]">
              Tenzies
            </h1>
            <p className="py-6 max-w-[28rem] text-center text-lg select-none">
              Roll until all the dices are the same. Click each dice to freeze
              it at its current value between the rolls.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-3 md:gap-6">
            {arrayOfAllDice}
          </div>
          <button
            className="mt-16 font-semibold text-xl bg-[#5035FF] text-white w-36 py-2 rounded-sm active:scale-95 duration-300 select-none hover:shadow-lg"
            onClick={rollDice}
          >
            {tenzies ? 'New Game' : 'Roll'}
          </button>

          <span className="text-xl text-[#5035FF] px-2 py-2 absolute bottom-0 right-2 font-bold">
            Rolls: {rolls}
          </span>

          <span className="text-xl text-[#5035FF] px-2 py-2 absolute bottom-0 left-2 font-bold">
            Time: {timer}s
          </span>
        </div>
      </main>
    </>
  );
}

export default App;
