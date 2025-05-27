import React from "react"
import { languages } from "./assets/languages"
import Language from "./components/language"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

function App() {
  const alphabets = "abcdefghijklmnopqrstuvwxyz".toUpperCase()
  

  

  const [currentWord, setCurrentWord] = React.useState(getRandomWord)
  const [guessedLetters, setGuessedLetters] = React.useState([])



  function stringToArray(string){
      let array = []
      let upper = string.toUpperCase()
      for(let i=0;i<upper.length;i++){
          array.push(upper[i])
      }
      return array
  }

  function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }
  
  let currentArray = stringToArray(currentWord)
  // console.log(currentArray)

  const wrongGuessCount = guessedLetters.filter(letter => !currentArray.includes(letter)).length
  const isGameWon = currentArray.every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentArray.includes(lastGuessedLetter)
  console.log(isLastGuessIncorrect)
  const languagesDiplay = (
    languages.map((language, index) =>
    {
      let className = "languages-individual"
      if (wrongGuessCount > index) {
        className = "languages-individual languages-individual-lost"
      }
      else {
        className = "languages-individual"
      }
      return(
      <Language
        key={language.name}
        backgroundColor={language.backgroundColor}
        color={language.color}
        name={language.name}
        className={className}
      />
    )})
  )
  const wordElements = (
    currentArray.map((alphabet, index) => {
      const isGuessed = guessedLetters.includes(alphabet)
      const letterClassName = clsx(
        "word-chip", isGameOver && !isGuessed && "missed-letter"
      )
      return(
        <span key={index} className={letterClassName} >{isGuessed ? (alphabet) : (
          isGameOver&&isGameLost?(alphabet):null
          )}</span>
      )})
  )
  const keyboardElements = alphabets.split("").map((alphabet) =>
  {
    const isGuessed = guessedLetters.includes(alphabet)
    const isCorrect = isGuessed && currentArray.includes(alphabet)
    const isWrong = isGuessed && !currentArray.includes(alphabet)
    const className = clsx(
        'alphabet-chip',
        {
            correct: isCorrect,
            wrong: isWrong
        }) 
        
    // console.log(className)
    
    return (
    <button onClick={() => addGuessedLetter(alphabet)}
      key={alphabet}
        className={className}
        disabled={isGameOver ? true : false}
        aria-disabled={guessedLetters.includes(alphabet)}
        aria-label={`Letter ${alphabet}`}
    >
      {alphabet}
    
    </button>
  )})
  // console.log(guessedLetters)
  const gameClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
  })
  
  function renderGameStatus() {
      if (!isGameOver && isLastGuessIncorrect) {
        return (
          <p className="farewell-message">{getFarewellText(languages[wrongGuessCount-1].name) }</p>
          )
        }
      if (!isGameOver) {
        return null
      }
      if (isGameWon) {
        return (
          <>
            <h2>You win!</h2>
            <p>Well done! 🎉</p>
          </>
        )
      }
      if (isGameLost) {
        return (
          <>
            <h2>Game over!</h2>
            <p>You lose! Better start learning Assembly 😭</p>
          </>
        )
      }
  }

  function generateNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const numGuessesLeft = languages.length-1-wrongGuessCount
  return (
    <main>
      {isGameOver && isGameWon ? (
        <Confetti
          recycle={false}
          numberOfPieces={1000}
        />
      ) : null}
      <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under {numGuessesLeft} attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className={gameClass}
        aria-live="polite"
        role="status"
      >
              
        {renderGameStatus()}
      </section>
      <section className="languages-section">
        {languagesDiplay}
      </section>
      <section className="word-chips">
        {wordElements}
      </section>
      <section className="alphabet-chips">
        {keyboardElements}
      </section>
      <section 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      >
        <p>
          {lastGuessedLetter === undefined ? null:(
            currentArray.includes(lastGuessedLetter) ? 
                `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                `Sorry, the letter ${lastGuessedLetter} is not in the word.`
            )
            }
            You have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentArray.map(letter => 
        guessedLetters.includes(letter) ? letter + "." : "blank.")
        .join(" ")}</p>
            
      </section>
      {isGameOver?(<button className="new-game" onClick={generateNewGame}>New Game</button>):null}
    </main>
  )
}

export default App
