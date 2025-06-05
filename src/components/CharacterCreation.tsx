
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Your Character
          </CardTitle>
          <p className="text-gray-600">Begin your life RPG adventure!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg font-semibold">Character Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your character name..."
              className="text-lg p-3"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Choose Your Avatar</Label>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-4xl p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    selectedAvatar === avatar ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Class Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Choose Your Class</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(characterClasses).map(([classKey, classInfo]) => (
                <Card
                  key={classKey}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedClass === classKey ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedClass(classKey as CharacterClass)}
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{classInfo.emoji}</div>
                      <h3 className="font-bold text-lg">{classInfo.name}</h3>
                      <p className="text-sm text-gray-600">{classInfo.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Bonuses:</div>
                      {classInfo.bonuses.map((bonus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {bonus}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-red-500">{classInfo.stats.strength}</div>
                        <div>STR</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-500">{classInfo.stats.intelligence}</div>
                        <div>INT</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-500">{classInfo.stats.creativity}</div>
                        <div>CRE</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-500">{classInfo.stats.social}</div>
                        <div>SOC</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-500">{classInfo.stats.wisdom}</div>
                        <div>WIS</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-pink-500">{classInfo.stats.luck}</div>
                        <div>LUK</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <h3 className="font-bold mb-3">Character Preview</h3>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedAvatar}</div>
                <div>
                  <div className="text-xl font-bold">{name || 'Your Character'}</div>
                  <div className="text-gray-600 capitalize">
                    {characterClasses[selectedClass].name} • Level 1
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Ready to begin your adventure!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <Button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            className="w-full text-lg py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Begin Adventure
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;
