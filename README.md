[![Build status](https://ci.appveyor.com/api/projects/status/70i81xfpshvbwh4g?svg=true)](https://ci.appveyor.com/project/teejay74/chaos-organizer)

+ [Ссылка на проект](https://teejay74.github.io/chaos-organizer/)

# Дипломное задание к курсу «Продвинутый JavaScript в браузере». Chaos Organizer 
## Обязательный функционал
* Сохранение в истории ссылок и текстовых сообщений
	- для сохранения ссылки или текстового сообщения, необходимо ввести в поле ввода необходимое сообщение:
		<img src="./pic/textTask.png" />
	- отправка осуществляется по нажатию на кнопку "Enter" или иконку для отправки сообщений:
		<img src="./pic/iconSend.png" />
	
* Ссылки (то, что начинается с http:// или https://) должны быть кликабельны и отображаться как ссылки
	- <img src="./pic/activeLink.png" /> 

* Сохранение в истории изображений, видео и аудио (как файлов) - через Drag & Drop и через иконку загрузки (скрепка в большинстве мессенджеров)
	- добавление файлов через иконку, осуществляется при нажатии иконки "скрепка"
		<img src="./pic/clip.png" /> 
	- через Drag & Drop 
		<img src="./pic/dad.png" /> 

* Скачивание файлов (на компьютер пользователя)
	- скачивание файлов, осуществляется по нажатию на соотвествующую икноку на определенной записи.
		<img src="./pic/download.png" /> 

* Ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д.
	- при достижении 10 или более сообщений, после обновления страницы, отображается последние 10 сообщений. Для загрузки остальных сообщений, необходимо произвести scroll вверх.

## Дополнительный функционал 
* Синхронизация - если приложение открыто в нескольких окнах (вкладках), то контент должен быть синхронизирован
	- сообщения обновляются без перезагрузки страницы, во всех открытых клиентах. 

* Запись видео и аудио (используя API браузера)
	- запись видео и аудио, осуществляется по нажатию на соответсвующую иконку:
		аудио:
		<img src="./pic/audio_record.png" /> 
		видео:
		<img src="./pic/video_record.png" /> 
	- по завершению записи, необходимо нажать кнопку "ОК"
		<img src="./pic/record.png" /> 

* Отправка геолокации
	- отправка геолокации осуществляется по нажатию на соотвествующую иконку:
		<img src="./pic/geo.png" /> 

* Воспроизведение видео/аудио (используя API браузера)
	- для воспроизведения видео или аудио файлов, необходимо нажать на кнопку play, у соотвествующего сообщения:
		<img src="./pic/play.png" /> 

* Закрепление (pin) сообщений, закреплять можно только одно сообщение (прикрепляется к верхней части страницы):
	- закрепление файлов, осуществляется по нажатию на соотвествующую икноку на определенной записи.
		<img src="./pic/pin.png" /> 
	- для просмотра информации о закрепленном сообщении, необходимо нажать на иноку в верхней области сообщений:
		<img src="./pic/pin_info.png" /> 
