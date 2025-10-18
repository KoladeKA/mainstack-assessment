import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
  title?: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onItemClick?: () => void;
  className?: string;
  disabled?: boolean;
  // itemKey?:string | number
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = '',
  align = 'left',
  title = '',
  minWidth = '',
  maxWidth = '',
  width
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute mt-2 ${maxWidth || "max-w-48"} ${minWidth || "min-w-40"} ${width}  rounded-xl shadow-lg bg-white border border-gray-200 
            focus:outline-none z-10 ${alignmentClasses}
          `}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {title && <h5 className="font-light text-[14px] pt-1 pb-2 ps-3 border-b border-b-gray-100">{title}</h5>}
            {children}
          </div>
        </div>
      )}
    </div>
  );
};


export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onItemClick,
  className = '',
  disabled = false,
  // itemKey = '1'
}) => {
  return (
    // <div key={itemKey}>
      <button
        onClick={onItemClick}
        disabled={disabled}
        className={`
          block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 
          hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200 ${className}
        `}
        role="menuitem"
      >
        {children}
      </button>
    // </div>
  );
};
