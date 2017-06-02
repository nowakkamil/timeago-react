import React from 'react';
import PropTypes from 'prop-types';
import timeago from 'timeago.js';

export default class TimeAgo extends React.Component {
  constructor(props) {
    super(props)
    this.timeagoInstance = null;
  }
  // first add
  componentDidMount() {
    const { locale } = this.props
    if (locale !== 'en' && locale !== 'zh_CN')
      timeago.register(locale, require('timeago.js/locales/' + locale));

    this.renderTimeAgo();
  }
  // init instance
  componentWillMount() {
    if (this.timeagoInstance === null)
      this.timeagoInstance = timeago();
  }
  // update
  componentDidUpdate() {
    this.renderTimeAgo();
  }
  renderTimeAgo() {
    const { live, datetime, locale } = this.props;
    // cancel all the interval
    // timeago.cancel();
    // if is live
    if (this.live !== false) {
      // live render
      if (datetime instanceof Date) {
        this.timeagoDom.setAttribute('datetime', datetime.getTime());
      } else {
        this.timeagoDom.setAttribute('datetime', datetime);
      }
      this.timeagoInstance.render(this.timeagoDom, locale);
    }
  }
  // remove
  componentWillUnmount() {
    timeago.cancel();
    this.timeagoInstance = null;
  }
  // for render
  render() {
    const { datetime, live, locale, className, style, ...others } = this.props;
    return (
      <time
        ref={(c) => { this.timeagoDom = c }}
        className={className || ''}
        style={style}
        {...others}>
          {this.timeagoInstance.format(datetime, locale)}
      </time>
    );
  }
};

TimeAgo.propTypes = {
  datetime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.number
  ]).isRequired,  // date to be formated
  live: PropTypes.bool,        // real time render.
  locale: PropTypes.string,    // locale lang
  className: PropTypes.string, // class name
  style: PropTypes.object      // style object
};

TimeAgo.defaultProps = {
  live: true,
  locale: 'en'
};