import AppController from './AppController';

// const manager = new AppController('ws://localhost:7171');
const manager = new AppController('wss://still-mountain-04235.herokuapp.com');
manager.init();
