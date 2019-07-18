import React, {
  useRef, useCallback, useContext, useEffect,
} from 'react'
import PropTypes from 'prop-types'
import Typography from '../../Typography'
import { validator, getFieldError } from './helpers'
import formContext from '../context'
import {
  InputContainer, InputLabel, InputField, InputError,
} from './styles'

const Input = ({
  validation, field, label,
  className, onChange, ...props
}) => {
  const ref = useRef(null)
  const { fields, updateFields } = useContext(formContext)

  useEffect(() => {
    if (!ref.current.checkValidity()) {
      const { value } = ref.current
      updateFields({ key: field, value, error: null })
    }
  }, [ref, field, updateFields])

  const handleChange = useCallback(() => {
    ref.current = validator(validation, ref.current)
    const { validationMessage, value } = ref.current
    updateFields({ key: field, value, error: validationMessage })
    onChange(value)
  }, [validation, ref, field, updateFields, onChange])

  return (
    <InputContainer>
      {label && (
        <InputLabel htmlFor={field} className={className}>
          <Typography.Span>{label}</Typography.Span>
          {props.required ? ' *' : ''}
        </InputLabel>
      )}
      <InputField
        ref={ref}
        name={field}
        id={field}
        onChange={handleChange}
        {...props}
      />
      <InputError>
        <Typography.Span>{getFieldError(fields, field)}</Typography.Span>
      </InputError>
    </InputContainer>
  )
}

Input.propTypes = {
  required: PropTypes.bool,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  validation: PropTypes.func,
  onChange: PropTypes.func,
}

Input.defaultProps = {
  onChange: () => {},
  validation: () => '',
  required: false,
  label: null,
  className: null,
}

export default Input