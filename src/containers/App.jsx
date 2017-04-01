import React, { Component } from 'react';

import { DEFAULT_TUNINGS, fromString, toString, changeTuning } from '../core';

import Form from '../components/Form';

export default class App extends Component {
  
  constructor (props, context) {
    super(props, context);
    this.state = {
      source: '',
    },
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }
  
  render () {
    const {inputText} = this.state;
    return (
      <div>
        <Form onSubmit={this._handleFormSubmit} />
      </div>
    );
  }
  
  _handleFormSubmit ({source, from, to}) {
    let inputTuning = from ? DEFAULT_TUNINGS[from] : null;
    let outputTuning = DEFAULT_TUNINGS[to];
    let tabulature = fromString(source, from);
    let converted = changeTuning(tabulature, outputTuning);
    this.setState({
      output: toString(converted),
    });
  }
}