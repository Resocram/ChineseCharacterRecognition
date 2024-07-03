import React from 'react';

export default function PlayerCard({player}) {
  return (
    <div>
      <div style={{ fontWeight:'bold'}}>Player: {player.username} </div>
      <div style={{ fontWeight:'bold'}}>Score: {player.score}</div>
    </div>
  );
}