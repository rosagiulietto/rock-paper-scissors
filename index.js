const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
// #result no longer exists in the markup: keep the game working without it
const resultDisplay = document.getElementById('result')
const possibleChoices = document.querySelectorAll('.choices button')   // NOT the modal button
const computerScoreDisplay = document.getElementById('computer-score')
const userScoreDisplay = document.getElementById('user-score')
const winnerDisplay = document.getElementById('the-winner-is')
const computerChoiceImg = document.getElementById('computer-choice-img')
const userChoiceImg = document.getElementById('user-choice-img')
const computerColumn = document.getElementById('computer-choice').closest('.column')
const userColumn = document.getElementById('user-choice').closest('.column')
const RESULT_STATES = ['is-win', 'is-lose', 'is-draw']
const rewardTrack = document.querySelector('.reward-track')
const rewardSlots = document.querySelectorAll('.reward')
const choices = document.querySelector('.choices')
const CHOICE_WAIT_MS = 3000            // seconds to wait before the next choice
let waitTimer = null
// rewards are unlocked in this order, one per user point
const rewardOrder = [1, 5, 2, 4, 3]

// reward packs: one folder = one game. Add a folder name here to make it playable
const rewardPacks = ['images/reward_1', 'images/reward_3', 'images/reward_4']
let currentPack = rewardPacks[0]

const modal = document.getElementById('game-over-modal')
const modalCard = modal.querySelector('.modal-card')
const modalTitle = document.getElementById('modal-title')
const modalComputerScore = document.getElementById('modal-computer-score')
const modalUserScore = document.getElementById('modal-user-score')
const modalReward = document.getElementById('modal-reward')
const playAgainButton = document.getElementById('play-again')
let gameOver = false
let computerScore = parseInt(document.getElementById('computer-score').innerText)  // The first score is 0
let userScore = parseInt(document.getElementById('user-score').innerText)  // The first score is 0
let userChoice
let computerChoice
let result


possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', function(e) {
    if (gameOver) return                       // the modal stopped the game
    userChoice = e.currentTarget.id
    userChoiceDisplay.innerHTML = userChoice
    showTool(userChoiceImg, userChoice)
    generateComputerChoice()
    getResult()
    highlightColumns()
    generateScore()
    updateRewards()
    theWinnerIs()

    // three seconds before the player can pick rock/paper/scissors again
    if (!gameOver) startCooldown()
}))

// images/tools/rock.png, paper.png, scissors.png
function showTool(imgElement, choice) {
    if (choice) {
        imgElement.src = `images/tools/${choice}.png`
        imgElement.alt = choice
    } else {
        imgElement.removeAttribute('src')
        imgElement.alt = ''
    }
}

function generateComputerChoice() {
    // Math.random() returns a floating-point number in the range 0 to less than 1 
    const randomNumber = Math.floor(Math.random() * possibleChoices.length + 1)
    if (randomNumber === 1) {
        computerChoice = 'rock'
    }    
    if (randomNumber === 2) {
        computerChoice = 'paper'
    }    
    if (randomNumber === 3) {
        computerChoice = 'scissors'
    }
    computerChoiceDisplay.innerHTML = computerChoice
    showTool(computerChoiceImg, computerChoice)
}

function getResult() {
    if (computerChoice === userChoice) {
        result = 'Patta! It\'s a draw!'
    }    
    if (computerChoice === 'rock' && userChoice === 'paper') {
        result = 'You won!'
    }
    if (computerChoice === 'rock' && userChoice === 'scissors') {
        result = 'You lost...'
    }   
    if (computerChoice === 'paper' && userChoice === 'rock') {
        result = 'You lost...'
    }    
    if (computerChoice === 'paper' && userChoice === 'scissors') {
        result = 'You won!'
    }    
    if (computerChoice === 'scissors' && userChoice === 'rock') {
        result = 'You won!'
    }    
    if (computerChoice === 'scissors' && userChoice === 'paper') {
        result = 'You lost...'
    }
    if (resultDisplay) resultDisplay.innerHTML = result
}

// highlight the two choice columns for the last round:
// green = won, red = lost, yellow = draw
function highlightColumns() {
    computerColumn.classList.remove(...RESULT_STATES)
    userColumn.classList.remove(...RESULT_STATES)

    if (result === 'You won!') {
        userColumn.classList.add('is-win')
        computerColumn.classList.add('is-lose')
    } else if (result === 'You lost...') {
        computerColumn.classList.add('is-win')
        userColumn.classList.add('is-lose')
    } else {
        userColumn.classList.add('is-draw')
        computerColumn.classList.add('is-draw')
    }
}

function generateScore() {
    if (result === 'You lost...') {
        computerScore += 1
        computerScoreDisplay.innerHTML = computerScore.toString()
    }
    if (result === 'You won!') {
        userScore += 1
        userScoreDisplay.innerHTML = userScore.toString()
    }
}

// 1 point -> image 1, 2 points -> 1 + 5, 3 -> 1 + 5 + 2, 4 -> ... + 4, 5 -> all of them
function updateRewards() {
    rewardSlots.forEach(slot => {
        const step = rewardOrder.indexOf(Number(slot.dataset.image))
        slot.classList.toggle('is-revealed', step > -1 && step < userScore)
    })
    rewardTrack.classList.toggle('is-complete', userScore >= rewardOrder.length)
}

function theWinnerIs() {
    if (computerScore === 5 || userScore === 5) {
        gameOver = true
        const userWon = userScore === 5
        const winnerText = userWon ? 'The winner is you!' : 'The winner is the Computer...'

        winnerDisplay.innerHTML = winnerText
        computerChoiceDisplay.innerHTML = ''
        userChoiceDisplay.innerHTML = ''
        if (resultDisplay) resultDisplay.innerHTML = ''
        showTool(computerChoiceImg, null)
        showTool(userChoiceImg, null)

        // interrupt the game with the modal
        modalTitle.textContent = winnerText
        modalComputerScore.textContent = computerScore
        modalUserScore.textContent = userScore
        modalCard.classList.toggle('is-user-win', userWon)
        modalCard.classList.toggle('is-computer-win', !userWon)
        // full picture of the played pack, only when the player wins
        showWinImage(userWon ? currentPack : null)
        modal.hidden = false
        document.body.classList.add('modal-open')
        playAgainButton.focus()
    }
}

// a new game: everything back to the initial state, with a different reward pack
function playAgain() {
    gameOver = false
    computerScore = 0
    userScore = 0
    computerScoreDisplay.innerHTML = '0'
    userScoreDisplay.innerHTML = '0'
    computerChoiceDisplay.innerHTML = ''
    userChoiceDisplay.innerHTML = ''
    if (resultDisplay) resultDisplay.innerHTML = ''
    showTool(computerChoiceImg, null)
    showTool(userChoiceImg, null)
    winnerDisplay.innerHTML = ''
    rewardSlots.forEach(slot => slot.classList.remove('is-revealed'))
    rewardTrack.classList.remove('is-complete')
    // the columns keep the color of the last round: startCooldown() will
    // remove it when the wait is over

    modal.hidden = true
    document.body.classList.remove('modal-open')
    showWinImage(null)

    // if we played with reward_1, now we play with reward_2 (or any other pack)
    loadRewardPack(pickRewardPack(currentPack))

    // the new game starts with the same cool-down: three seconds before the
    // player can pick rock/paper/scissors again
    startCooldown()
}

// for COOLDOWN_SECONDS the choice buttons are disabled; when the wait ends
// they come back active and the two game columns lose their color
function startCooldown() {
    possibleChoices.forEach(button => { button.disabled = true })
    choices.classList.add('is-waiting')

    clearInterval(waitTimer)
    waitTimer = setTimeout(() => {
        choices.classList.remove('is-waiting')
        computerColumn.classList.remove(...RESULT_STATES)
        userColumn.classList.remove(...RESULT_STATES)
        possibleChoices.forEach(button => { button.disabled = false })
    }, CHOICE_WAIT_MS)
}
playAgainButton.addEventListener('click', playAgain)

// the whole picture of the played pack (image_w.png) inside the modal;
// hidden when there is nothing to show or the file is missing
function showWinImage(pack) {
    if (pack) {
        modalReward.src = `${pack}/image_w.png`
        modalReward.alt = 'Reward'
    } else {
        modalReward.removeAttribute('src')
        modalReward.alt = ''
    }
}

modalReward.addEventListener('error', () => showWinImage(null))

// a random pack, never the one just played; broken packs are skipped
const brokenPacks = new Set()

function pickRewardPack(previousPack) {
    const pool = rewardPacks.filter(pack => pack !== previousPack && !brokenPacks.has(pack))
    return pool[Math.floor(Math.random() * pool.length)]
}

function loadRewardPack(pack) {
    currentPack = pack
    rewardSlots.forEach(slot => {
        slot.querySelector('img').src = `${pack}/image_${slot.dataset.image}.png`
    })

    // the "five floors" must compose the picture: the tiles take the ratio of
    // the slices (1/1 for the colored squares, wide strips for cut.py packs)
    const probe = new Image()
    probe.onload = () => {
        const ratio = probe.naturalWidth / probe.naturalHeight
        rewardTrack.style.setProperty('--reward-ratio', `${probe.naturalWidth} / ${probe.naturalHeight}`)
        rewardTrack.style.setProperty('--reward-ratio-num', ratio.toFixed(4))
        // sliced photo packs get a neutral glow: the per-slot colors belong to
        // the colored-square pack
        rewardTrack.toggleAttribute('data-photo-pack', Math.abs(ratio - 1) > 0.05)
        brokenPacks.delete(pack)
    }
    probe.onerror = () => {
        // a pack with missing/corrupt images must not end up on the board:
        // mark it and fall back to another one
        brokenPacks.add(pack)
        const next = pickRewardPack(pack)
        if (next) loadRewardPack(next)
    }
    probe.src = `${pack}/image_1.png`
}

// random pack already on the first load
loadRewardPack(pickRewardPack(null))