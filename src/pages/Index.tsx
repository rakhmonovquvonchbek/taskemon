
import React, { useState, useEffect } from 'react';
import { Player } from '../types/GameTypes';
import CharacterCreation from '../components/CharacterCreation';
import PlayerDashboard from '../components/PlayerDashboard';

const Index = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a saved player in localStorage
    const savedPlayerId = localStorage.getItem('taskemon_player_id');
    if (savedPlayerId) {
      // In a real app, you'd load the player from the game engine
      // For now, we'll just set loading to false
    }
    setIsLoading(false);
  }, []);

  const handleCharacterCreated = (player: Player) => {
    setCurrentPlayer(player);
    localStorage.setItem('taskemon_player_id', player.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚔️</div>
          <div className="text-white text-2xl animate-pulse">Loading Taskémon...</div>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bounce">⚔️</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Taskémon
              </h1>
              <p className="text-sm text-gray-600">Life RPG System</p>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <PlayerDashboard playerId={currentPlayer.id} />
      </main>
    </div>
  );
};

export default Index;
