import React, {useState, useRef, useEffect} from 'react';

export function DropdownSelect({
  options,
  label,
  lowerLabel,
  values,
  changeSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(values);

  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (event, option) => {
    const isSelected = selectedOptions.includes(option);
    changeSelect(event);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full border rounded-lg p-2 cursor-pointer border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700"
        onClick={handleToggleDropdown}
      >
        <span>Choose {label}</span>
        <svg
          className={`fill-current h-4 w-4 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 14l6-6H4z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-40 w-48 bg-white rounded-lg shadow dark:bg-gray-700 block">
          {options.map((option) => (
            <div
              key={option.label}
              className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <input
                type="checkbox"
                id={`option-${option.label}`}
                value={option.label}
                data-filter-type={lowerLabel}
                checked={selectedOptions.includes(option.label)}
                onChange={(event) => handleOptionClick(event, option.label)}
                className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                htmlFor={`option-${option.label}`}
                className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
