## Запуск прокта:
npm run start

## Описание проекта:
### Задача парсинг: 
Один раз в час парсить объявления из профиля продавца на авито.
При первом парсинге октрывать объвления и собирать оттуда информацию (фото, описание, категория, ИД). 
При последующих парсингах собирать информацию только с новых объявлений. 
Смотреть какие объвления были сняты с размещения последнего парсинга. 

### Задача фида для тильды:
Тильда принимает YML и CSV файлы с товарами. После парсинга необходимо сгенерировать такой файл. 
В нем должны быть только актуальные объявления с полным описанием.
В этом файле должен быть перечень категорий. Категории отличаются у авито и у тильды.
Поэтому нужно собрать справочник категорий авито и приявязанные категорию тильды и 
в файле использовать категории тильды.

### Задача загрузка фида в тильду:
Тильда пидорасы и не дают просто установить ссылку на фид, чтобы они самостоятельно его обновляли.
Поэтому загрузка фида в тильду тоже через парсинг. Надо авторизоваться в тильде в управляемом браузере
и загружать файл через сайт, раз в час, сразу после генерации нового файла.

### Задача публиковать на стене группы в Вконтакте пост:
Все новые объявления после парсинга надо размещать на стене в группе в ВК.
У ВК есть апи для этого. В идеале публикация должна происходить не массово (не за раз 10 постов)
Можно использовать отложеную публикацию в апи в вк или крон задачу.