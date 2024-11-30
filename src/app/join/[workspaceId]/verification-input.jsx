"use client"

import React, { useState, useRef, useEffect } from 'react';

const VerificationInput = ({
  length = 6,
  value = '',
  onChange = () => {},
  onComplete,
  autoFocus = true,
  classNames = {}
}) => {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length);
      setValues(valueArray.concat(Array(length - valueArray.length).fill('')));
    }
  }, [value, length]);

  const handleChange = (index, event) => {
    const newValue = event.target.value;
    if (newValue.length > 1) return; // Prevent multiple characters

    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onChange(newValues.join(''));

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if complete
    if (newValues.every(v => v) && newValues.length === length) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index, event) => {
    // Move to previous input on backspace if current input is empty
    if (event.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text/plain').slice(0, length);
    const newValues = [...values];
    
    for (let i = 0; i < pasteData.length; i++) {
      if (i < length) {
        newValues[i] = pasteData[i];
      }
    }
    
    setValues(newValues);
    onChange(newValues.join(''));
    
    if (newValues.every(v => v) && newValues.length === length) {
      onComplete(newValues.join(''));
    }
  };

  return (
    <div className={`flex gap-2 ${classNames.container || ''}`}>
      {values.map((digit, idx) => (
        <input
          key={idx}
          ref={el => inputRefs.current[idx] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 text-center text-xl font-medium 
            rounded-md border border-gray-300
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            outline-none transition-all
            ${classNames.character || ''}
            ${digit ? classNames.characterFilled || '' : classNames.characterInactive || ''}
          `}
        />
      ))}
    </div>
  );
};

export default VerificationInput;