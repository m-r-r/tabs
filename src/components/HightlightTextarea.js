/* @flow */
import csjs from 'csjs-inject';
import React, { Component } from 'react';

const styles = csjs`
.wrapper {
  position: relative;
  z-index: 0;
  font-family: monospace;
  line-height: 1.1em;
  white-space: pre-wrap;
}

.textarea {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 2;
  font-family: inherit;
  line-height: inherit;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
}

.highlight {
  background-color: #8C5353,
}
`;

export type Highlight = { id: number, start: number, end: number };

type Props = {
    highlights: Highlight[],
    value: string,
  };

export default class HighlightTextarea extends Component {
  handleChange: Function;

  props: Props;

  state: {
    highlighted: ?number,
  };

  renderedHighlights: { [key: number]: Object };


  static defaultProps = {
    value: '',
    highlights: [],
  };

  constructor (props: Props, context: Object) {
    super(props, context);
    this.state = {
      highlighted: null,
    };
  }

  renderHighlight ({id, start, end}: Highlight) {
    const {value} = this.props;
    return (
      <span>
      {asBlank(value.slice(0, start))}
        <span className={this.state.highlighted === id ? styles.highlighted : null}>
        {asBlank(value.slice(start, end))}
        </span>
      </span>
    );
  }

  render () {
    const {value, highlights, ...props} = this.props;
    const backgrounds = highlights.map((highlight) => {
      if (this.renderedHighlights.hasOwnProperty(highlight.id)) {
        this.renderedHighlights[highlight.id] = this.renderHighlight(highlight);
      }
      return this.renderedHighlights[highlight.id];
    });
    return (
      <div className={styles.wrapper}>
        <textarea {...props} value={undefined} defaultValue={value} className={styles.textarea}
                  onChange={this.handleChange}/>
        {backgrounds}
      </div>
    );
  }

  componentWillReceiveProps () {
    this.renderedHighlights = {};
  }

  handleChange () {
    this.renderedHighlights = {};
  }

  setHighLighted (spanId: number | null) {
    if (spanId !== null) {
      delete this.renderedHighlights[spanId];
    }
    this.setState({highlighted: spanId});
  }
};

function asBlank (text: string): string {
  return text.replace(/[^\r\n\t\v]/, ' ');
}
