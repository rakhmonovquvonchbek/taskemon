
import React, { useState } from 'react';
import { CharacterClass, Player, PlayerStats } from '../types/GameTypes';
import { GameEngine } from '../classes/GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CharacterCreationProps {
  onCharacterCreated: (player: Player) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('scholar');
  const [selectedAvatar, setSelectedAvatar] = useState('🧙‍♂️');
  const gameEngine = GameEngine.getInstance();

  const characterClasses: Record<CharacterClass, {
    name: string;
    description: string;
    bonuses: string[];
    stats: PlayerStats;
    emoji: string;
  }> = {
    scholar: {
      name: 'Scholar',
      description: 'Masters of knowledge and learning',
      bonuses: ['50% bonus XP for learning tasks', '20% bonus for work tasks'],
      stats: { strength: 8, intelligence: 15, creativity: 10, social: 8, wisdom: 12, luck: 7 },
      emoji: '📚'
    },
    athlete: {
      name: 'Athlete',
      description: 'Champions of physical fitness and health',
      bonuses: ['50% bonus XP for health tasks', '20% bonus for personal tasks'],
      stats: { strength: 15, intelligence: 8, creativity: 7, social: 10, wisdom: 10, luck: 10 },
      emoji: '💪'
    },
    creator: {
      name: 'Creator',
      description: 'Artists and innovators of the world',
      bonuses: ['50% bonus XP for creative tasks', '20% bonus for personal tasks'],
      stats: { strength: 7, intelligence: 12, creativity: 15, social: 8, wisdom: 10, luck: 8 },
      emoji: '🎨'
    },
    social: {
      name: 'Social',
      description: 'Masters of relationships and communication',
      bonuses: ['50% bonus XP for social tasks', '20% bonus for work tasks'],
      stats: { strength: 8, intelligence: 10, creativity: 10, social: 15, wisdom: 9, luck: 8 },
      emoji: '👥'
    },
    explorer: {
      name: 'Explorer',
      description: 'Adventurers seeking new experiences',
      bonuses: ['50% bonus XP for personal tasks', '20% bonus for social tasks'],
      stats: { strength: 12, intelligence: 9, creativity: 11, social: 10, wisdom: 8, luck: 10 },
      emoji: '🌍'
    }
  };

  const avatarOptions = [
    '🧙‍♂️', '🧙‍♀️', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', 
    '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🏫', '👩‍🏫',
    '🦸‍♂️', '🦸‍♀️', '🧑‍🚀', '👨‍⚕️', '👩‍⚕️', '🧑‍🔬'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10 animate-fade-in">
        <CardHeader className="text-center pb-8">
          <div className="mb-4">
            <div className="text-6xl mb-2 animate-bounce">⚔️</div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Character
            </CardTitle>
            <p className="text-gray-600 text-lg mt-2">Begin your life RPG adventure!</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Name Input */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-xl font-semibold text-gray-800">Character Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your character name..."
              className="text-lg p-4 border-2 focus:border-purple-500 transition-all duration-300 focus:shadow-lg"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-4">
            <Label className="text-xl font-semibold text-gray-800">Choose Your Avatar</Label>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-4xl p-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${
                    selectedAvatar === avatar 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 ring-4 ring-purple-500 shadow-lg scale-110' 
                      : 'hover:shadow-md'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Class Selection */}
          <div className="space-y-4">
            <Label className="text-xl font-semibold text-gray-800">Choose Your Class</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(characterClasses).map(([classKey, classInfo]) => (
                <Card
                  key={classKey}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                    selectedClass === classKey 
                      ? 'ring-4 ring-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedClass(classKey as CharacterClass)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3 animate-pulse">{classInfo.emoji}</div>
                      <h3 className="font-bold text-xl text-gray-800">{classInfo.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{classInfo.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-700">Bonuses:</div>
                      <div className="space-y-1">
                        {classInfo.bonuses.map((bonus, index) => (
                          <Badge key={index} variant="secondary" className="text-xs w-full justify-center py-1">
                            {bonus}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="font-bold text-lg text-red-600">{classInfo.stats.strength}</div>
                        <div className="text-red-500">STR</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="font-bold text-lg text-blue-600">{classInfo.stats.intelligence}</div>
                        <div className="text-blue-500">INT</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="font-bold text-lg text-purple-600">{classInfo.stats.creativity}</div>
                        <div className="text-purple-500">CRE</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-bold text-lg text-green-600">{classInfo.stats.social}</div>
                        <div className="text-green-500">SOC</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="font-bold text-lg text-yellow-600">{classInfo.stats.wisdom}</div>
                        <div className="text-yellow-500">WIS</div>
                      </div>
                      <div className="text-center p-2 bg-pink-50 rounded-lg">
                        <div className="font-bold text-lg text-pink-600">{classInfo.stats.luck}</div>
                        <div className="text-pink-500">LUK</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Character Preview</h3>
              <div className="flex items-center gap-6">
                <div className="text-7xl animate-pulse">{selectedAvatar}</div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-800">{name || 'Your Character'}</div>
                  <div className="text-gray-600 capitalize text-lg">
                    {characterClasses[selectedClass].name} • Level 1
                  </div>
                  <div className="text-gray-500 mt-2 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span>Ready to begin your adventure!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <Button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            className="w-full text-xl py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              Begin Adventure
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;
