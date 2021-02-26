import {
  delTaskFromState,
  updateStates,
} from '../functions/functions';

export default function eventsClickModal(event) {
  event.preventDefault();
  const { target, target: { classList } } = event;
  const { type } = target.closest('.modal-wrapper').dataset;
  const modal = this.modals[type];

  if (type === 'geoModal') return;

  if (!classList.contains('modal-btn')) return;

  if (classList.contains('cancel-btn')) {
    modal.hide();
    return;
  }

  if (type === 'delModal') {
    const { id } = this.blocked.dataset;
    this.buffer.tasksList.find((task) => task.id === id);
    modal.hide();
    this.blocked.remove();
    this.blocked = null;
    delTaskFromState(this.buffer, id);
    updateStates(this, 'deleteTask', { id });
    return;
  }

  if (type === 'editModal') {
    const { id } = this.blocked.dataset;
    modal.setValuesToDOM(this.blocked);
    const editedTask = this.buffer.tasksList.find((task) => task.id === id);
    modal.setValuesToTask(editedTask);
    modal.hide();
    updateStates(this, 'editTask', { task: editedTask, id });
    this.blocked = null;
    return;
  }

  if (classList.contains('cancel-record-btn')) {
    this.mediaRecorder.stopRecord();
    return;
  }

  if (classList.contains('save-record-btn')) {
    this.mediaRecorder.addStopListener();
    this.mediaRecorder.stopRecord();
  }
}
