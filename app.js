
  const ExerciseKey = {
    HEARTS: 'push-up',
    DIAMONDS: 'sit-up',
    SPADES: 'squat',
    CLUBS: 'jumping jack'
  }

  function getReps(card) {
    let count = parseInt(card);
    switch (card) {
      case 'ACE':
        count = 1;
        break;
      case 'KING':
      case 'QUEEN':
      case 'JACK':
        count = 10;
        break;
    }
    return count;
  }

  var app = new Vue({
    el: '#app',
    data: {
      header: '&hearts; Card &clubs; Deck &diams; Workout &spades;',
      deck_id: 'new',
      cards: [],
      workout: {},
    },

    mounted() {
      this.freshDraw();
    },

    methods: {
      getExercise(suit) {
        return ExerciseKey[suit];
      },
      freshDraw() {
        axios.get("https://deckofcardsapi.com/api/deck/new/draw/?count=5")
          .then((response) => {
            this.cards = response.data.cards;
            this.deck_id = response.data.deck_id;
            this.countCards();
          })
          .catch((error) => {
            console.log(error);
          });
      },
      draw(){
        axios.get("https://deckofcardsapi.com/api/deck/" + this.deck_id + "/draw/?count=5")
          .then((response) => {
            this.cards = response.data.cards;
            this.countCards();
            if(response.data.remaining > 5){
              this.shuffle();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
      shuffle(){
        axios.get("https://deckofcardsapi.com/api/deck/" + this.deck_id + "/shuffle/")
          .catch((error) => {
            console.log(error);
          });
      },
      resetWorkout(){
        this.workout = {};
      },
      countCards() {
        this.resetWorkout();
        this.cards.forEach(function(c) {
          if(app.workout.hasOwnProperty(c.suit)){
            app.workout[c.suit] += getReps(c.value);
          }
          else{
            app.workout[c.suit] = getReps(c.value);
          }
        });
      },
      humanizeURL: function (url) {
        return url
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, '')
      }
    },
  });
