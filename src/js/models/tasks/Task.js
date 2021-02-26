import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { getPinnedType } from '../../functions/functions';

export default class Task {
  constructor(data) {
    this.isPinned = data.isPinned || false;
    this.id = data.id || uuidv4();
    this.timestamp = data.timestamp || moment().valueOf();
    this.coords = data.coords || null;
    this.loaded = true;
  }

  init(container, buff) {
    this.bindToDOM(container);
    this.addToState(buff);
  }

  bindToDOM(container) {
    container.insertAdjacentHTML('beforeend', this.createMarkup());
  }

  setCoords(coords) {
    this.coords = coords;
  }

  getCoordsString() {
    if (!this.coords) return '--.----, ---.----';
    return `${this.coords.latitude.toFixed(4)}, ${this.coords.longitude.toFixed(4)}`;
  }

  getDate() {
    const now = moment(this.timestamp);
    moment.locale('ru');
    return now.format('DD.MM.YY HH:mm');
  }

  getSpecialsClasses() {
    return `${this.isPinned ? 'is-pinned' : ''}`;
  }

  addToState(buff) {
    buff.tasksList.push(this);
  }

  switchPinned() {
    this.isPinned = !this.isPinned;
  }

  getFormattedName(name) {
    let basename = name.split('.').slice(0, -1).join('.');
    const extname = name.split('.').slice(-1)[0];

    if (basename.length > 15) {
      basename = `${basename.slice(0, 6)}...${basename.slice(-7)}`;
    }

    return `${basename}.${extname}`;
  }

  getType(task) {
    return getPinnedType(task);
  }
}
