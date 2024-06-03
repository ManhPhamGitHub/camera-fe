import './custom-input.scss';
import { Input } from 'antd';
import { forwardRef } from 'react';
import classNames from 'classnames';

const CustomInput = (
  {
    type = 'text', // password || search
    customClass,
    defaultValue,
    ...props
  },
  ref
) => {
  return (
    <div
      className={classNames('custom__input-container', 'input__search', {
        [customClass]: customClass
      })}
    >
      {type === 'password' ? (
        <Input.Password ref={ref} {...props} />
      ) : type === 'search' ? (
        <Input.Search ref={ref} {...props} />
      ) : (
        <Input ref={ref} defaultValue={defaultValue} {...props} />
      )}
    </div>
  );
};

export default forwardRef(CustomInput);
