import React, { useState } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: TooltipPosition;
  className?: string;
}

export const TooltipComp: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-black',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-black',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-black',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-black'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-black rounded-lg
            whitespace-nowrap ${positionClasses[position]}
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0 border-4 border-transparent
              ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

// export default Tooltip;