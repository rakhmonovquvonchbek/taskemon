
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <div className="text-display mb-2">Taskémon</div>
          <div className="text-body">Loading your adventure...</div>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <h1 className="text-display">Taskémon</h1>
              <p className="text-caption">Life Optimization System</p>
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
