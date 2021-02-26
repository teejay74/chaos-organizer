import {
  getTaskById,
  updateStates,
  createInfoTask,
  createTextTask,
  parseInputContent,
} from '../functions/functions';
import tasksTypes from '../models/tasks/tasksTypes';
import { getPositionStream$ } from '../functions/streamFunctions';

export default function eventsClick(e) {
  const { target, target: { classList } } = e;
  let id;
  let currentTask;

  if (target.closest('.task-block')) {
    this.blocked = target.closest('.task-block');
    id = this.blocked.dataset.id;
    currentTask = getTaskById(this.buffer, id);
  }

  if (classList.contains('download_icon')) {
    const link = this.blocked.querySelector('a');
    link.click();
    return;
  }

  if (classList.contains('del_icon')) {
    this.modals.delModal.show();
    return;
  }

  if (classList.contains('edit_icon')) {
    this.modals.editModal.show();
    this.modals.editModal.setValuesFromTask(currentTask);
    return;
  }

  if (classList.contains('pinned_icon')) {
    if (this.buffer.stateTask.attached) {
      return;
    }

    this.showPinnedMessage(id);
    updateStates(this, 'switchPinnedOn', { id });
    return;
  }

  if (classList.contains('pinned_close_icon')) {
    this.showPinnedTask();
    this.hidePinnedMessage();
    this.taskViewClose();
    updateStates(this, 'switchPinnedOff');
    return;
  }

  if (classList.contains('pinned_preview_box')) {
    const pinnedTask = this.buffer.tasksList.find(({ isPinned }) => isPinned);

    if (this.buffer.taskView.length) return;
    createInfoTask(this, tasksTypes[pinnedTask.type], pinnedTask);
    updateStates(this, 'showInfoPanel', this.buffer.taskView);
  }

  if (classList.contains('info_panel_close_icon')) {
    this.taskViewClose();
    updateStates(this, 'closeInfoPanel');
    return;
  }

  if (classList.contains('upload_icon')) {
    this.uploadEl.dispatchEvent(new MouseEvent('click'));
    return;
  }

  if (classList.contains('send_icon')) {
    const message = this.inputEl.value;

    if (!message.trim()) {
      return;
    }

    const content = parseInputContent(message);

    const textStream$ = getPositionStream$(this).subscribe((data) => {
      if (data === 'Invalid coords') {
        this.getModal('geoModal').showError('Вы ввели неправильные координаты!');
        return;
      }

      createTextTask(this, tasksTypes.message, { content, coords: data });
      updateStates(this, 'newTask', this.currentTask);
      this.currentTask = null;
      document.querySelector('.send_icon').classList.remove('active');
      textStream$.unsubscribe();
    });
    return;
  }

  if (classList.contains('geo_send_icon')) {
    const coordStream$ = getPositionStream$(this).subscribe((data) => {
      if (data === 'Invalid coords') {
        this.getModal('geoModal').showError('Вы ввели неправильные координаты!');
        return;
      }

      if (!data) return;

      createTextTask(this, tasksTypes.coords, { coords: data });
      updateStates(this, 'newTask', this.currentTask);
      this.currentTask = null;
      classList.add('blocked');
      const interval = setTimeout(() => {
        classList.remove('blocked');
        clearTimeout(interval);
      }, 1000);
      coordStream$.unsubscribe();
    });
  }

  if (classList.contains('audio_icon') || classList.contains('video_icon')) {
    const type = target.className.includes('audio') ? 'audio' : 'video';
    this.mediaRecorder.recordStream(type, this.modals.recordModal)
      .then((recorder) => {
        recorder.start();
      })
      .catch((err) => {
        this.modals.errModal.setMessage(err.message);
        this.modals.errModal.show();
      });
  }
}
