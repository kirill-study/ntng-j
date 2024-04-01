/* #region  translation */
const translations = {
  en: {
    headline: 'Noting Vipassana Meditation: The Game',
    timer: 'Time',
    subTimer: 'Time since last keypress:',
    heard: 'Heard (h):',
    seen: 'Seen (s):',
    feel: 'Feel (f):',
    thoughts: 'Thoughts (t):',
    part: 'Part (p):',
    writing: 'Press "w" to type a thought or part description in the middle of meditation',
    distracted: 'Distracted (d):',
    longestTime: 'Longest Time Between Presses: 0 seconds',
    startButton: 'Start Timer',
    endButton: 'End Session',
    instruction: 'See-Hear-Feel-Think-Part',
    keypressInstruction: 'Press "h" for hear, "s" for see, and so on, when you notice your attention doing it'
  },
  ru: {
    headline: 'Ноутинг Випассана Медитация: Игра',
    timer: 'Время',
    subTimer: 'C последнего нажатия клавиши:',
    heard: 'Слышу (h):',
    seen: 'Вижу (s):',
    feel: 'Чувствую (f):',
    thoughts: 'Думаю (t):',
    writing: 'Нажмите П (писать), чтобы записать мысль или название субличности',
    part: 'Часть (p):',
    distracted: 'Отвлеченный (d):',
    longestTime: 'Самый долгий интервал между нажатиями: 0 секунд',
    startButton: 'Начать таймер',
    endButton: 'Закончить сеанс',
    instruction: 'Вижу-Слышу-Чувствую-Думаю-субЛичность',
    keypressInstruction: 'Нажимайте В (вижу) или Ч (чувствую) и т.п., когда замечаете, что внимание сейчас там'
  }
}
let lang = 'en'
// Function to translate the page
function translatePage(language) {
  // Translate elements with data-translate attribute
  const elements = document.querySelectorAll('[data-translate]')
  elements.forEach(element => {
    const key = element.getAttribute('data-translate')
    element.textContent = translations[language][key]
  })
  lang = language

  updateBarChart()
}
/* #endregion */

/* #region  sessions */
document.getElementById('sessionHistoryButton').addEventListener('click', function () {
  window.location.href = 'session-history.html' // Change 'session-history.html' to the actual URL of your session history page
})

function endSession() {
  clearInterval(timerInterval)
  timerStarted = false
  document.getElementById('startPauseButton').textContent = 'Start Timer'
  isPaused = false

  // Save session data
  saveSession()
}

// Function to save session data to localStorage
function saveSession() {
  const sessionData = {
    startTime,
    pausedTime,
    counters,
    textInput
  }
  localStorage.setItem('sessionData', JSON.stringify(sessionData))
}

// Function to load session data from localStorage if available
function loadSession() {
  const sessionData = JSON.parse(localStorage.getItem('sessionData'))
  if (sessionData) {
    startTime = sessionData.startTime || 0
    pausedTime = sessionData.pausedTime || 0
    counters = sessionData.counters || {}
    textInput = sessionData.textInput || ''
    updateCounterDisplay() // Update counter display with loaded data
    if (!isPaused) {
      startTimer() // Resume timer if session was not paused
    }
  }
}

/* #endregion */

let textInputMode = false // Variable to track whether the user is in text input mode
let textInput = '' // Variable to store the text input by the user
let lastInput = '' // Variable to store the last entered text

document.addEventListener('keydown', function (event) {
  const key = event.key.toLowerCase()

  handleCounterUpdate(key)
  handleStartPause(key)
  handleTextInput(key)
})

function handleCounterUpdate(key) {
  // Store the last pressed button if user is not in text input mode and it's one of the counters
  if (!textInputMode && (key === 'h' || key === 's' || key === 'f' || key === 't' || key === 'p' || key === 'd' || key === 'с' || key === 'в' || key === 'ч' || key === 'д' || key === 'л' || key === 'о')) {
    lastCounterPressed = key;
  }

  if (lang == 'en') {
    if (!textInputMode && (key === 'h' || key === 's' || key === 'f' || key === 't' || key === 'p' || key === 'd')) {
      updateCounter(key)
    }
  } else if (lang == 'ru') {
    if (!textInputMode && (key === 'с' || key === 'в' || key === 'ч' || key === 'д' || key === 'л' || key === 'о')) {
      updateCounter(key)
    }
  }
}

function handleStartPause(key) {
  if (key === ' ') {
    startPauseTimer()
  }
}

function handleTextInput(key) {
  if (textInputMode) {
    if (key === 'backspace') {
      handleBackspace()
    } else if (['arrowleft', 'arrowright'].includes(key)) {
      handleArrowKey(key)
    } else if (key !== 'enter' && key !== 'escape' && key !== 'shift') {
      handleTextInputCharacter(key)
    } else {
      handleTextInputModeExit(key)
    }
  } else {
    handleTextInputModeActivation(key)
  }
}

function handleTextInputModeExit(key) {
  if (key === 'enter') {
    saveTextInput()
  } else if (key === 'escape') {
    cancelTextInput()
  }
}

function saveTextInput() {
  lastInput = textInput // Store the last entered text before clearing the input
  textInput = '' // Reset the text input
  updateTextDisplay(lastInput) // Update the display with the last entered text (excluding the 'w' or 'п' key)
  document.getElementById('textInput').textContent = '' // Clear the input field content
  document.getElementById('textInput').blur() // Blur the text input area
  textInputMode = false
}

function cancelTextInput() {
  lastInput = textInput // Store the last entered text before clearing the input
  textInput = '' // Reset the text input
  document.getElementById('textInput').textContent = '' // Clear the input field content
  document.getElementById('textInput').blur() // Blur the text input area
  textInputMode = false
}

function handleBackspace() {
  // Remove the last character from the text input
  textInput = textInput.slice(0, -1)
  console.log(textInput) // Log the current textInput after backspace
}

function handleArrowKey(key) {
  // Handle arrow key navigation within the text input field
  event.preventDefault() // Prevent default behavior of arrow keys
  const textInputField = document.getElementById('textInput')
  const selectionStart = textInputField.selectionStart
  const selectionEnd = textInputField.selectionEnd
  if (key === 'arrowleft' && selectionStart > 0) {
    textInputField.setSelectionRange(selectionStart - 1, selectionStart - 1)
  } else if (key === 'arrowright' && selectionEnd < textInput.length) {
    textInputField.setSelectionRange(selectionEnd + 1, selectionEnd + 1)
  }
}

function handleTextInputCharacter(key) {
  // Capture keyboard input in text input mode
  textInput += event.key
  console.log(textInput) // Log the current textInput after each keypress
}

function handleTextInputModeActivation(key) {
  if (key === 'w' || key === 'п') {
    event.preventDefault() // Prevent default behavior of W or П key
    document.getElementById('writing').style.display = 'none'

    // If the last pressed button-counter was P or Л, add the bolded "part:" or "субличность" prefix
    if (['p', 'л'].includes(lastCounterPressed)) {
      textInput = `${lastCounterPressed === 'p' ? 'part:' : 'субличность:'} ${textInput}`;
    }
    // Enable text input mode
    textInputMode = true
    document.getElementById('textInput').style.display = 'block' // Show the text input display
    document.getElementById('textInput').focus() // Focus on the text input area
  }
}

// Update the text display with the last entered text
function updateTextDisplay(input) {
  const textDisplay = document.createElement('div')
  textDisplay.textContent = input
  document.getElementById('barChartContainer').appendChild(textDisplay) // Append after the bar chart
}
let lastCounterPressed = '';
let startTime
let timerInterval
let pausedTime = 0
let heardCount = 0
let seenCount = 0
let feelCount = 0
let thoughtCount = 0
let partCount = 0
let distractedCount = 0 // New counter for distractions
let timerStarted = false
const timerPaused = false
let lastKeyPressTime = 0 // Variable to store the time of the last key press
let longestTimeBetweenPresses = 0 // Variable to store the longest time between key presses
let lastInstructionTime = 0 // Variable to store the time of the last instruction
let isPaused = false // Variable to track if the timer is paused

function startPauseTimer() {
  if (!timerStarted) {
    startTimer()
    // speak("Let's start noting!");
    lastInstructionTime = Date.now()
  } else {
    if (isPaused) {
      resumeTimer()
    } else {
      pauseTimer()
    }
  }
}

function startTimer() {
  startTime = Date.now() - pausedTime
  timerInterval = setInterval(updateTimer, 1000)
  timerStarted = true
  document.getElementById('startPauseButton').textContent = 'Pause Timer'
  isPaused = false // Reset the pause state
}

function pauseTimer() {
  clearInterval(timerInterval)
  pausedTime = Date.now() - startTime
  timerStarted = false
  isPaused = true
  document.getElementById('startPauseButton').textContent = 'Resume Timer'
}

function resumeTimer() {
  startTimer()
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime
  const formattedTime = formatTime(elapsedTime)
  document.getElementById('timer').textContent = formattedTime

  // Update time since last key press
  const timeSinceLastKeyPress = (Date.now() - lastKeyPressTime) / 1000
  if (lang == 'en') {
    document.getElementById('subTimer').textContent = `Time since last keypress: ${formatTime(timeSinceLastKeyPress * 1000, true)}`
  } else if (lang == 'ru') {
    document.getElementById('subTimer').textContent = `С последнего нажатия клавиши: ${formatTime(timeSinceLastKeyPress * 1000, true)}`
  }

  // Check if more than 60 seconds have passed since the last key press, if so, increment distracted counter
  if (timeSinceLastKeyPress > 60 && !isPaused) {
    distractedCount++
    // speak("Gently notice where your attention is right now. Looks like you got distracted. It's inevitable, let's get back to it.");
    updateCounterDisplay()
    lastKeyPressTime = Date.now() // Update last key press time
  }

  // Check if it's been more than 5 minutes since the last instruction, if so, provide another instruction
  if (Date.now() - lastInstructionTime > 300000 && !isPaused) {
    // speak("Gently notice where your attention is right now.");
    lastInstructionTime = Date.now()
  }
}

function formatTime(milliseconds, shortFormat = false) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (shortFormat) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message)
  speechSynthesis.speak(utterance)
}

function updateCounter(key) {
  const currentTime = Date.now()
  const timeSinceLastKeyPress = (currentTime - lastKeyPressTime) / 1000 // Calculate time since last key press in seconds
  if (timerStarted && timeSinceLastKeyPress > longestTimeBetweenPresses) {
    longestTimeBetweenPresses = timeSinceLastKeyPress
    document.getElementById('longestTime').textContent = `Longest Time Between Presses: ${longestTimeBetweenPresses.toFixed(2)} seconds`
  }
  lastKeyPressTime = currentTime
  if (lang == 'en') {
    switch (key) {
      case 'h':
        heardCount++
        break
      case 's':
        seenCount++
        break
      case 'f':
        feelCount++
        break
      case 't':
        thoughtCount++
        break
      case 'p':
        partCount++
        break
      case 'd':
        distractedCount++
        // speak("Got distracted? You are doing great");
        //speak('aaaaaa')
        break
      default:
        break
    }
  } else if (lang == 'ru') {
    switch (key) {
      case 'с':
        heardCount++
        break
      case 'в':
        seenCount++
        break
      case 'ч':
        feelCount++
        break
      case 'д':
        thoughtCount++
        break
      case 'л':
        partCount++
        break
      case 'о':
        distractedCount++
        // speak("Got distracted? You are doing great");
        //speak('aaaaaa')
        break
      default:
        break
    }
  }

  if (!timerStarted && (heardCount > 0 || seenCount > 0 || feelCount > 0 || thoughtCount > 0 || partCount > 0 || distractedCount > 0)) {
    startTimer()
  }
  updateBarChart()
  updateCounterDisplay()
}

function updateCounterDisplay() {
  document.getElementById('heardCounter').textContent = heardCount
  document.getElementById('seenCounter').textContent = seenCount
  document.getElementById('feelCounter').textContent = feelCount
  document.getElementById('thoughtCounter').textContent = thoughtCount
  document.getElementById('partCounter').textContent = partCount
  document.getElementById('distractedCounter').textContent = distractedCount
}

function updateBarChart() {
  const counterData = [seenCount, heardCount, feelCount, thoughtCount, partCount, distractedCount]
  let labels = ['Seen', 'Heard', 'Felt', 'Thought', '(noticed) Part', '(got) Distracted']

  if (lang == 'ru') {
    labels = ['Видел', 'Слышал', 'Чувствовал', 'Думал', 'субЛичность', 'Отвлекался']
  }

  // Update the chart data
  if (window.myBar) {
    window.myBar.data.labels = labels // Update the labels
    window.myBar.data.datasets[0].data = counterData // Update the counter data
    window.myBar.update() // Update the chart
  } else {
    const ctx = document.getElementById('barChart').getContext('2d')
    window.myBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: counterData,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'black' // Changed color to black
          ],
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }
}

document.addEventListener('keydown', function (event) {
  const key = event.key.toLowerCase()

  if (lang == 'en') {
    if (!textInputMode && (key === 'h' || key === 's' || key === 'f' || key === 't' || key === 'p' || key === 'd')) {
      updateCounter(key)
    }
  } else if (lang == 'ru') {
    if (!textInputMode && (key === 'с' || key === 'в' || key === 'ч' || key === 'д' || key === 'л' || key === 'о')) {
      updateCounter(key)
    }
  }
  if (key === ' ') {
    startPauseTimer()
  }
})

document.getElementById('startPauseButton').addEventListener('click', startPauseTimer)
document.getElementById('endButton').addEventListener('click', endSession)
window.onload = function () {
  updateBarChart()
}
