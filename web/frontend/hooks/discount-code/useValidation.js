import { useState, useCallback } from 'react';

const useValidation = () => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleTextChange = useCallback((value) => {
    setTitle(value);
  }, []);

  const validateTitle = useCallback((value, setTitleError) => {

    const regex = /^[a-zA-Z0-9\s]*$/;
    const isValid = regex.test(value);

    setTitleError(isValid ? '' : `Please use only letters, numbers, and spaces for the ${value}`);
  }, []);

  return {
    title,
    titleError,
    handleTextChange,
    validateTitle,
  };
};

export default useValidation;
