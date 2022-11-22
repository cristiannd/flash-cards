import { useEffect, useState } from 'react'
import { db } from './db'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState({})
  const [randomNumber, setRandomNumber] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const questionSetting = db.questions.map((question, index) => {
      return {
        ...question,
        score: 0,
        id: index,
      }
    })

    setQuestions(questionSetting)
  }, [])

  useEffect(() => {
    setQuestion(questions[randomNumber])
  }, [randomNumber, questions])

  const getRandomNumber = () => {
    setRandomNumber(prevState => {
      const newNumber = Math.floor(Math.random() * questions.length)

      if (newNumber === prevState) {
        getRandomNumber()
      }

      return newNumber
    })
  }

  const deleteQuestion = question => {
    const newQuestionList = questions.filter(
      q => q.id !== question.id
    )

    setQuestions(newQuestionList)
  }

  const handleGoodAnswer = question => {
    if (question.score > 0) {
      return deleteQuestion(question)
    }

    setQuestions(
      questions.map(q =>
        q.id === question.id
          ? {
              ...q,
              score: q.score + 1,
            }
          : q
      )
    )

    handleVisibleAnswer()
    getRandomNumber()
  }

  const handleBadAnswer = () => {
    handleVisibleAnswer()
    getRandomNumber()
  }

  const handleVisibleAnswer = () => {
    setIsVisible(prevState => !prevState)
  }

  return (
    <div>
      <div className='card'>
        <p className='question'>
          {questions[randomNumber]?.question}
        </p>
        <p className={`${isVisible ? 'visible' : 'answer'}`}>
          Respuesta
        </p>
        <button onClick={handleVisibleAnswer}>
          {isVisible ? 'Ocultar respuesta' : 'Ver respuesta'}
        </button>
        <button
          className='good_button'
          onClick={() => handleGoodAnswer(question)}
        >
          Bien
        </button>
        <button className='bad_button' onClick={handleBadAnswer}>
          Mal
        </button>
      </div>
    </div>
  )
}

export default App
