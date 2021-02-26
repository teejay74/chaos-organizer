import {
  createUploadTask,
} from '../functions/functions';
import { getPositionStream$ } from '../functions/streamFunctions';

export default function eventsDragAndDrop(event) {
  const { type } = event;
  event.preventDefault();

  if (type === 'dragover') {
    this.dragableEl.parentElement.classList.remove('hidden');
    return;
  }

  if (type === 'dragleave' && event.screenX === 0) {
    this.dragableEl.parentElement.classList.add('hidden');
    return;
  }

  if (type === 'drop') {
    event.preventDefault();

    this.dragableEl.parentElement.classList.add('hidden');

    const file = event.dataTransfer.files[0];

    const fileStream$ = getPositionStream$(this).subscribe((data) => {
      if (data === 'Invalid coords') {
        this.getModal('geoModal').showError('Вы ввели неправильные координаты!');
        return;
      }
      createUploadTask(this, file, data);
      fileStream$.unsubscribe();
    });
  }
}
