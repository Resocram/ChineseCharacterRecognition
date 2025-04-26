import React from 'react';

export default function PlayerCard({player}) {
  return (
    <div>
      <div style={{ color:player.colour}}>Player: {player.username} </div>
      <div style={{ color:player.colour}}>Score: {player.score}</div>
    </div>
  );
}