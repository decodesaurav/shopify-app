import { Autocomplete, Icon } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { useState, useCallback, useEffect } from 'react';
import { useApiCall } from '../../hooks/apiUtils';
import _debounce from 'lodash/debounce';

export function SelectDiscount({ onSelectionChange, labelValue }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [options, setOptions] = useState([]);

const makeApiCall = useApiCall();

const handleDiscountSearchChange = useCallback(
	_debounce((value) => {
		setInputValue(value);
		debouncedUpdateText(value);
	}, 100),
	[]
);

const debouncedUpdateText =  _debounce(
  async (value) => {
    try {
		const endpoint = `/api/search-discounts?query=${value}`;
		const { data, count, error } = await makeApiCall(endpoint, 'get');
		if (data) {
			const resultOptions = data.map((option) => ({
				value: option.id,
				label: option.discount_name,
			}));
			setOptions(resultOptions);
		} else {
			console.error('Error fetching data:', error);
		}
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  600
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
      onChange={handleDiscountSearchChange}
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
          const formattedOptions = data.map((item) => ({
            value: item.discount_rule_id,
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