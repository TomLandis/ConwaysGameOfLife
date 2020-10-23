/*
Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
let row = [];
let gridArray = [];

let counter = 0;

for (let i = 0; i < 1500; i++) {
  row.push(i);
}

for (let i = 0; i < row.length; i++) {
  let rand = Math.random();
  if (rand > 0.8) {
    gridArray.push({ place: i, alive: "alive", next: "" });
  } else {
    gridArray.push({ place: i, alive: "dead", next: "" });
  }
}
//console.log(ob)
//console.log(gridArray[19].place);
//this helper function will test if a cell is alive or not
const isLiving = (me, arr) => {
  if (arr[me].alive === "alive") {
    return true;
  } else {
    return false;
  }
};

//NearBy function identifies the neighbors of a given cell so that thoes cells can be checked for life and status of life for next time can be confirmed.
const NearBy = me => {
  let list = [];
  let finalList = [];
  let listo = [];
  list.push(me + 1);
  list.push(me - 1);
  list.push(me + 51);
  list.push(me + 49);
  list.push(me + 50);
  list.push(me - 51);
  list.push(me - 49);
  list.push(me - 50);

  //this accounts for negitive numbers
  list.map(num => num > 0 ? finalList.push(num) : finalList.push(num + 1500));
  // this handles numbers larger than 1500
  finalList.map(num => num < 1500 ? listo.push(num) : listo.push(num - 1500));
  return listo;
};

const livingNow = (me, arr) => {
  let ln = 0;
  let dn = 0;
  let nei = NearBy(me, arr);
  for (let i = 0; i < nei.length; i++) {
    if (isLiving(nei[i], arr)) {
      ln++;
    } else {
      dn++;
    }
  }
  if (ln < 2 || ln > 3) {
    gridArray[me].next = "dead";
  } else {
    gridArray[me].next = "alive";
  }
};
const deadNow = (me, arr) => {
  let ln = 0;

  let nei = NearBy(me, arr);
  for (let i = 0; i < nei.length; i++) {
    if (isLiving(nei[i], arr)) {
      ln++;
    }
  }
  if (ln === 3) {
    gridArray[me].next = "alive";
  } else {
    gridArray[me].next = "dead";
  }
};
class StopButton extends React.Component {
  render() {
    return React.createElement("button", { onClick: this.props.stop }, "Stop");
  }}

class StartButton extends React.Component {
  render() {
    return React.createElement("button", { onClick: this.props.start }, "Start");
  }}


class Clear extends React.Component {
  render() {
    return (
      React.createElement("button", { id: "clear", onClick: this.props.clear }, "Clear"));



  }}

class Cell extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      React.createElement("div", {
        ref: this.props.ref,
        className: this.props.alive,
        onClick: this.props.changeIt }, "o",

      " "));


  }}

const Credit = () => React.createElement("h3", null, "Made by Tom Landis - 2017");

class Grid extends React.Component {
  constructor(props) {
    super();
    this.state = { board: gridArray, gen: 1, stop: false };
    this.tick = this.tick.bind(this);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.clear = this.clear.bind(this);
    this.changeIt = this.changeIt.bind(this);
  }
  start() {
    if (this.state.stop) {
      this.setState({ stop: false });
    }
  }
  stop() {
    if (!this.state.stop) {
      this.setState({ stop: true });
    }
  }
  clear() {
    for (let i = 0; i < gridArray.length; i++) {
      gridArray[i].alive = "dead";
    }
    this.setState({ board: gridArray, gen: 0 });
  }
  changeIt(x) {
    let board = this.state.board;

    if (this.state.stop) {
      if (board[x].alive === "dead") {
        board[x].alive = "alive";
      } else {
        board[x].alive = "dead";
      }

      this.setState({ board: board });
    }
  }

  tick() {
    let timed = () => {
      if (this.state.stop) {
      } else {
        let field = this.state.board;
        gridArray = this.state.board;
        for (let i = 0; i < field.length; i++) {
          if (isLiving(i, field)) {
            livingNow(i, field);
          } else {
            deadNow(i, field);
          }
        }
        for (let i = 0; i < gridArray.length; i++) {
          gridArray[i].alive = gridArray[i].next;
        }
        let gen = this.state.gen + 1;
        this.setState({ board: gridArray, gen: gen });
      }
    };
    clearTimeout(timed);
    setTimeout(timed, 25);
  }

  render() {
    let info = this.state.board;

    this.tick();
    return (
      React.createElement("div", null,
      React.createElement(StopButton, { stop: this.stop }),
      React.createElement(StartButton, { start: this.start }),
      React.createElement(Clear, { clear: this.clear }),
      React.createElement("h5", null, " Generation: ", this.state.gen, " "),
      React.createElement("div", { className: "outerBox" },
      info.map((data) =>
      React.createElement(Cell, {
        ref: data.place,
        alive: data.alive,
        changeIt: () => this.changeIt(data.place) }))),


      " "));


  }}


class App extends React.Component {
  render() {
    return (
      React.createElement("div", null,
      React.createElement("a", {
        href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
        target: "_blank" },

      React.createElement("h3", { id: "title" }, "The Game of Life")),

      React.createElement(Grid, null),
      React.createElement(Credit, null)));


  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("App"));