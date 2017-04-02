import React, { Component } from 'react';
import csjs from 'csjs-inject';

const styles = csjs`
.form {
  display: flex;
  flex-flow: column;
}

.form textarea {
  min-height: 10em;
}

.buttons {
  display: flex;
  flex-flow: row wrap;
}`;

export default class Form extends Component {
  static defaultProps = {
    onSubmit: () => undefined,
  };
  
  constructor (props, context) {
    super(props, context);
    this.state = {
      savedValues: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    
  componentWillMount () {
    this.setState({savedValues: getSavedValues()});
  }
  
  render () {
    const {savedValues} = this.state;
    return (
      <form ref="form" className={styles.form}
            onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <textarea name="source" value={undefined} defaultValue={savedValues.source} required />
        <div className={styles.buttons}>
          <label>From: <SelectTuning name="inputTuning" value={undefined} defaultValue={savedValues.inputTuning} /></label>
          <label>To: <SelectTuning name="outputTuning" required defaultValue={savedValues.outputTuning} /></label>
          <input type="submit" />
        </div>
      </form>
    );
  }
  
  handleSubmit (event) {
    event.preventDefault();
    const values = this.getValues();
    if (typeof values.source === 'string' && values.outputValue !== null) {
      this.props.onSubmit(values);
    }
  }
  
  handleChange () {
    setSavedValues(this.getValues());
  }
  
  getValues (): Object {
    const source = this.refs.form.source.value;
    const inputTuning = this.refs.form.inputTuning.value || null;
    const outputTuning = this.refs.form.outputTuning.value || null;
    return {source, inputTuning, outputTuning};
  }
}

function SelectTuning ({value, ...props}) {
  return (
    <select {...props}>
      <option value="">{!props.required ? 'Automatic' : ''}</option>
      <optgroup label="Ukulele">
        <option value="ukuleleStd">Standard (G4-C4-E4-A4)</option>
        <option value="ukuleleLowG">Low G (G3–C4–E4–A4)</option>
      </optgroup>
      <optgroup label="Guitar">
        <option value="guitarStd">Standard (E2-A2-D3-G3-C3-E4)</option>
      </optgroup>
      <optgroup label="Bass guitar">
        <option value="bassStd">Standard (E1-A1-D2-G2)</option>
      </optgroup>
      <optgroup label="Mandolin">
        <option value="mandolinStd">Standard (G3-D4-A4-E5)</option>
      </optgroup>
    </select>
  );
}

const formKeys = ["source", "inputTuning", "outputTuning"];

function getSavedValues (): Object {
  const state = {};
  if (!window.localStorage) {
    return state;
  }
  formKeys.forEach((key) => {
    if (typeof window.localStorage[key] === 'string') {
      state[key] = window.localStorage[key];
    }
  });
  return state;
}

function setSavedValues (state: Object) {
  if (!window.localStorage) {
    return;
  }
  formKeys.forEach((key) => {
    if (typeof state[key] === 'string') {
      window.localStorage[key] = state[key];
    } else {
      delete window.localStorage[key];
    }
  });
}