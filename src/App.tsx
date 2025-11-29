import { useState, useEffect, useCallback } from "react";
import words from './wordList.json';
import HangmanDrawing from './components/HangmanDrawing';
import HangmanWord from './components/HangmanWord';
import Keyboard from './components/Keyboard';

function getWord(){
  return words[Math.floor(Math.random() * words.length)];
};

const fetchWord = async () =>{
  try{
    const response = await fetch('https://random-word-api.vercel.app/api?words=1');
    const data = await response.json();
    return data[0];
  }
  catch(error){
    console.log("Error fetching data:", error);
    return getWord();
  }
};

function App(){

  const [wordToGuess, setWordToGuess] = useState("");
  const [guessedLetters, setGuessedLettters] = useState<string[]>([]);
  const incorrectLetters = guessedLetters.filter(letter => {
    return !wordToGuess.includes(letter);
  });
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter));

  const addGuessLetter = useCallback((letter: string) =>{
    if(guessedLetters.includes(letter) || isLoser || isWinner) return;

    setGuessedLettters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isLoser, isWinner]);

  useEffect(()=>{
    const loadWord = async () =>{
      const word = await fetchWord();
      setWordToGuess(word);
    }
    loadWord();
  }, []);

  useEffect(()=>{
    const handler  = (e: KeyboardEvent) =>{
      const key = e.key;
      if(!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessLetter(key);
    }

    document.addEventListener("keypress", handler);
    return () =>{
      document.removeEventListener("keypress", handler);
    }
  }, [guessedLetters, addGuessLetter]);

  useEffect(()=>{
    const handler  = async (e: KeyboardEvent) =>{
      const key = e.key;
      if(key !== 'Enter') return;
      e.preventDefault();
      const newWord = await fetchWord();
      console.log(newWord);
      setWordToGuess(newWord);
      setGuessedLettters([]);
    }

    document.addEventListener("keypress", handler);
    return () =>{
      document.removeEventListener("keypress", handler);
    }
  }, [guessedLetters]);
    return (
      <div style={{
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    margin: "0 auto",
    alignItems: "center",
  }}>
    <div style={{
      fontSize: "2rem",
      textAlign: "center",
      height: "2rem"
    }}>
      {isWinner && (
        <> 
        <strong style={{color: "green"}}>Winner!</strong> - Press <strong>Enter</strong> to Play Again! 🥳🙌
        </>
      )}
      {isLoser && (
        <> 
          <strong style={{color: "red"}}>Loser!</strong> - Press <strong>Enter</strong> to try Again! ▶️😝
        </>
      )}
      </div>
    <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
    <HangmanWord reveal={isLoser} guessedLetters={guessedLetters}  wordToGuess={wordToGuess} />
    <div style={{
      alignSelf: "stretch"
    }}>
      <Keyboard 
      disabled={isWinner || isLoser}
      activeLetters={guessedLetters.filter(letter =>
        wordToGuess.includes(letter)
      )}
      inactiveLetters={incorrectLetters}
      addGuessLetter={addGuessLetter}
      />
    </div>
  </div>
    )
}

export default App;