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
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  render () {
    return (
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <textarea name="source" value={undefined} required />
        <div className={styles.buttons}>
          <label>From: <SelectTuning name="from" /></label>
          <label>To: <SelectTuning name="to" required /></label>
          <input type="submit" />
        </div>
      </form>
    );
  }
  
  handleSubmit (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const source = form.source.value;
    const from = form.from.value || null;
    const to = form.to.value || null;
    if (typeof source === 'string' && to !== null) {
      this.props.onSubmit({source, from, to});
    }
  }
}

function SelectTuning ({value, ...props}) {
  return (
    <select {...props}>
      <option>{!props.required ? 'Automatic' : ''}</option>
      <option value="ukulele">Ukulele</option>
      <option value="guitar">Guitar</option>
      <option value="bass">Bass</option>
    </select>
  );
}
