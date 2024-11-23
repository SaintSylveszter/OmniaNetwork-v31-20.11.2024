import React from 'react';

interface TabsProps {
  selectedTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabProps {
  id: string;
  children: React.ReactNode;
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ selectedTab, onChange, children }) => {
  return <div className="tabs">{children}</div>;
};

export const TabList: React.FC<TabListProps> = ({ children }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ id, children }) => {
  return (
    <button
      className={`px-6 py-3 font-medium text-sm focus:outline-none ${
        id === 'article'
          ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ id, children }) => {
  return <div className="tab-panel">{children}</div>;
};