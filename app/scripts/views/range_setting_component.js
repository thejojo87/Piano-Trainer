import React, { Component } from "react";
import PropTypes from "prop-types";
import RangeSlider from "react-range-slider-bem";
import SettingLine from "./setting_line";
import _ from "lodash";

const multiplier = 10;

export default class RangeSettingComponent extends Component {
  static defaultProps = {
    valueToString: _.identity,
    label: ""
  };

  static propTypes = {
    rangeMin: PropTypes.number.isRequired,
    rangeMax: PropTypes.number.isRequired,
    values: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    valueToString: PropTypes.func,
    disabled: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      values: this.valuesFromProps(this.props)
    };
  }

  valuesFromProps(props) {
    let values = _.isArray(props.values) ? props.values : [props.values];
    return values.map(el => el * multiplier);
  }

  componentWillReceiveProps(newProps) {
    this.setState = {
      values: this.valuesFromProps(newProps)
    };
  }

  onChange(event, index, values) {
    this.setState({
      values: values.map(el => el.value)
    });
  }

  onAfterChange() {
    if (this.props.disabled) {
      return;
    }
    let newValues = this.state.values.map(this.quantitizeValue).map(el => el / multiplier);
    this.props.onChange(newValues.length === 1 ? newValues[0] : newValues);
  }

  quantitizeValue(value) {
    return Math.round(value / multiplier) * multiplier;
  }

  render() {
    const upscaledRangeMin = this.props.rangeMin * multiplier;
    const upscaledRangeMax = this.props.rangeMax * multiplier;

    let renderedRangeValues = this.state.values;
    let quantitizedValues = this.state.values.map(this.quantitizeValue);

    const downScaledValues = quantitizedValues.map(el => Math.round(el / multiplier));
    const rangeContainerStyle = {
      marginBottom: -2
    };

    const valueLabel = this.props.label + ": " + downScaledValues.map(this.props.valueToString).join(" - ");

    return (
      <SettingLine label={valueLabel}>
        <div style={rangeContainerStyle}>
          <RangeSlider
            cursor
            value={renderedRangeValues}
            min={upscaledRangeMin}
            max={upscaledRangeMax}
            onChange={this.onChange.bind(this)}
            onAfterChange={this.onAfterChange.bind(this)}
            disabled={this.props.disabled}
          />
        </div>
      </SettingLine>
    );
  }
}
