# устанавливаем официальный образ Node.js
FROM node:18.18.2

# указываем рабочую (корневую) директорию
WORKDIR /frontpurplehack

# копируем основные файлы приложения в рабочую директорию
COPY package.json package-lock.json ./
COPY yarn.lock ./

# устанавливаем указанные зависимости NPM на этапе установки образа
RUN npm install yarn

RUN yarn

# после установки копируем все файлы проекта в корневую директорию
COPY . ./


# запускаем основной скрипт в момент запуска контейнера
CMD yarn dev --host