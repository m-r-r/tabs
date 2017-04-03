/* @flow */
import React, { Component } from 'react';

import Form from '../components/Form';

import { changeTuning, DEFAULT_TUNINGS, fromString, toString } from '../core';
import type { ReaderError, Tabulature } from '../core/types';

export default class App extends Component {
  handleFormSubmit: Function;

  state: {
    source: string,
    output: ?Tabulature,
    errors: ReaderError,
  };

  constructor (props: Object, context: Object) {
    super(props, context);
    this.state = {
      source: '',
      output: null,
      errors: [],
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render () {
    const {output} = this.state;
    return (
      <div>
        <Form onSubmit={this.handleFormSubmit} />
        { output !== null && <pre>{output}</pre>}
      </div>
    );
  }

  handleFormSubmit ({source, inputTuning, outputTuning}: Object) {
    inputTuning = inputTuning ? DEFAULT_TUNINGS[inputTuning] : null;
    console.debug(outputTuning);
    outputTuning = DEFAULT_TUNINGS[outputTuning];
    const {tabulature, errors} = fromString(source, inputTuning);
    let converted = changeTuning(tabulature, outputTuning);
    this.setState({
      output: toString(converted),
      source,
      errors,
    });
  }
};
