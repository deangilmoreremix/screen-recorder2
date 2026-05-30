import React from 'react';

interface TransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  type: 'dissolve' | 'slide' | 'wipe';
}

export const AdvancedTransition: React.FC<TransitionProps> = ({ from, to, type }) => {
  const getTransitionType = () => {
    switch (type) {
      case 'dissolve':
        return 'dissolve';
      case 'slide':
        return 'slide';
      case 'wipe':
        return 'wipe';
      default:
        return 'dissolve';
    }
  };

  return (
    <div className="transition-container">
      <div className={`transition-${getTransitionType()}`}>
        <div>{from}</div>
        <div>{to}</div>
      </div>
    </div>
  );
};