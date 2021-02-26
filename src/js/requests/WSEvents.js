import {
  updateStates,
  createTextTask,
  scrollBoxUp,
  getPinnedType,
  getTaskById,
  delTaskFromState,
  createInfoTask,
} from '../functions/functions';
import taskTypes from '../models/tasks/tasksTypes';

export default class WSEvents {
  constructor() {
    this.intervalId = null;
  }

  onWSOpen(manager) {
    document.querySelector('.connection_status').textContent = 'Online';
    document.querySelector('.organizer_header').classList.add('status_online');

    const { timeLastStamp } = manager.buffer.stateTask;

    updateStates(manager, 'getState', { timeLastStamp });
  }

  onWSMessage(manager, event) {
    const { method, data } = JSON.parse(event.data);

    if (method === 'getState') {
      manager.buffer.state = data.buffer.stateTask;
      const { tasksList } = data.buffer;

      tasksList.forEach((task) => {
        const { type } = task;
        createTextTask(manager, taskTypes[type], task);
        scrollBoxUp(manager.tasksBoxEl);
        manager.currentTask = null;
      });

      const pinnedId = data.buffer.stateTask.attached;
      data.buffer.taskView.forEach((task) => {
        createInfoTask(manager, taskTypes[task.type], task);
      });

      if (!pinnedId) return;

      manager.showPinnedMessage(pinnedId);
      const pinnedMessage = document.querySelector('.pinned_message');
      pinnedMessage.classList.remove('hidden');
      document.querySelector('.pinned_info_box_type')
        .textContent = getPinnedType(getTaskById(manager.buffer, pinnedId));

      return;
    }

    if (method === 'scrollTasks') {
      const topTask = manager.buffer.tasksList[0];

      const tasksToAdd = [topTask]
        .concat(data)
        .sort((a, b) => a.timestamp - b.timestamp);

      manager.buffer.tasksList.shift(0);
      document.querySelector(`[data-id="${topTask.id}"]`).remove();

      tasksToAdd.reverse().forEach((task) => {
        const { type } = task;
        const newTask = new taskTypes[type](task);
        manager.buffer.tasksList.unshift(newTask);
        const html = newTask.createMarkup();
        manager.tasksBoxEl.insertAdjacentHTML('afterbegin', html);
      });

      manager.tasksBoxEl.scrollTop = 20;
      return;
    }

    if (method === 'newTask') {
      manager.buffer.stateTask.timeLastStamp = data.newTask.timestamp;
      const { type } = data.newTask;
      createTextTask(manager, taskTypes[type], data.newTask);
      scrollBoxUp(manager.tasksBoxEl);
      return;
    }

    manager.buffer.stateTask.timeLastStamp = data.timeLastStamp;

    if (method === 'deleteTask') {
      delTaskFromState(manager.buffer, data.id);
      document.querySelector(`[data-id="${data.id}"]`).remove();
      return;
    }

    if (method === 'switchFavorite') {
      getTaskById(manager.stateTask, data.id).switchFavorite();
      document.querySelector(`[data-id="${data.id}"]`).classList.toggle('is-favorite');
      return;
    }

    if (method === 'editTask') {
      getTaskById(manager.stateTask, data.id).content = data.task.content;
      const editingContent = document.querySelector(`[data-id="${data.id}"] .text-content`);
      editingContent.innerHTML = data.task.content;
      return;
    }

    if (method === 'switchPinnedOn') {
      manager.buffer.stateTask.attached = data.id;
      manager.showPinnedMessage(data.id);
      getTaskById(manager.buffer, data.id).isPinned = true;
      return;
    }

    if (method === 'switchPinnedOff') {
      manager.showPinnedTask();
      manager.hidePinnedMessage();
      manager.taskViewClose();
      return;
    }

    if (method === 'showInfoPanel') {
      data.forEach((id) => {
        const task = getTaskById(manager.buffer, id);
        createInfoTask(manager, taskTypes[task.type], task);
      });
      return;
    }

    if (method === 'closeInfoPanel') {
      manager.taskViewClose();
      return;
    }

    if (method === 'getFavorite') {
      data.favorites.forEach((task) => {
        createInfoTask(manager, taskTypes[task.type], task);
      });

      manager.ctrlAsideEl.classList.remove('hidden');
    }
  }

  onWSClose(manager) {
    manager.ws = null;

    document.querySelector('.connection_status').textContent = 'Offline';
    document.querySelector('.organizer_header').classList.remove('status_online');
    this.restoreConnection();
  }

  restoreConnection() {
    this.intervalId = setInterval(() => {
      this.manager.initWSConnection();
    }, 60000);
  }

  clearInterval() {
    clearInterval(this.intervalId);
  }
}
