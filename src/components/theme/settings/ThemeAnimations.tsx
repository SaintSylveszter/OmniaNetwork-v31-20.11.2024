import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeAnimationsProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeAnimations: React.FC<ThemeAnimationsProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (section: string, property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (!newSettings.animations) {
      newSettings.animations = {};
    }
    newSettings.animations[section][property] = value;
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Animations</h3>

      {/* Page Transitions */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Page Transitions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <select
              value={settings.animations?.page?.type || 'fade'}
              onChange={(e) => handleChange('page', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="scale">Scale</option>
              <option value="flip">Flip</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              value={settings.animations?.page?.duration || 300}
              onChange={(e) => handleChange('page', 'duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Element Hover */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Element Hover</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Scale Factor
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.animations?.hover?.scale || 1.05}
              onChange={(e) => handleChange('hover', 'scale', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              value={settings.animations?.hover?.duration || 200}
              onChange={(e) => handleChange('hover', 'duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Loading States</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <select
              value={settings.animations?.loading?.type || 'pulse'}
              onChange={(e) => handleChange('loading', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="pulse">Pulse</option>
              <option value="spin">Spin</option>
              <option value="bounce">Bounce</option>
              <option value="shimmer">Shimmer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              value={settings.animations?.loading?.duration || 1000}
              onChange={(e) => handleChange('loading', 'duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Scroll Reveal */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Scroll Reveal</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <select
              value={settings.animations?.scroll?.type || 'fade-up'}
              onChange={(e) => handleChange('scroll', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="fade-up">Fade Up</option>
              <option value="fade-down">Fade Down</option>
              <option value="fade-left">Fade Left</option>
              <option value="fade-right">Fade Right</option>
              <option value="zoom-in">Zoom In</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Distance (px)
            </label>
            <input
              type="number"
              value={settings.animations?.scroll?.distance || 50}
              onChange={(e) => handleChange('scroll', 'distance', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration (ms)
            </label>
            <input
              type="number"
              value={settings.animations?.scroll?.duration || 800}
              onChange={(e) => handleChange('scroll', 'duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Delay (ms)
            </label>
            <input
              type="number"
              value={settings.animations?.scroll?.delay || 0}
              onChange={(e) => handleChange('scroll', 'delay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeAnimations;