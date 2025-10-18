// MultiSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { Option, MultiSelectProps } from './types';
import './multiselect.css';
import arrowDownIcon from "../../../assets/svg/arrowDown.svg"
import closeIcon from "../../../assets/svg/close.svg"

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = "Select options...",
    disabled = false,
    maxSelected,
    searchable = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                        handleOptionToggle(filteredOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    setSearchTerm("");
                    setHighlightedIndex(-1);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions]);

    const handleOptionToggle = (option: Option) => {
        if (option.disabled) return;

        const isSelected = selectedValues.includes(option.value);
        let newSelectedValues: string[];

        if (isSelected) {
            newSelectedValues = selectedValues.filter(value => value !== option.value);
        } else {
            if (maxSelected && selectedValues.length >= maxSelected) return;
            newSelectedValues = [...selectedValues, option.value];
        }

        onChange(newSelectedValues);
        setSearchTerm("");
    };

    const removeSelected = (value: string, event: React.MouseEvent) => {
        event.stopPropagation();
        onChange(selectedValues.filter(v => v !== value));
    };

    const clearAll = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChange([]);
    };

    const getSelectedLabels = () => {
        return selectedValues.map(value =>
            options.find(option => option.value === value)?.label || value
        );
    };

    const isOptionSelected = (option: Option) => {
        return selectedValues.includes(option.value);
    };

    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    return (
        <div
            ref={dropdownRef}
            className={`multi-select ${className} ${disabled ? 'disabled' : ''}`}
        >
            <div
                className="multi-select-trigger"
                onClick={handleInputFocus}
            >
                <div className="selected-values">
                    {getSelectedLabels().length > 0 ? (
                        getSelectedLabels().map((label, index) => (
                            <span key={selectedValues[index]} className="selected-tag">
                                {label}
                                <button
                                    type="button"
                                    onClick={(e) => removeSelected(selectedValues[index], e)}
                                    className="remove-btn"
                                    disabled={disabled}
                                >
                                    <img src={closeIcon} className="w-[8px]" alt="close icon" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="placeholder">{placeholder}</span>
                    )}
                </div>

                {searchable && isOpen && (
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Search..."
                        disabled={disabled}
                    />
                )}

                <div className="multi-select-actions">
                    {selectedValues.length > 0 && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={clearAll}
                            disabled={disabled}
                        >
                            <img src={closeIcon} className="w-[12px]" alt="close icon" />
                        </button>
                    )}
                    <span className="dropdown-arrow">
                        <img src={arrowDownIcon} className="w-[12px]" alt="arrow down icon" />
                    </span>
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="multi-select-dropdown p-2 shadow-lg rounded-md">
                    {filteredOptions.length === 0 ? (
                        <div className="dropdown-item no-results">No options found</div>
                    ) : (
                        filteredOptions.map((option, index) => {
                            const selected = isOptionSelected(option);
                            //   const isDisabled = option.disabled || (maxSelected && selectedValues.length >= maxSelected && !selected);
                            const isDisabled = !!option.disabled || (typeof maxSelected === 'number' && selectedValues.length >= maxSelected && !selected);

                            return (
                                <div
                                    key={option.value}
                                    className={` rounded-md dropdown-item ${selected ? 'selected' : ''} ${highlightedIndex === index ? 'highlighted' : ''
                                        } ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && handleOptionToggle(option)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => { }}
                                        disabled={isDisabled}
                                        className="checkbox checked:bg-gray-800 checked:border-gray-800"
                                    />
                                    <span className="option-label">{option.label}</span>
                                    {typeof maxSelected === 'number' && selectedValues.length >= maxSelected && !selected && (
                                        <span className="max-selected-hint">(Max {maxSelected})</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
