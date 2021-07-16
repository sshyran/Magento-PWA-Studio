import React, { useRef } from 'react';
import { arrayOf, bool, instanceOf, shape, string } from 'prop-types';

import { useFormError } from '@magento/peregrine/lib/talons/FormError/useFormError';
import { useScrollIntoView } from '@magento/peregrine/lib/hooks/useScrollIntoView';

import { useStyle } from '../../classify';
import ErrorMessage from '../ErrorMessage';
import defaultClasses from './formError.css';

const FormError = props => {
    const { classes: propClasses, errors, scrollOnError } = props;

    const { formatMessage } = useIntl();

    var graphQLErrorMessage;
    for (const error of errors) {
        if (error) {
            const { graphQLErrors } = error;
            if (graphQLErrors) {
                graphQLErrorMessage = formatMessage({
                    id: 'formError.errorMessage',
                    defaultMessage: 'An error has occurred. Please check the input and try again.'
                })
            }
            
        }
    }

    const talonProps = useFormError({ errors });
    const { errorMessage } = talonProps;

    const errorRef = useRef(null);

    useScrollIntoView(errorRef, scrollOnError && errorMessage);

    const classes = useStyle(defaultClasses, propClasses);

    return errorMessage || graphQLErrorMessage ? (
        <ErrorMessage classes={classes} ref={errorRef}>
            {graphQLErrorMessage ? graphQLErrorMessage : errorMessage}
        </ErrorMessage>
    ) : null;
};

export default FormError;

FormError.propTypes = {
    classes: shape({
        root: string,
        errorMessage: string
    }),
    errors: arrayOf(instanceOf(Error)),
    scrollOnError: bool
};

FormError.defaultProps = {
    scrollOnError: true
};
