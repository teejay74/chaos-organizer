import { tasksTypes } from '../models/tasks/tasksTypes';
import {
  createUploadTask,
  createTextTask,
  parseInputContent,
  updateStates,

} from '../functions/functions';
import { getPositionStream$ } from '../functions/streamFunctions';

export default function eventsInput(event) {
  const { target, type, currentTarget } = event;
  const { classList } = target;

  if (type === 'input') {
    const sendBtn = document.querySelector('.send_icon');
    const activeStatus = sendBtn.classList.contains('active');
    if (currentTarget.value.trim() && !activeStatus) {
      sendBtn.classList.add('active');
      return;
    }

    if (!currentTarget.value.trim() && activeStatus) {
      sendBtn.classList.remove('active');
    }
    return;
  }

  if ((!event.shiftKey && !event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
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
  }
  if (classList.contains('upload_input')) {
    const file = event.target.files[0];

    const uploadStream$ = getPositionStream$(this).subscribe((data) => {
      if (data === 'Invalid coords') {
        this.getModal('geoModal').showError('Вы ввели неправильные координаты!');
        return;
      }

      createUploadTask(this, file, data);
      uploadStream$.unsubscribe();
    });
  }
}
