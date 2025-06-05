
import React, { useState, useEffect } from 'react';
import { Player, Quest, Achievement } from '../types/GameTypes';
import { GameEngine } from '../classes/GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Target, User, Zap } from 'lucide-react';

interface PlayerDashboardProps {
  playerId: string;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ playerId }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const gameEngine = GameEngine.getInstance();

  useEffect(() => {
    const playerData = gameEngine.getPlayer(playerId);
    if (playerData) {
      setPlayer(playerData);
      setAvailableQuests(gameEngine.getAvailableQuests(playerId));
      setAchievements(gameEngine.getUnlockedAchievements(playerId));
    }
  }, [playerId]);

  const handleCompleteQuest = (questId: string) => {
    gameEngine.completeQuest(playerId, questId);
    const updatedPlayer = gameEngine.getPlayer(playerId);
    if (updatedPlayer) {
      setPlayer(updatedPlayer);
      setAvailableQuests(gameEngine.getAvailableQuests(playerId));
      setAchievements(gameEngine.getUnlockedAchievements(playerId));
    }
  };

  const getClassIcon = (characterClass: string) => {
    const icons: Record<string, string> = {
      scholar: '📚',
      athlete: '💪',
      creator: '🎨',
      social: '👥',
      explorer: '🌍'
    };
    return icons[characterClass] || '⭐';
  };

  const getQuestDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500',
      legendary: 'bg-purple-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  if (!player) {
    return <div className="text-center p-8">Loading your adventure...</div>;
  }

  const xpPercentage = ((player.xpToNextLevel - (gameEngine.calculateXPForLevel(player.level + 1) - player.xp)) / gameEngine.calculateXPForLevel(player.level + 1)) * 100;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Character Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{player.avatar}</div>
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                {player.name}
                <span className="text-lg">{getClassIcon(player.characterClass)}</span>
              </CardTitle>
              <p className="text-blue-100 capitalize">{player.characterClass} • Level {player.level}</p>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{player.xp} XP</span>
                  <span>{player.xp + player.xpToNextLevel} XP</span>
                </div>
                <Progress value={xpPercentage} className="bg-blue-800" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">{player.stats.strength}</div>
              <div className="text-xs">Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{player.stats.intelligence}</div>
              <div className="text-xs">Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{player.stats.creativity}</div>
              <div className="text-xs">Creativity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{player.stats.social}</div>
              <div className="text-xs">Social</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">{player.stats.wisdom}</div>
              <div className="text-xs">Wisdom</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-300">{player.stats.luck}</div>
              <div className="text-xs">Luck</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Quests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Available Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableQuests.slice(0, 5).map((quest) => (
                <div key={quest.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{quest.title}</h4>
                    <Badge 
                      className={`${getQuestDifficultyColor(quest.difficulty)} text-white`}
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {quest.xpReward} XP
                      </span>
                      <span className="text-gray-500">{quest.timeEstimate}m</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
              {availableQuests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No quests available. Great job!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.slice(-5).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                    <p className="text-sm text-yellow-600">{achievement.description}</p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-gray-500 text-center py-4">Complete quests to unlock achievements!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{player.level}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{player.completedQuests.length}</div>
              <div className="text-sm text-gray-600">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{player.xp}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDashboard;
