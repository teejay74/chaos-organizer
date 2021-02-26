/* eslint-disable */
import { fromEvent, of, Observable } from 'rxjs';
import { switchMap, catchError, filter } from 'rxjs/operators';
import { isValidCoords } from './functions';

export function formStream$(modal) {
  const form = modal.getForm();

  return fromEvent(form, 'click').pipe(

    filter(({ target }) => target.classList.contains('modal-btn')),
    switchMap((event) => {
      if (event.target.classList.contains('cancel-btn')) {
        modal.hide();
        return of(null);
      }

      if (event.target.classList.contains('ok-btn')) {
        const coords = modal.getCoordinates();
        if (isValidCoords(coords)) {
          modal.hide();
          return of(coords);
        }

        return of('Invalid coords');
      }
    }),
  );
}

export function getTaskPossition$(modal) {
  return new Observable((observer) => {
    navigator.geolocation.getCurrentPosition((crd) => {
      observer.next({ latitude: crd.coords.latitude, longitude: crd.coords.longitude });
      observer.complete();
    },
    (err) => {
      modal.show();
      observer.error(err);
    });
  });
}

export function getPositionStream$(manager) {
  const modal = manager.getModal('geoModal');

  return of({}).pipe(
    switchMap(() => getTaskPossition$(modal).pipe(
      catchError(() => formStream$(modal)),
    )),
  );
}
