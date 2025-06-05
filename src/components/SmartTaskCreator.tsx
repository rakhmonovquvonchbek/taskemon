
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TaskCreationData, TaskDifficulty, TaskImportance, TaskAvoidance, QuestCategory, TaskUrgency, TaskBonus } from '../types/GameTypes';
import { Zap, Star, Clock, Target, TrendingUp } from 'lucide-react';

interface SmartTaskCreatorProps {
  onCreateTask: (taskData: TaskCreationData) => void;
  onCancel: () => void;
}

const SmartTaskCreator: React.FC<SmartTaskCreatorProps> = ({ onCreateTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [importance, setImportance] = useState<TaskImportance>('would-be-nice');
  const [avoidance, setAvoidance] = useState<TaskAvoidance>('neutral');
  const [category, setCategory] = useState<QuestCategory>('personal');
  const [urgency, setUrgency] = useState<TaskUrgency>('no-deadline');
  const [calculatedXP, setCalculatedXP] = useState(0);
  const [bonuses, setBonuses] = useState<TaskBonus[]>([]);
  const [motivationMessage, setMotivationMessage] = useState('');

  const difficultyOptions = [
    { value: 'easy', label: 'Easy (5-10 min)', baseXP: 15 },
    { value: 'medium', label: 'Medium (30-60 min)', baseXP: 45 },
    { value: 'hard', label: 'Hard (2+ hours)', baseXP: 115 },
    { value: 'epic', label: 'Epic (Multi-day)', baseXP: 250 }
  ];

  const importanceOptions = [
    { value: 'life-changing', label: 'Life-changing important', multiplier: 1.5, description: '+50% XP' },
    { value: 'really-should', label: 'Really should do', multiplier: 1.25, description: '+25% XP' },
    { value: 'would-be-nice', label: 'Would be nice', multiplier: 1.0, description: 'Base XP' },
    { value: 'not-needed', label: 'Not really needed', multiplier: 0.75, description: '-25% XP' }
  ];

  const avoidanceOptions = [
    { value: 'really-avoid', label: "Really don't want to do", multiplier: 2.0, description: '+100% XP!' },
    { value: 'kinda-dreading', label: 'Kinda dreading it', multiplier: 1.5, description: '+50% XP' },
    { value: 'neutral', label: 'Neutral about it', multiplier: 1.0, description: 'Base XP' },
    { value: 'want-to-do', label: 'Actually want to do it', multiplier: 1.25, description: '+25% XP' }
  ];

  const categoryOptions = [
    { value: 'health', label: '💪 Health/Fitness', stat: 'Strength' },
    { value: 'learning', label: '🧠 Learning/Growth', stat: 'Intelligence' },
    { value: 'creative', label: '🎨 Creative Projects', stat: 'Creativity' },
    { value: 'social', label: '👥 Social/Relationships', stat: 'Social' },
    { value: 'personal', label: '🏠 Life Admin/Chores', stat: 'Wisdom' }
  ];

  const urgencyOptions = [
    { value: 'today', label: 'Due today', multiplier: 2.0, description: '2x XP + Urgent!' },
    { value: 'this-week', label: 'Due this week', multiplier: 1.5, description: '1.5x XP' },
    { value: 'this-month', label: 'Due this month', multiplier: 1.2, description: '1.2x XP' },
    { value: 'no-deadline', label: 'No deadline', multiplier: 1.0, description: 'Base XP' }
  ];

  useEffect(() => {
    calculateXP();
  }, [difficulty, importance, avoidance, urgency]);

  const calculateXP = () => {
    const baseXP = difficultyOptions.find(d => d.value === difficulty)?.baseXP || 45;
    const importanceMultiplier = importanceOptions.find(i => i.value === importance)?.multiplier || 1.0;
    const avoidanceMultiplier = avoidanceOptions.find(a => a.value === avoidance)?.multiplier || 1.0;
    const urgencyMultiplier = urgencyOptions.find(u => u.value === urgency)?.multiplier || 1.0;

    // Calculate bonuses
    const newBonuses: TaskBonus[] = [];
    
    if (importanceMultiplier > 1.0) {
      newBonuses.push({
        type: 'importance',
        multiplier: importanceMultiplier,
        description: importanceOptions.find(i => i.value === importance)?.description || ''
      });
    }

    if (avoidanceMultiplier > 1.0) {
      newBonuses.push({
        type: 'avoidance',
        multiplier: avoidanceMultiplier,
        description: avoidanceOptions.find(a => a.value === avoidance)?.description || ''
      });
    }

    if (urgencyMultiplier > 1.0) {
      newBonuses.push({
        type: 'urgency',
        multiplier: urgencyMultiplier,
        description: urgencyOptions.find(u => u.value === urgency)?.description || ''
      });
    }

    setBonuses(newBonuses);
    
    const finalXP = Math.floor(baseXP * importanceMultiplier * avoidanceMultiplier * urgencyMultiplier);
    setCalculatedXP(finalXP);

    // Generate motivation message
    generateMotivationMessage(avoidance, importance, urgency, finalXP);
  };

  const generateMotivationMessage = (avoid: TaskAvoidance, imp: TaskImportance, urg: TaskUrgency, xp: number) => {
    if (avoid === 'really-avoid' && imp === 'life-changing') {
      setMotivationMessage(`🔥 Conquer your biggest challenge! Massive ${xp} XP awaits!`);
    } else if (avoid === 'really-avoid') {
      setMotivationMessage(`💪 Face your fears! +100% procrastination bonus = ${xp} XP!`);
    } else if (urg === 'today') {
      setMotivationMessage(`⚡ Urgent mission! Complete today for ${xp} XP!`);
    } else if (imp === 'life-changing') {
      setMotivationMessage(`🌟 Life-changing task! Transform yourself for ${xp} XP!`);
    } else if (xp > 100) {
      setMotivationMessage(`🎯 Epic reward ahead! Earn ${xp} XP and level up!`);
    } else {
      setMotivationMessage(`✨ Build momentum! ${xp} XP towards your next level!`);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const baseXP = difficultyOptions.find(d => d.value === difficulty)?.baseXP || 45;
    
    const taskData: TaskCreationData = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      importance,
      avoidance,
      category,
      urgency,
      baseXP,
      finalXP: calculatedXP,
      bonuses
    };

    onCreateTask(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-gentle-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto clean-card">
        <CardHeader>
          <CardTitle className="text-display flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Smart Task Creator
          </CardTitle>
          <p className="text-body">Answer 5 questions to calculate the perfect XP reward</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label className="text-heading">Task Name</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-heading">Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any details..."
                className="mt-2 resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Question 1: Difficulty */}
          <div className="space-y-3">
            <Label className="text-heading flex items-center gap-2">
              <Target className="w-4 h-4" />
              1. Task Difficulty
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value as TaskDifficulty)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    difficulty === option.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-heading">{option.label}</div>
                  <div className="text-caption text-primary">{option.baseXP} base XP</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Importance */}
          <div className="space-y-3">
            <Label className="text-heading flex items-center gap-2">
              <Star className="w-4 h-4" />
              2. How Much You Need This
            </Label>
            <div className="space-y-2">
              {importanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setImportance(option.value as TaskImportance)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                    importance === option.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-heading">{option.label}</span>
                  <Badge variant="secondary">{option.description}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Avoidance */}
          <div className="space-y-3">
            <Label className="text-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              3. How Much You Want To Avoid It
            </Label>
            <div className="space-y-2">
              {avoidanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAvoidance(option.value as TaskAvoidance)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                    avoidance === option.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-heading">{option.label}</span>
                  <Badge variant="secondary" className={option.multiplier > 1.5 ? 'bg-red-50 text-red-700' : ''}>
                    {option.description}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Category */}
          <div className="space-y-3">
            <Label className="text-heading">4. Category Selection</Label>
            <div className="grid grid-cols-1 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCategory(option.value as QuestCategory)}
                  className={`p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                    category === option.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-heading">{option.label}</span>
                  <Badge variant="outline">+{option.stat}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Urgency */}
          <div className="space-y-3">
            <Label className="text-heading flex items-center gap-2">
              <Clock className="w-4 h-4" />
              5. Urgency Level
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {urgencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setUrgency(option.value as TaskUrgency)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    urgency === option.value
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-heading">{option.label}</div>
                  <div className={`text-caption ${option.multiplier > 1.5 ? 'text-red-600' : 'text-primary'}`}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* XP Preview */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{calculatedXP} XP</div>
                <div className="text-heading mb-3">{motivationMessage}</div>
                {bonuses.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {bonuses.map((bonus, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {bonus.description}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Create Task ({calculatedXP} XP)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTaskCreator;
