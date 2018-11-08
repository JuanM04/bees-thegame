const anime = require(__dirname + '/assets/js/anime.min.js')
const DB = shuffle(require(__dirname + '/assets/api.json'))

// #============#
// # ANIMATIONS #
// #============#

// VARS
const playBtn = document.getElementById('play')
const gameSection = document.getElementById('game')
const answersEl = document.getElementById('answers')
const questionH3 = document.getElementsByTagName('h3')[0]
const answerDivs = document.getElementsByClassName('answer')
let counterIs = document.getElementsByClassName('round')

anime.easings['playBtn'] = (t) => (Math.pow(Math.sin(t * 3), 3))

let state = {
  started: false,
  choosen: false,
  n: 0,
  max: counterIs.length,
  counter: 0,
  current: {},
  gameX: r(1200)
}










// OPENING
function opening() {
  for (let div of answerDivs) {
    div.addEventListener('mouseover', () => {mouseIn(div)})
    div.addEventListener('mouseout', () => {mouseOut(div)})
    div.addEventListener('click', () => {click(div)})
  }
  document.addEventListener('mouseup', (ev) => {if(ev.button == 2) alert('Creado por JuanM04')})
  anime.timeline()
    .add({
      targets: 'h1',
      translateY: [
        {value: r(-1000), duration: 0},
        {value: 0, duration: 2000, delay: 1000}
      ]
    })
    .add({
      targets: 'h2',
      opacity: 1,
      duration: 2000,
      easing: 'linear'
    })
    .add({
      targets: '#play',
      opacity: {
        value: 1,
        duration: 500,
        easing: 'linear'
      },
      scale: {
        value: 1.25,
        delay: 500,
        duration: 1000,
        easing: 'playBtn'
      }
    })
}










// PLAY BUTTON
playBtn.addEventListener('mouseover', () => {
  anime({
    targets: '#play',
    scale: 1.25,
    duration: 500
  })
})

playBtn.addEventListener('mouseout', () => {
  anime({
    targets: '#play',
    scale: 1,
    duration: 500
  })
})

playBtn.addEventListener('click', () => {
  if (state.started) return
  state.started = true
  anime({
      targets: '#play',
      opacity: 0,
      duration: 500,
      easing: 'linear'
    }).finished.then(() => {
      playBtn.style.visibility = 'hidden'
      anime({
        targets: 'h1',
        translateY: r(-250),
        scale: 0.5,
        duration: 3000,
        begin: () => {
          anime({
            targets: 'h2',
            translateY: r(-350),
            scale: 0.5,
            duration: 3000
          })
        },
        complete: () => {
          gameSection.style.visibility = 'visible'
        }
      }).finished.then(() => startGame(true))
    })
})










// GAME
function startGame(first) {
  let translateY = first ? -state.gameX : [{value: state.gameX, easing: 'easeInExpo'}, {value: -state.gameX, delay: 1000}]
  anime({
    targets: '#game',
    translateY,
    duration: 2000,
    begin: () => {
      setTimeout(() => {
        state = {
          ...state,
          choosen: false,
          current: DB[state.n]
        }

        let temp = state.current.a[state.current.t]
        state.current.a = shuffle(state.current.a)
        state.current.t = state.current.a.indexOf(temp)

        anime({
          targets: '.answer',
          background: '#212121',
          duration: 0
        })

        for (let i = 0; i < answerDivs.length; i++) {
          answerDivs[i].innerHTML = `<p>${state.current.a[i]}</p>`
        }

        questionH3.innerHTML = state.current.q
      }, first ? 0 : 1000)
    }
  })
}











// SET DIVS
function mouseIn(div) {
  if(state.choosen) return
  anime({
    targets: div,
    background: '#ffa000',
    scale: 1.15,
    zIndex: {
      value: 5,
      duration: 0
    },
    duration: 500
  })
}



function mouseOut(div) {
  if(state.choosen) return
  anime({
    targets: div,
    background: '#212121',
    scale: 1,
    zIndex: {
      value: 1,
      duration: 0
    },
    duration: 500
  })
}



function click(div) {
  if(state.choosen) return
  mouseOut(div)
  state.choosen = true

  if (div.id.split('')[1] == state.current.t) {
    anime({
      targets: div,
      background: '#4caf50',
      duration: 500
    })
    state.counter++
  } else {
    anime({
      targets: div,
      background: '#f44336',
      duration: 500
    })
    anime({
      targets: answerDivs[state.current.t],
      background: '#4caf50',
      duration: 500
    })
  }

  anime({
    targets: counterIs[state.n],
    color: [
      {value: '#212121', duration: 0},
      {value: '#fafafa', duration: 1000}
    ],
    run: () => {
      counterIs[state.n].classList.add(div.id.split('')[1] == state.current.t ? 'fa-check' : 'fa-times')
    }
  })

  setTimeout(() => {
    state.n++
    if (state.n < state.max) {
      startGame()
    } else {
      finishGame()
    }
  }, 3000)
}





// FINISH GAME
function finishGame() {
  anime.timeline()
    .add({
      targets: '#game',
      translateY: state.gameX,
      easing: 'easeInExpo',
      duration: 2000,
      complete: () => {
        if (state.counter == state.max) {
          questionH3.innerHTML = "¡Felicitaciones, sos un EXPERTO de las ABEJAS!<br><br><br>Ganaste un FRASCO de MIEL"
        } else {
          questionH3.innerHTML = "Por desgracia, no ganaste nada, pero espero que hayas aprendido algo c:"
        }

        answersEl.style.visibility = 'hidden'
        answersEl.style.zIndex = -1
      }
    })
    .add({
      targets: '#game',
      translateY: -state.gameX,
      duration: 2000
    })
    .add({
      targets: '#play',
      opacity: [
        {value: 0, duration: 0},
        {value: 1, duration: 500, easing: 'linear'}
      ],
      scale: {
        value: 1.25,
        delay: 500,
        duration: 1000,
        easing: 'playBtn'
      },
      begin: () => {
        playBtn.innerHTML = "REINICIAR <i class='fas fa-undo'></i>"
        playBtn.style.visibility = 'visible'
        playBtn.addEventListener('click', () => {
          location.reload()
        })
      }
    })
}















// OwO
opening()

function r(n) {
  return window.innerWidth * n / 2560
}

function shuffle(arr) {
	let i = arr.length
  let temp, randomI
	while (0 !== i) {
		randomI = Math.floor(Math.random() * i)
		i -= 1
		temp = arr[i]
		arr[i] = arr[randomI]
		arr[randomI] = temp
	}
	return arr
}
