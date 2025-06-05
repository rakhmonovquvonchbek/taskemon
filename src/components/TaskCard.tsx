
import React from 'react';
import { Quest } from '../types/GameTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star } from 'lucide-react';

interface TaskCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ quest, onComplete }) => {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      hard: 'bg-red-50 text-red-700 border-red-200',
      legendary: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: '#10b981',
      learning: '#1a73e8',
      work: '#f59e0b',
      social: '#8b5cf6',
      personal: '#ec4899',
      creative: '#06b6d4'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="clean-card rounded-xl p-4 clean-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-heading mb-1">{quest.title}</h4>
          <p className="text-body">{quest.description}</p>
        </div>
        <Badge 
          className={`ml-3 ${getDifficultyColor(quest.difficulty)} border`}
          variant="outline"
        >
          {quest.difficulty}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-caption">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3" style={{ color: getCategoryColor(quest.category) }} />
            <span>{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{quest.timeEstimate}m</span>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={() => onComplete(quest.id)}
          className="btn-clean bg-primary text-white hover:bg-primary/90 h-8 px-3"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Complete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
