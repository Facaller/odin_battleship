import './style.css';
import { Controller } from './logic/game/Game.js';
import { Handler } from './ui/dom.js';

document.addEventListener('DOMContentLoaded', () => {
    const controller = new Controller();
    const handler = new Handler(controller);
    handler.handleStartGame();
    
    console.log('asdasdasd')
})