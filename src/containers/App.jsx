/* @flow */
import React, { Component } from 'react';

import Form from '../components/Form';

import { changeTuning, DEFAULT_TUNINGS, fromString, toString } from '../core';
import type { Tabulature } from '../core/types';

export default class App extends Component {
  _handleFormSubmit: Function;

  state: {
    source: string,
    output?: Tabulature,
  };

  constructor (props: Object, context: Object) {
    super(props, context);
    this.state = {
      source: '',
    };
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  render () {
    const {output} = this.state;
    return (
      <div>
        <Form onSubmit={this._handleFormSubmit}/>
        { output !== null && <pre>{output}</pre>}
      </div>
    );
  }

  _handleFormSubmit ({source, from, to}: HTMLFormElement & Object) {
    let inputTuning = from ? DEFAULT_TUNINGS[from] : null;
    let outputTuning = DEFAULT_TUNINGS[to];
    let tabulature = fromString(source, inputTuning);
    let converted = changeTuning(tabulature, outputTuning);
    this.setState({
      output: toString(converted),
    });
  }
};
