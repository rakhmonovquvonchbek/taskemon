
import React from 'react';
import { PlayerStats } from '../types/GameTypes';
import CircularProgress from './CircularProgress';

interface StatsCardProps {
  stats: PlayerStats;
  level: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, level }) => {
  const statColors = {
    strength: '#ef4444',
    intelligence: '#3b82f6',
    creativity: '#8b5cf6',
    social: '#10b981',
    wisdom: '#f59e0b',
    luck: '#ec4899'
  };

  const statLabels = {
    strength: 'Wellness',
    intelligence: 'Growth',
    creativity: 'Creative',
    social: 'Social',
    wisdom: 'Focus',
    luck: 'Balance'
  };

  const maxStatValue = 20; // Professional scale

  return (
    <div className="clean-card rounded-2xl p-6 animate-gentle-fade-in">
      <h3 className="text-heading mb-6 text-center">Character Stats</h3>
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(stats).map(([statKey, value]) => (
          <div key={statKey} className="flex flex-col items-center space-y-2">
            <CircularProgress
              value={value}
              max={maxStatValue}
              size={60}
              strokeWidth={4}
              color={statColors[statKey as keyof PlayerStats]}
            >
              <span className="text-sm font-semibold text-gray-700">
                {value}
              </span>
            </CircularProgress>
            <span className="text-caption font-medium">
              {statLabels[statKey as keyof PlayerStats]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
