import { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE: "delete",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  CLEAR: "clear",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite:false
        }
      }
      if (state.currentValue === "0" && payload.digit === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentValue.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentValue: `${state.currentValue || ""}${payload.digit}`,
      };

    case ACTIONS.DELETE:
      return {};
    case ACTIONS.CLEAR:
      if(state.overwrite) {
        return {
          ...state,
          currentValue: null,
          overwrite:false
        }
      }
      if (state.currentValue.length === 1) {
        return { ...state, currentValue: null };
      }
      if (state.currentValue.null) {
        return state;
      }

      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentValue == null && state.previousValue == null) {
        return state;
      }
      if (state.previousValue == null) {
        return {
          ...state,
          previousValue: state.currentValue,
          operation: payload.operation,
          currentValue: null,
        };
      }

      if(state.currentValue === null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      return {
        ...state,
        previousValue: evaluate(state),
        currentValue: null,
        operation: payload.operation,
      }
    case ACTIONS.EVALUATE:
      if(state.currentValue == null || state.previousValue == null || state.operation == null) {
        return state
      }
      return {
        ...state,
        previousValue: null,
        currentValue: evaluate(state),
        operation:null,
        overwrite: true
      }
  }
}

function evaluate({previousValue, currentValue, operation}) {
  const pre = parseFloat(previousValue);
  const curr = parseFloat(currentValue);

  if (isNaN(pre) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
        computation = pre + curr;
        break
    case "-":
      computation = pre + curr;
      break
    case "÷":
      computation = pre / curr;
      break
    case "*":
      computation = pre * curr;
      break
  }
  return computation.toString();
}


const INT_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function format(operand) {
  if(operand == null) return
  const [int, dec] = operand.split(".");
  if(dec == null) {
    return INT_FORMATTER.format(int);
  }
  return `${INT_FORMATTER.format(int)}.${dec}`
}
function App() {
  const [{ previousValue, currentValue, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="App-grid">
      <div className="output">
        <div className="previous">
          {format(previousValue)} {operation}
        </div>
        <div className="current">{format(currentValue)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.DELETE })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>DEL</button>

      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
