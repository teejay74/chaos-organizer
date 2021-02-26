import TextTask from './TextTask';
import CoordsTask from './CoordsTask';
import FileTask from './FileTask';
import ImageTask from './ImageTask';
import VideoTask from './VideoTask';
import AudioTask from './AudioTask';
import AudioRecordTask from './AudioRecordTask';
import VideoRecordTask from './VideoRecordTask';

export const tasksTypes = {
  message: TextTask,
  coords: CoordsTask,
  image: ImageTask,
  video: VideoTask,
  audio: AudioTask,
  audio_record: AudioRecordTask,
  video_record: VideoRecordTask,
  application: FileTask,
  file: FileTask,
};

export default tasksTypes;
