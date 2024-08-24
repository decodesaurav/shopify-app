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
	const isEmpty = value.trim() === '';

	if(isEmpty){
    	setTitleError(isEmpty ? `This field cannot be empty.` : '');
  	} else {
    	setTitleError(isValid ? '' : `Please use only letters, numbers, and spaces for the ${value}`);
	}
  }, []);
  const validatePrefix = useCallback((value, setTitleError) => {

    const regex = /^[a-zA-Z0-9\s]*$/;
    const isValid = regex.test(value);

    setTitleError(isValid ? '' : `Please use only letters, numbers, and spaces for the ${value}`);
  }, []);

  const validateError = useCallback((value) => {

    const regex = /^[a-zA-Z0-9\s]*$/;
    const isValid = regex.test(value);
	const isEmpty = value.trim() === '';

	if(isEmpty || !isValid){
    	return true;
  	} else {
		return false;
	}
  }, []);

  return {
    title,
    titleError,
    handleTextChange,
    validateTitle,
	validateError,
	validatePrefix
  };
};

export default useValidation;
