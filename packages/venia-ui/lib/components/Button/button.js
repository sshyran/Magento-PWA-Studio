import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import { oneOf, shape, string, bool } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const getRootClassName = (priority, negative, size) =>
    `root_${priority}Priority${size ? `_${size}` : ''}${negative ? '_Negative' : ''}`;

/**
 * A component for buttons.
 *
 * @typedef Button
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single button.
 */
const Button = props => {
    const {
        children,
        classes: propClasses,
        priority,
        size,
        negative,
        disabled,
        onPress,
        ...restProps
    } = props;

    const buttonRef = useRef();

    const { buttonProps } = useButton(
        {
            isDisabled: disabled,
            onPress,
            ...restProps
        },
        buttonRef
    );

    const classes = useStyle(defaultClasses, propClasses);
    const rootClassName = classes[getRootClassName(priority, negative,size)];

    return (
        <button
            ref={buttonRef}
            className={rootClassName}
            {...buttonProps}
            {...restProps}
        >
            <span className={classes.content}>{children}</span>
        </button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.content classes for the button content
 * @property {string} classes.root classes for root container
 * @property {string} classes.root_highPriority classes for Button if
 * high priority.
 * @property {string} classes.root_lowPriority classes for Button if
 * low priority.
 * @property {string} classes.root_normalPriority classes for Button if
 * normal priority.
 * @property {string} priority the priority/importance of the Button
 * @property {string} type the type of the Button
 * @property {bool} negative whether the button should be displayed in red for a negative action
 * @property {bool} disabled is the button disabled
 */
Button.propTypes = {
    classes: shape({
        content: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string
    }),
    priority: oneOf(['marketing', 'primary', 'secondary', 'tertiary']).isRequired,
    size: oneOf(['large', 'medium', 'small']),
    type: oneOf(['button', 'reset', 'submit']).isRequired,
    negative: bool,
    disabled: bool
};

Button.defaultProps = {
    priority: 'secondary',
    size: 'medium',
    type: 'button',
    negative: false,
    disabled: false
};

export default Button;
