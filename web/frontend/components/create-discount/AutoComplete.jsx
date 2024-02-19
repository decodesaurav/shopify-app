import { Autocomplete, Icon } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { useState, useCallback, useEffect } from 'react';
import { useApiCall } from '../../hooks/apiUtils';

export function SelectDiscount({ onSelectionChange, labelValue }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [options, setOptions] = useState([]);

  const makeApiCall = useApiCall();

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(selectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = selectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [selectedOptions],
  );

  const updateSelection = useCallback(
    (selected) => {
		const selectedValue = selected.map((selectedItem) => {
			const matchedOption = options.find((option) =>
			  option.value === selectedItem
			);
			return matchedOption ? matchedOption.label : null;
		});
		const selectedId = selected.map((selectedItem) => {
			const matchedOption = options.find((option) =>
			  option.value === selectedItem
			);
			return matchedOption ? matchedOption.value : null;
		});
      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || '');
	  if (onSelectionChange) {
		console.log(selectedValue);
		onSelectionChange(selectedValue);
	  }
	  if(labelValue){
		labelValue(selectedId);
	  }
	},
	[options, onSelectionChange,labelValue],
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Discount"
      value={inputValue}
      prefix={<Icon source={SearchMinor} tone="base" />}
      placeholder="Search Discounts"
      autoComplete="off"
    />
  );

  useEffect(() => {
    const fetchDiscountOptions = async () => {
      try {
        const { data, error } = await makeApiCall('/api/get-discount-for-shop', 'get');
        if (error) {
          console.log('Error: ', error);
        } else {
          // Assuming data is an array of objects with 'value' and 'label' properties
          const formattedOptions = data.map((item) => ({
            value: item.id,
            label: item.discount_name,
          }));

          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDiscountOptions();
  }, []);

  return (
    <Autocomplete
      options={options}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
    />
  );
}