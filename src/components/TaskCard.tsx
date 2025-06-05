
import React from 'react';
import { Quest } from '../types/GameTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star, Zap } from 'lucide-react';

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
      epic: 'bg-purple-50 text-purple-700 border-purple-200'
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

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency || urgency === 'no-deadline') return null;
    
    const urgencyStyles = {
      'today': 'bg-red-50 text-red-700 border-red-200',
      'this-week': 'bg-orange-50 text-orange-700 border-orange-200',
      'this-month': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    
    const urgencyLabels = {
      'today': 'Due Today',
      'this-week': 'This Week', 
      'this-month': 'This Month'
    };

    return (
      <Badge className={`${urgencyStyles[urgency as keyof typeof urgencyStyles]} border`}>
        {urgencyLabels[urgency as keyof typeof urgencyLabels]}
      </Badge>
    );
  };

  return (
    <div className="clean-card rounded-xl p-4 clean-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-heading">{quest.title}</h4>
            {quest.urgency === 'today' && (
              <Zap className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-body">{quest.description}</p>
        </div>
        <div className="flex flex-col gap-2 ml-3">
          <Badge 
            className={`${getDifficultyColor(quest.difficulty)} border`}
            variant="outline"
          >
            {quest.difficulty}
          </Badge>
          {getUrgencyBadge(quest.urgency)}
        </div>
      </div>
      
      {/* Bonuses Display */}
      {quest.bonuses && quest.bonuses.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {quest.bonuses.map((bonus, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary"
            >
              {bonus.description}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-caption">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3" style={{ color: getCategoryColor(quest.category) }} />
            <span className="font-semibold text-primary">{quest.xpReward} XP</span>
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
