import React, { useState, useEffect } from 'react';
import { Player, Quest, Achievement, TaskCreationData } from '../types/GameTypes';
import { GameEngine } from '../classes/GameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from './StatsCard';
import TaskCard from './TaskCard';
import SmartTaskCreator from './SmartTaskCreator';
import CircularProgress from './CircularProgress';
import { Star, Trophy, Target, TrendingUp, Award, Plus } from 'lucide-react';

interface PlayerDashboardProps {
  playerId: string;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ playerId }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
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

  const handleCreateTask = (taskData: TaskCreationData) => {
    const newQuest = gameEngine.createTaskFromData(playerId, taskData);
    setShowTaskCreator(false);
    
    // Refresh data
    const updatedPlayer = gameEngine.getPlayer(playerId);
    if (updatedPlayer) {
      setPlayer(updatedPlayer);
      setAvailableQuests(gameEngine.getAvailableQuests(playerId));
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <div className="text-body">Loading your progress...</div>
        </div>
      </div>
    );
  }

  const xpPercentage = (player.xp / (player.xp + player.xpToNextLevel)) * 100;

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-gentle-fade-in bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Character Overview */}
        <Card className="lg:col-span-2 clean-card border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="text-5xl">{player.avatar}</div>
              <div className="flex-1">
                <h1 className="text-display">{player.name}</h1>
                <p className="text-body capitalize mb-4">
                  {player.characterClass} • Level {player.level}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-caption">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {player.xp} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Next: {player.xp + player.xpToNextLevel} XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-700 animate-progress-fill"
                      style={{ width: `${xpPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-caption text-gray-500">
                    {player.xpToNextLevel} XP to next level
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="clean-card border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-heading mb-4">Today's Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-body">Level</span>
                <CircularProgress value={player.level} max={50} size={40} strokeWidth={3}>
                  <span className="text-xs font-semibold">{player.level}</span>
                </CircularProgress>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body">Quests</span>
                <CircularProgress value={player.completedQuests.length} max={100} size={40} strokeWidth={3} color="#10b981">
                  <span className="text-xs font-semibold">{player.completedQuests.length}</span>
                </CircularProgress>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body">Achievements</span>
                <CircularProgress value={achievements.length} max={50} size={40} strokeWidth={3} color="#f59e0b">
                  <span className="text-xs font-semibold">{achievements.length}</span>
                </CircularProgress>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Card */}
      <StatsCard stats={player.stats} level={player.level} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Tasks */}
        <Card className="clean-card border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-heading">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                Today's Focus
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {availableQuests.length}
                </Badge>
              </div>
              <Button 
                onClick={() => setShowTaskCreator(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableQuests.slice(0, 4).map((quest) => (
              <TaskCard 
                key={quest.id} 
                quest={quest} 
                onComplete={handleCompleteQuest} 
              />
            ))}
            {availableQuests.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-body mb-4">No tasks yet! Create your first task.</p>
                <Button 
                  onClick={() => setShowTaskCreator(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="clean-card border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-heading">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievements
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {achievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.slice(-4).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-heading">{achievement.title}</h4>
                  <p className="text-body">{achievement.description}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-body">Complete tasks to unlock achievements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="clean-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-heading">
            <Award className="w-5 h-5 text-primary" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">{player.level}</div>
              <div className="text-caption text-blue-700">Current Level</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">{player.completedQuests.length}</div>
              <div className="text-caption text-green-700">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">{achievements.length}</div>
              <div className="text-caption text-purple-700">Achievements</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1">{player.xp}</div>
              <div className="text-caption text-orange-700">Total XP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Task Creator Modal */}
      {showTaskCreator && (
        <SmartTaskCreator
          onCreateTask={handleCreateTask}
          onCancel={() => setShowTaskCreator(false)}
        />
      )}
    </div>
  );
};

export default PlayerDashboard;
