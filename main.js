import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import s from './index.css'

function Square(props) {
  return(
    <button className={s.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className={s.boardRow}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className={s.boardRow}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className={s.boardRow}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    const { xIsNext } = this.props;
    const history = this.props.history.slice(0, this.props.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'x' : 'o';
    store.dispatch({
      type: 'CHECK',
      history: history,
      squares: squares
    });
  }

  jumpTo(step) {
    store.dispatch({
      type: 'JUMP_TO',
      step: step,
    });
  }

  render() {
    const history = this.props.history;
    const current = history[this.props.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'x' : 'o');
    }

    return (
      <div className={s.game}>
        <div className={s.gameBoard}>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className={s.gameInfo}>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const initialState  = {
  history: [{
    squares: Array(9).fill(null)
  }],
  stepNumber: 0,
  xIsNext: true,
};
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'JUMP_TO':
      return Object.assign({}, state, {
        stepNumber: action.step,
        xIsNext: (action.step % 2) === 0,
      });
    case 'CHECK':
      return Object.assign({}, state, {
        history: action.history.concat([{
          squares: action.squares
        }]),
        stepNumber: action.history.length,
        xIsNext: !state.xIsNext,
      })
    default:
      return state;
  }
}

const store = createStore(reducer);

const mapStateToProps = state => ({
  history: state.history,
  stepNumber: state.stepNumber,
  xIsNext: state.xIsNext,
});

const GameConnected = connect(mapStateToProps)(Game)
ReactDOM.render(
  <Provider store={store}>
    <GameConnected />
  </Provider>,
  document.getElementById('root')
);
