
import React, { useState } from 'react';
import { CharacterClass, Player, PlayerStats } from '../types/GameTypes';
import { GameEngine } from '../classes/GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CircularProgress from './CircularProgress';

interface CharacterCreationProps {
  onCharacterCreated: (player: Player) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('scholar');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const gameEngine = GameEngine.getInstance();

  const characterClasses: Record<CharacterClass, {
    name: string;
    description: string;
    bonuses: string[];
    stats: PlayerStats;
    icon: string;
    color: string;
  }> = {
    scholar: {
      name: 'Knowledge Seeker',
      description: 'Masters of learning and growth',
      bonuses: ['50% bonus XP for learning tasks', '20% bonus for work tasks'],
      stats: { strength: 8, intelligence: 15, creativity: 10, social: 8, wisdom: 12, luck: 7 },
      icon: '📚',
      color: '#1a73e8'
    },
    athlete: {
      name: 'Wellness Focused',
      description: 'Champions of health and vitality',
      bonuses: ['50% bonus XP for wellness tasks', '20% bonus for personal tasks'],
      stats: { strength: 15, intelligence: 8, creativity: 7, social: 10, wisdom: 10, luck: 10 },
      icon: '💪',
      color: '#10b981'
    },
    creator: {
      name: 'Creative Innovator',
      description: 'Artists and makers of the world',
      bonuses: ['50% bonus XP for creative tasks', '20% bonus for personal tasks'],
      stats: { strength: 7, intelligence: 12, creativity: 15, social: 8, wisdom: 10, luck: 8 },
      icon: '🎨',
      color: '#8b5cf6'
    },
    social: {
      name: 'Connector',
      description: 'Masters of relationships and networking',
      bonuses: ['50% bonus XP for social tasks', '20% bonus for work tasks'],
      stats: { strength: 8, intelligence: 10, creativity: 10, social: 15, wisdom: 9, luck: 8 },
      icon: '👥',
      color: '#ec4899'
    },
    explorer: {
      name: 'Achiever',
      description: 'Goal-oriented adventurers',
      bonuses: ['50% bonus XP for personal tasks', '20% bonus for social tasks'],
      stats: { strength: 12, intelligence: 9, creativity: 11, social: 10, wisdom: 8, luck: 10 },
      icon: '🎯',
      color: '#f59e0b'
    }
  };

  const avatarOptions = [
    '👤', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍💻', 
    '👩‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🚀', '👨‍⚕️', '👩‍⚕️'
  ];

  const handleCreateCharacter = () => {
    if (!name.trim()) return;

    const newPlayer: Omit<Player, 'id' | 'createdAt' | 'lastActive'> = {
      name: name.trim(),
      avatar: selectedAvatar,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      characterClass: selectedClass,
      stats: { ...characterClasses[selectedClass].stats },
      inventory: [],
      achievements: [],
      currentQuests: [],
      completedQuests: [],
    };

    const createdPlayer = gameEngine.createPlayer(newPlayer);
    onCharacterCreated(createdPlayer);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl clean-card border-0 shadow-xl animate-gentle-scale">
        <CardHeader className="text-center pb-8">
          <div className="mb-6">
            <div className="text-4xl mb-4">⚡</div>
            <CardTitle className="text-display">Create Your Character</CardTitle>
            <p className="text-body mt-2">Begin your life optimization journey</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Name Input */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-heading">Character Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="h-12 text-base border-gray-200 focus:border-primary rounded-xl"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-4">
            <Label className="text-heading">Choose Your Avatar</Label>
            <div className="grid grid-cols-6 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-3 rounded-xl clean-hover transition-all duration-200 ${
                    selectedAvatar === avatar 
                      ? 'bg-primary/10 ring-2 ring-primary scale-110' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Class Selection */}
          <div className="space-y-4">
            <Label className="text-heading">Choose Your Focus</Label>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(characterClasses).map(([classKey, classInfo]) => (
                <Card
                  key={classKey}
                  className={`cursor-pointer clean-card border transition-all duration-200 ${
                    selectedClass === classKey 
                      ? 'ring-2 ring-primary border-primary/20 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClass(classKey as CharacterClass)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-3">{classInfo.icon}</div>
                      <h3 className="text-heading">{classInfo.name}</h3>
                      <p className="text-body mt-1">{classInfo.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-caption font-medium text-gray-700">Bonuses:</div>
                      <div className="space-y-1">
                        {classInfo.bonuses.map((bonus, index) => (
                          <Badge key={index} variant="secondary" className="text-xs w-full justify-center py-1">
                            {bonus}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {Object.entries(classInfo.stats).slice(0, 6).map(([statName, value]) => (
                        <div key={statName} className="text-center">
                          <CircularProgress
                            value={value}
                            max={20}
                            size={40}
                            strokeWidth={3}
                            color={classInfo.color}
                          >
                            <span className="text-xs font-semibold">{value}</span>
                          </CircularProgress>
                          <div className="text-caption mt-1 capitalize">
                            {statName.slice(0, 3)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-heading mb-4">Character Preview</h3>
              <div className="flex items-center gap-6">
                <div className="text-5xl">{selectedAvatar}</div>
                <div className="flex-1">
                  <div className="text-display">{name || 'Your Character'}</div>
                  <div className="text-body capitalize">
                    {characterClasses[selectedClass].name} • Level 1
                  </div>
                  <div className="text-caption mt-2 flex items-center gap-2">
                    <span>✨</span>
                    <span>Ready to optimize your life</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <Button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            className="w-full h-12 btn-clean bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-medium"
          >
            Begin Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;
