# Приложение Пекарня

Демонстрационное веб-приложение для заказа пользователями изделий
из предложенных ингредиентов.
Создано на [декларативном фреймворке Evado](https://github.com/mkhorin/evado).

Статья: [240 тысяч за 8 часов](https://zen.me/WDxP).

[![Создание приложения без кода](doc/poster.jpg)](https://zen.me/WDxP)

## Типовая установка

#### Необходимое окружение
- [Node.js](https://nodejs.org) (версия 20)
- [MongoDB](https://www.mongodb.com/download-center/community) (версия 5)

#### Linux
Скопируйте файлы из репозитория в /app
```sh
cd /app
npm install
NODE_ENV=development node console/install
NODE_ENV=development node console/start
```

#### Windows
Скопируйте файлы из репозитория в c:/app
```sh
cd c:/app
npm install
set NODE_ENV=development
node console/install
node console/start
```

## Установка через Docker

Скопируйте файлы из репозитория в /app
```sh
cd /app
docker-compose up -d mongo
docker-compose up --build installer
docker-compose up -d server
```

## Использование

Веб-интерфейс `http://localhost:3000`

Чтобы сделать заказ, зарегистрируйте нового пользователя.

Для управления войдите как администратор:
```sh
Email: a@a.a
Password: 123456
```