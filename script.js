/* Constantes */
const rows = 10;
const cols = 20;
const difficulties = {
  0: 'easy',
  1: 'medium',
  2: 'hard'
};
const treasuresByDifficulty = {
  0: 30,
  1: 20,
  2: 10
};

/* Classes */
const CounterGame = class {
  constructor() {
    this.containerGeneralCounter = $('#container-general-counter');
    this.generalCounter = 0;
    this.containerRightCounter = $('#container-right-counter');
    this.rightCounter = 0;
    this.containerWrongCounter = $('#container-wrong-counter');
    this.wrongCounter = 0;
  }

  resetAllCounters() {
    this.generalCounter = 0;
    this.rightCounter = 0;
    this.wrongCounter = 0;
    this.updateValues();
  }

  incrementGeneralCounter() {
    this.generalCounter++;
    this.updateValues();
  }
  incrementRightCounter() {
    this.rightCounter++;
    this.updateValues();
  }
  incrementWrongCounter() {
    this.wrongCounter++;
    this.updateValues();
  }

  updateValues() {
    $(this.containerGeneralCounter).text(this.generalCounter);
    $(this.containerRightCounter).text(this.rightCounter);
    $(this.containerWrongCounter).text(this.wrongCounter);
  }
};

const AlertGame = class {
  constructor() {
    this.alert = $('#container-alert');
  }

  setVisible(text, classList) {
    $(this.alert).removeClass();
    $(this.alert).addClass(classList);
    $(this.alert).text(text);
  }

  setInvisible() {
    $(this.alert).removeClass();
    $(this.alert).addClass('hidden');
    $(this.alert).text('');
  }
};

const SelectDifficultyGame = class {
  constructor() {
    this.select = $('#difficulty');
  }

  getDifficulty() {
    let value = $(this.select).val();

    if (difficulties[value] == undefined || difficulties[value] == null) {
      throw new Error('Selecione uma opção de dificuldade válida.');
    }

    let treasures = treasuresByDifficulty[value];

    if (treasures == undefined || treasures == null) {
      throw new Error('Número de tesouros inválido.');
    }

    return { value, treasures };
  }
};

const ButtonGame = class {
  constructor() {
    this.button = $('#play');
  }

  changeText(text) {
    $(this.button).text(text);
  }
};

const TreasureHunt = class {
  constructor() {
    this.rows = 10;
    this.cols = 20;
    this.started = false;
    this.selectedDifficulty = null;
    this.numberOfTreasures = null;

    this.treasures = new Array();

    this.board = $('#board');
    this.counters = new CounterGame();
    this.alert = new AlertGame();
    this.select = new SelectDifficultyGame();
    this.button = new ButtonGame();
  }

  resetGame() {
    this.started = false;
    this.selectedDifficulty = null;
    this.numberOfTreasures = null;
    this.counters.resetAllCounters();
    this.treasures = new Array();
    this.button.changeText('Jogar');
    $(this.board).empty();
  }

  generateTreasures() {
    this.treasures = generateDistinctRandomPositions(this.numberOfTreasures, this.rows, this.cols);
  }

  generatePositions() {
    if (typeof this.rows != 'number' && this.rows <= 0) {
      throw new Error('O número de linhas deve ser válido.');
    }

    if (typeof this.cols != 'number' && this.cols <= 0) {
      throw new Error('O número de colunas deve ser válido.');
    }

    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement('div');
      $(row).addClass('row');

      for (let j = 0; j < this.cols; j++) {
        const col = document.createElement('div');
        $(col).addClass('col');

        $(col).click((element) => {
          if (!this.started) {
            return;
          }

          let opened = $(element.target).data('opened');
          if (opened === false) {
            this.counters.incrementGeneralCounter();
            $(element.target).addClass('opened');
            $(element.target).data('opened', true);
        
            let isTreasure = $(element.target).data('treasure');
            if (isTreasure) {
              this.alert.setVisible('Você acertou!', 'alert alert-success');
              this.counters.incrementRightCounter();
              $(element.target).append('<i class="fa-solid fa-coins icon-outline"></i>');
            } else {
              this.alert.setVisible('Você errou!', 'alert alert-danger');
              this.counters.incrementWrongCounter();
            }
          } else {
            this.alert.setVisible('Esta posição já foi aberta!', 'alert alert-danger');
          }
        });

        const treasure = this.treasures.find(treasure => treasure.x == i && treasure.y == j) || null;
        if (treasure !== null) {
          $(col).data('treasure', true);
        }

        $(col).data('opened', false);

        if(i % 2 === 0) {
          if (j % 2 === 0) {
            $(col).addClass('white');
          } else {
            $(col).addClass('dark');
          }
        } else {
          if (j % 2 !== 0) {
            $(col).addClass('white');
          } else {
            $(col).addClass('dark');
          }
        }

        $(row).append(col);
      }

      $(this.board).append(row);
    }
  }

  startGame() {
    try {
      this.resetGame();
      this.selectedDifficulty = this.select.getDifficulty().value;
      this.numberOfTreasures = this.select.getDifficulty().treasures;
      this.generateTreasures();
      this.generatePositions();
      this.started = true;
      this.button.changeText('Reiniciar');
    } catch (error) {
      this.resetGame();
      this.alert.setVisible(error.message, 'alert alert-danger');
    }
  }
};

let game = new TreasureHunt();
$('#play').click(() => {
  game.alert.setInvisible();
  game.startGame();
});
