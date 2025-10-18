import React, { useState, useRef, useEffect } from 'react';
import './datepicker.css';
import arrowDownIcon from "../../../assets/svg/arrowDown.svg"

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
  className?: string;
  format?: (date: Date) => string;
  startOfWeek?: 0 | 1; // 0 for Sunday, 1 for Monday
  alignPopup?:string
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select a date",
  minDate,
  maxDate,
  disabled = false,
  className = '',
  format,
  startOfWeek = 0,
  alignPopup = "left-0"
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Weekday names based on startOfWeek
  const weekdays = startOfWeek === 1 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for custom week start
    return startOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction: number): void => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  const selectDate = (date: Date): void => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (checkDate < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (checkDate > max) return true;
    }
    return false;
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const defaultFormatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    return format ? format(date) : defaultFormatDate(date);
  };

  const generateCalendar = (): React.ReactNode[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days: React.ReactNode[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="date-picker-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());
      
      days.push(
        <button
          key={day}
          className={`date-picker-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => !isDisabled && selectDate(date)}
          disabled={isDisabled}
          type="button"
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const handleInputClick = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleToggleClick = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleTodayClick = (): void => {
    const today = new Date();
    if (!isDateDisabled(today)) {
      selectDate(today);
    }
  };

  const handleClearClick = (): void => {
    setSelectedDate(null);
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className={`date-picker ${className}`} ref={datePickerRef}>
      <div className="date-picker-input">
        <input
          type="text"
          value={selectedDate ? formatDisplayDate(selectedDate) : ''}
          placeholder={placeholder}
          readOnly
          onClick={handleInputClick}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <button 
          className="date-picker-toggle"
          onClick={handleToggleClick}
          disabled={disabled}
          type="button"
          aria-label="Open date picker"
        >
            <img src={arrowDownIcon} className="w-[12px]" alt="arrow down icon" />
        </button>
      </div>
      
      {isOpen && (
        <div className={`date-picker-popup ${alignPopup || "left-0"}`} role="dialog" aria-modal="true" aria-label="Date picker">
          <div className="date-picker-header">
            <button 
              className="nav-button" 
              onClick={() => navigateYear(-1)}
              aria-label="Previous year"
              type="button"
            >
              &lt;&lt;
            </button>
            <button 
              className="nav-button" 
              onClick={() => navigateMonth(-1)}
              aria-label="Previous month"
              type="button"
            >
              &lt;
            </button>
            
            <div className="current-month-year">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            
            <button 
              className="nav-button" 
              onClick={() => navigateMonth(1)}
              aria-label="Next month"
              type="button"
            >
              &gt;
            </button>
            <button 
              className="nav-button" 
              onClick={() => navigateYear(1)}
              aria-label="Next year"
              type="button"
            >
              &gt;&gt;
            </button>
          </div>
          
          <div className="date-picker-weekdays">
            {weekdays.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="date-picker-days">
            {generateCalendar()}
          </div>
          
          <div className="date-picker-footer">
            <button 
              className="today-button"
              onClick={handleTodayClick}
              type="button"
              disabled={isDateDisabled(new Date())}
            >
              Today
            </button>
            <button 
              className="clear-button"
              onClick={handleClearClick}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};