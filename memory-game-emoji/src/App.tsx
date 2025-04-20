import React, { useState, useEffect } from 'react';
import './index.css';

type CardType = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const emojiList = ['🐶', '🐱', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁'];

function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [showWin, setShowWin] = useState(false);

  const shuffleCards = () => {
    const shuffled = [...emojiList, ...emojiList]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setShowWin(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleFlip = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flippedCards, index];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].matched = true;
        newCards[second].matched = true;

        setTimeout(() => {
          setCards([...newCards]);
          setFlippedCards([]);
          if (newCards.every(card => card.matched || card === newCards[first] || card === newCards[second])) {
            setShowWin(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-container">
      <h1>🧠 Emoji Memory Game</h1>

      {showWin && <div className="win-message">🎉 You Win! 🎉</div>}

      <button className="reset-button" onClick={shuffleCards}>🔁 Reset</button>

      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)}
          >
            <span>{card.flipped || card.matched ? card.emoji : '❓'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
