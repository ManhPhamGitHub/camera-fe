import classNames from 'classnames';
import './button.scss';
import { Link } from 'react-router-dom';

function Button({
  to,
  href,
  onClick,
  children,
  primary = false,
  outline = false,
  disable = false,
  rounded = false,
  small = false,
  large = false,
  className,
  leftIcon,
  rightIcon,
  ...passProps
}) {
  let Component = 'button';
  const props = {
    onClick,
    ...passProps
  };
  if (to) {
    props.to = to;
    Component = Link;
  } else if (href) {
    props.href = href;
    Component = 'a';
  }

  if (disable) {
    // Remove all event in button when disabled
    Object.keys(props).forEach(key => {
      if (key.startsWith('on') && typeof props[key] == 'function') delete props[key];
    });
  }

  const classes = classNames('button__default', { 
    [className]: className,
    button__default: primary,
    button__outline: outline,
    button__small: small,
    button__large: large,
    button__disabled: disable,
    button__rounded: rounded
  });

  return (
    <Component className={classes} {...props}>
      {leftIcon && <span className="button__icon">{leftIcon}</span>}
      <span className="button__text">{children}</span>
      {rightIcon && <span className="button__icon">{rightIcon}</span>}
    </Component>
  );
}

export default Button;
