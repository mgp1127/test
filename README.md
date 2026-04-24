# Pong Game

A classic Pong game built with vanilla HTML, CSS, and JavaScript. Play against a computer AI opponent and try to reach 5 points first!

## Features

✨ **Gameplay**
- Player-controlled left paddle (blue) vs Computer AI (pink)
- Bouncing ball with realistic physics
- Ball spin based on paddle impact location
- Progressive ball speed increase on paddle hits
- First to 5 points wins!

🎮 **Controls**
- **Mouse Movement** - Move your paddle up/down
- **Arrow Keys** - Alternative control (Up/Down arrows)
- Both controls work simultaneously

🏆 **Scoring**
- Real-time scoreboard display
- Win condition at 5 points
- Game ends with victory/defeat message

🔧 **Technical Features**
- Collision detection for paddles and walls
- Responsive ball physics with spin mechanics
- AI opponent with adjustable difficulty
- Smooth 60 FPS gameplay using requestAnimationFrame
- Clean, modern UI with gradient background

## How to Play

1. Open `index.html` in your web browser
2. Move your paddle (left side) using mouse or arrow keys
3. Keep the ball in play and try to score points
4. First player to reach 5 points wins
5. Press F5 to restart after game ends

## Files

- `index.html` - Game HTML structure
- `styles.css` - Game styling and layout
- `game.js` - Game logic, physics, and AI

## Game Mechanics

- **Paddle Speed**: Paddles move at consistent speed for smooth control
- **Ball Physics**: Ball bounces off walls and paddles with angle variations
- **Ball Spin**: Impact location on paddle determines ball angle
- **AI Difficulty**: Computer predicts ball position with slight delay for balanced gameplay
- **Speed Scaling**: Ball gradually increases speed up to a maximum limit

Enjoy playing!