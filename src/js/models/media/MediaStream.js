import tasksTypes from '../tasks/tasksTypes';
import { getPositionStream$ } from '../../functions/streamFunctions';
import { createRecordTask } from '../../functions/functions';
import Timer from './Timer';

export default class MediaStream {
  constructor(manager) {
    this.manager = manager;
    this.timer = new Timer(document.querySelector('.timer'));
    this.chunks = [];
    this.stream = null;
    this.recorder = null;
    this.videoEL = document.querySelector('.video_box');
    this.type = null;
  }

  recordStream(type, modal) {
    return (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === 'video',
        });
        const recorder = new MediaRecorder(stream);
        recorder.addEventListener('start', () => {
          this.stream = stream;
          this.recorder = recorder;
          this.timer.start();
          this.type = type;
          modal.show();
          if (type === 'video') {
            this.videoEL.classList.remove('hidden');
            this.videoEL.srcObject = stream;
            this.videoEL.play();
          }
        });

        recorder.addEventListener('dataavailable', (event) => {
          this.chunks.push(event.data);
        });
        return recorder;
      } catch (err) {
        throw new Error(`Нет доступа к ${type} устройству!`);
      }
    })();
  }

  addStopListener() {
    this.recorder.addEventListener('stop', () => {
      const recordType = this.type === 'audio' ? 'audio/wav' : 'video/webm';
      const blob = new Blob(this.chunks, {
        type: recordType,
      });
      const src = blob;

      const mediaTaskStream$ = getPositionStream$(this.manager).subscribe((data) => {
        if (data === 'Invalid coords') {
          this.manager.getModal('geoModal').showError('Вы ввели неправильные координаты!');
          return;
        }
        const coords = data;
        const type = `${this.type}_record`;
        createRecordTask(this.manager, tasksTypes[type], { src, coords });
        this.type = null;
        mediaTaskStream$.unsubscribe();
      });
    });
  }

  cleanStream() {
    this.stream.getTracks().forEach((track) => track.stop());
    this.recorder = null;
    this.stream = null;
    this.chunks = [];
  }

  stopRecord() {
    this.recorder.stop();
    this.cleanStream();
    this.timer.stop();
    this.manager.getModal('recordModal').hide();
  }
}
