import './style.css';
import { Controller } from './logic/game/Game.js';
import { Handler } from './ui/dom.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Controller();
    const dom = new Handler(game);
    dom.handleStartGame();
    
    console.log('asdasdasd')
})