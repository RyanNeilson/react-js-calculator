import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const isOperator = /[x/+‑]/,
      endsWithOperator = /[x+‑/]$/,
      clearStyle = {background: '#fc3', color: 'black'},
      operatorStyle = {background: '#888888', color: 'black'},
      equalsStyle = {
        background: '#ad1827',
        position: 'absolute',
        height: 130,
        bottom: 5
      };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currVal: '0',
      prevVal: '0',
      lastClick: '',
      currSign: 'positive',
      formula: ''
    }
    
    this.maxLength = this.maxLength.bind(this);
    this.evaluator = this.evaluator.bind(this);
    this.operators = this.operators.bind(this);
    this.allClear = this.allClear.bind(this);
    this.hasDecimal = this.hasDecimal.bind(this);
    this.handleNums = this.handleNums.bind(this);
    
    
  }
    
  evaluator() {
    if (!this.state.currVal.includes('Max Length Reached')) {
      let expression = this.state.formula;
      if (endsWithOperator.test(expression)) expression = expression.slice(0, -1);
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currVal: answer.toString(),
        formula: expression.replace(/\*/g, '⋅').replace(/-/g, '‑') + '=' + answer,
        prevVal: answer,
        evaluated: true
      });
    }
  }
  
   operators(e) { 
    if (!this.state.currVal.includes('Max Length Reached')) {
      this.setState({currVal: e.target.value, evaluated: false});
      if (this.state.formula.includes('=')) {
        this.setState({formula: this.state.prevVal + e.target.value}); 
      } else {
        this.setState({ 
          prevVal: !isOperator.test(this.state.currVal) ? 
            this.state.formula : 
            this.state.prevVal,
          formula: !isOperator.test(this.state.currVal) ? 
            this.state.formula += e.target.value : 
            this.state.prevVal += e.target.value
        });
      }
    }
  }
  
    handleNums(e) {
    if (!this.state.currVal.includes('Limit')) {
      this.setState({evaluated: false})
      if (this.state.currVal.length > 17) {
        this.maxLength();
      } else if (this.state.evaluated === true) {
        this.setState({
          currVal: e.target.value,
          formula: e.target.value != '0' ? e.target.value : '',
        });
      } else {
        this.setState({
          currVal: 
            this.state.currVal == '0' || 
            isOperator.test(this.state.currVal) ? 
            e.target.value : this.state.currVal + e.target.value,
          formula:  
            this.state.currVal == '0' && e.target.value == '0' ?
            this.state.formula : 
            /([^.0-9]0)$/.test(this.state.formula) ? 
            this.state.formula.slice(0, -1) + e.target.value :
            this.state.formula + e.target.value,
        });
      }
    }
  }
  
  hasDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currVal: '0',
        formula: '0',
        evaluated: false});
    } else if (!this.state.currVal.includes('.') &&
      !this.state.currVal.includes('Limit')) {
      this.setState({evaluated: false})
      if (this.state.currVal.length > 17) {
        this.maxLength();
      } else if (endsWithOperator.test(this.state.formula) || 
        this.state.currVal == '0' && this.state.formula === '') {
        this.setState({
          currVal: '0',
          formula: this.state.formula + '0'
        });         
      } else {
        this.setState({
          currVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + '.',
          formula: this.state.formula + '.',
        });
      }
    }
  }
  
  maxLength() {
    this.setState({
      currVal: "Max Length Reached",
      prevVal: this.state.currVal
    });
    setTimeout(() => this.setState({currVal: this.state.prevVal}), 1500);
  }
  
  allClear() {
    this.setState({
      currVal: '0',
      prevVal: '0',
      lastClick: '',
      currSign: 'positive',
      formula: ''
    });
  }
  
  render() {
    return (
      <div>
        <div className='calculator'>
          <Output currentVal={this.state.currVal} />
          <Buttons evaluate={this.evaluator}
                   operators={this.operators}
                   allClear={this.allClear} 
                   decimal={this.hasDecimal}
                   numbers={this.handleNums} />
        </div>
      </div>
    );
  }
}


class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button id="clear"    value='AC' onClick={this.props.allClear} className='jumbo' style={clearStyle}>AC</button>
        <button id="divide"   value='/'  onClick={this.props.operators} style={operatorStyle}>/</button>
        <button id="multiply" value='x'  onClick={this.props.operators} style={operatorStyle}>x</button>
        <button id="seven"    value='7'  onClick={this.props.numbers} >7</button>
        <button id="eight"    value='8'  onClick={this.props.numbers} >8</button>
        <button id="nine"     value='9'  onClick={this.props.numbers} >9</button>
        <button id="subtract" value='‑'  onClick={this.props.operators} style={operatorStyle}>-</button>
        <button id="four"     value='4'  onClick={this.props.numbers} >4</button>
        <button id="five"     value='5'  onClick={this.props.numbers} >5</button>
        <button id="six"      value='6'  onClick={this.props.numbers} >6</button>
        <button id="add"      value='+'  onClick={this.props.operators} style={operatorStyle}>+</button>
        <button id="one"      value='1'  onClick={this.props.numbers} >1</button>
        <button id="two"      value='2'  onClick={this.props.numbers} >2</button>
        <button id="three"    value='3'  onClick={this.props.numbers} >3</button>
        <button id="zero"     value='0'  onClick={this.props.numbers} className='jumbo'>0</button>
        <button id="decimal"  value='.'  onClick={this.props.decimal} >.</button>
        <button id="equals"   value='='  onClick={this.props.evaluate} style={equalsStyle}>=</button>
      </div>
    );
  }
}

class Output extends React.Component {
  render () {
    return <div id="display" className="outputScreen">{this.props.currentVal}</div>
  }
}; 



export default App;
