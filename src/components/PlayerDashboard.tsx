
import React, { useState, useEffect } from 'react';
import { Player, Quest, Achievement } from '../types/GameTypes';
import { GameEngine } from '../classes/GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Target, Zap, Award, TrendingUp } from 'lucide-react';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚔️</div>
          <div className="text-xl text-gray-600">Loading your adventure...</div>
        </div>
      </div>
    );
  }

  const xpPercentage = ((player.xpToNextLevel - (gameEngine.calculateXPForLevel(player.level + 1) - player.xp)) / gameEngine.calculateXPForLevel(player.level + 1)) * 100;

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Character Card */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl transform transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-6">
            <div className="text-7xl animate-pulse">{player.avatar}</div>
            <div className="flex-1">
              <CardTitle className="text-3xl flex items-center gap-3">
                {player.name}
                <span className="text-2xl animate-bounce">{getClassIcon(player.characterClass)}</span>
              </CardTitle>
              <p className="text-blue-100 capitalize text-lg">{player.characterClass} • Level {player.level}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {player.xp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {player.xp + player.xpToNextLevel} XP
                  </span>
                </div>
                <Progress value={xpPercentage} className="bg-blue-800/50 h-3" />
                <div className="text-xs mt-1 text-blue-200">
                  {player.xpToNextLevel} XP to next level
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-red-300">{player.stats.strength}</div>
              <div className="text-xs text-red-200">Strength</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-300">{player.stats.intelligence}</div>
              <div className="text-xs text-blue-200">Intelligence</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-300">{player.stats.creativity}</div>
              <div className="text-xs text-purple-200">Creativity</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-300">{player.stats.social}</div>
              <div className="text-xs text-green-200">Social</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-300">{player.stats.wisdom}</div>
              <div className="text-xs text-yellow-200">Wisdom</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-pink-300">{player.stats.luck}</div>
              <div className="text-xs text-pink-200">Luck</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Quests */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Target className="w-6 h-6 text-blue-600" />
              Available Quests
              <Badge className="bg-blue-100 text-blue-700">{availableQuests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableQuests.slice(0, 5).map((quest) => (
                <div key={quest.id} className="border-2 border-gray-100 rounded-xl p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">{quest.title}</h4>
                    <Badge 
                      className={`${getQuestDifficultyColor(quest.difficulty)} text-white`}
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{quest.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4" />
                        {quest.xpReward} XP
                      </span>
                      <span className="text-gray-500">⏱️ {quest.timeEstimate}m</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      ✅ Complete
                    </Button>
                  </div>
                </div>
              ))}
              {availableQuests.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-gray-500">No quests available. Great job!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Recent Achievements
              <Badge className="bg-yellow-100 text-yellow-700">{achievements.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.slice(-5).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="text-3xl animate-bounce">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                    <p className="text-sm text-yellow-600">{achievement.description}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-gray-500">Complete quests to unlock achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Award className="w-6 h-6 text-purple-600" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">{player.level}</div>
              <div className="text-sm text-blue-700 font-medium">Current Level</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">{player.completedQuests.length}</div>
              <div className="text-sm text-green-700 font-medium">Quests Completed</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">{achievements.length}</div>
              <div className="text-sm text-purple-700 font-medium">Achievements</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">{player.xp}</div>
              <div className="text-sm text-orange-700 font-medium">Total XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDashboard;
