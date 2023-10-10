import React, { useState, useEffect, useRef } from 'react';
import './Dropdown.css';

const DropDown = ({
    selectedOption,
    handleOptionChange,
    data,
    childElement,
    selectedElement,
    selectorClass = '',
    childClass = '',
    placeholder = "Please select a option",
    enableSearch = false,
    debounce
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownList, setDropdownList] = useState(data)
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setDropdownList(data)
    };

    const handleChange = (option) => {
        handleOptionChange(option);
        setIsOpen(false);
    };

    const filterListData = (e) => {
        const value = e.target.value.toLowerCase()
        const filterList = data.filter(country => country.code.includes(value) || country.name.toLowerCase().includes(value) || country.ext.includes(value))
        setDropdownList(filterList)
    }

    return (
        <div ref={dropdownRef} className="dropdown-container">
            <div className={`dropdown-selected-option ${selectorClass} ${isOpen ? 'dropdown-selected-option-focus' : ''}`} onClick={toggleDropdown}>
                {(selectedOption && Object.keys(selectedOption).length) ? (
                    selectedElement(selectedOption)
                ) : (
                    <div className='dropdown-placeholder'>{placeholder}</div>
                )}
                <i className={`dropdown-toggler ${isOpen ? "open" : ""}`}></i>
            </div>
            {isOpen && (
                <ul className={`dropdown-options-list ${childClass}`}>
                    { enableSearch ? <div className='dropdown-search-field'>
                        <input type="text" onChange={ debounce ? debounce(filterListData, 500) : filterListData } placeholder="Name, Code or Ext." />
                    </div> : <></> }
                    {dropdownList.map((element) => (
                        <li
                            key={element.id}
                            test-id={element.id}
                            onClick={() => handleChange(element)}
                            className={selectedOption && selectedOption.id === element.id ? 'active' : ''}
                        >
                            {childElement(element)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropDown;
