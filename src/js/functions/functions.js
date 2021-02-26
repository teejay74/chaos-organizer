import moment from 'moment';
import tasksTypes from '../models/tasks/tasksTypes';

export function scrollBoxUp(box) {
  box.scrollTop = box.scrollHeight;
}

export function showErrorBox(message) {
  const errorBox = document.querySelector('.file_upload_error-box');
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');

  const intID = setTimeout(() => {
    errorBox.classList.add('hidden');
    errorBox.textContent = '';
    clearTimeout(intID);
  }, 2000);
}

export function updateStates(manager, type, data = {}) {
  const method = type;
  const request = { method, data };
  let { timeLastStamp } = manager.buffer.stateTask;

  if (!manager.ws) {
    showErrorBox('No server connection!');
    return;
  }

  if (type === 'newTask') {
    timeLastStamp = data.timestamp;
  }

  if (type === 'deleteTask'
      || type === 'editTask'
      || type === 'switchPinnedOn'
      || type === 'switchPinnedOff') {
    timeLastStamp = moment().valueOf();
    manager.buffer.stateTask.timeLastStamp = timeLastStamp;
    request.data.timeLastStamp = timeLastStamp;
  }

  manager.ws.send(JSON.stringify(request));
}

export function createTextTask(manager, Task, data) {
  const newTask = new Task(data);
  newTask.init(manager.tasksBoxEl, manager.buffer);
  manager.inputEl.value = '';
  scrollBoxUp(manager.tasksBoxEl);
  manager.currentTask = newTask;
}

export function createInfoTask(manager, Task, task) {
  manager.buffer.taskView.push(task.id);
  const newTask = new Task(task);
  const html = newTask.createInfoMarkup();
  manager.ctrlAsideEl.querySelector('.aside_wrapper').insertAdjacentHTML('beforeend', html);
  manager.ctrlAsideEl.classList.remove('hidden');
}

export function isValidCoords(coords) {
  if (!coords.latitude || !coords.longitude) {
    return false;
  }

  if (Number.isNaN(coords.latitude) || Number.isNaN(coords.longitude)) {
    return false;
  }

  if (Math.abs(coords.latitude) > 90 || Math.abs(coords.longitude) > 180) {
    return false;
  }

  return true;
}

export function createRecordTask(manager, Task, data) {
  const reader = new FileReader();
  reader.readAsDataURL(data.src);

  reader.addEventListener('load', (event) => {
    const src = event.target.result;
    const { name, coords } = data;
    const newTask = new Task({ src, name, coords });
    newTask.init(manager.tasksBoxEl, manager.buffer);
    scrollBoxUp(manager.tasksBoxEl);
    updateStates(manager, 'newTask', newTask);
    manager.buffer.state.timeLastStamp = newTask.timestamp;
  });
}

export function delTaskFromState(buff, taskId) {
  buff.tasksList = buff.tasksList.filter(({ id }) => id !== taskId);
}

export function getTaskById(buff, taskId) {
  return buff.tasksList.find(({ id }) => id === taskId);
}

function addLinkTags(string) {
  return `<a href=${string} target="_blank">${string}</a>`;
}

function addParagraphTags(string) {
  return `<p class="message_paragraph">${string}</p>`;
}

function parseLink(html) {
  const reg = /\bhttp[s]?:\/\/[^\s]*/g;

  if (!reg.test(html)) {
    return html;
  }

  const linkedHtml = html.replace(reg, addLinkTags);
  return linkedHtml;
}

function parseRows(html) {
  const reg = /(.+)$/gm;

  const dividedHtml = html.replace(reg, addParagraphTags);
  return dividedHtml;
}

export function parseInputContent(content) {
  return parseRows(parseLink(content));
}

export function createUploadTask(manager, file, coords) {
  const { type, name } = file;
  manager.uploadEl.value = '';

  if (!type) {
    showErrorBox('Неизвестный формат файла!');
    return;
  }
  const types = Object.keys(tasksTypes);

  const currentTaskType = types.find((item) => type.includes(item));
  const Task = tasksTypes[currentTaskType];

  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    const src = event.target.result;
    const newTask = new Task({ src, name, coords });

    newTask.init(manager.tasksBoxEl, manager.buffer);
    manager.currentTask = newTask;
    manager.buffer.stateTask.timeLastStamp = newTask.timestamp;

    scrollBoxUp(manager.tasksBoxEl);

    updateStates(manager, 'newTask', manager.currentTask);

    manager.currentTask = null;
  });

  reader.readAsDataURL(file);
}

export function getPinnedType(task) {
  switch (task.type) {
    case 'message':
      return 'Text message';
    case 'coords':
      return 'Geolocation message';
    case 'audio':
      return 'Audio message';
    case 'video':
      return 'Video message';
    case 'video_record':
      return 'Video record';
    case 'audio_record':
      return 'Audio record';
    case 'file':
      return 'File message';
    case 'image':
      return 'Image message';
    default:
      return false;
  }
}
