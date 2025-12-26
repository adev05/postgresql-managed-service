# Docker Setup

## Быстрый старт

Запустите проект одной командой:

```bash
docker-compose up --build
```

Приложение будет доступно по адресу: http://localhost:3000

## Требования

- Docker Desktop (для Windows)
- Docker Compose (обычно включен в Docker Desktop)

## Команды

### Запуск проекта

```bash
# Запуск в фоновом режиме
docker-compose up -d --build

# Запуск с отображением логов
docker-compose up --build
```

### Остановка проекта

```bash
docker-compose down
```

### Просмотр логов

```bash
docker-compose logs -f
```

### Пересборка образа

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Очистка всех ресурсов

```bash
docker-compose down -v
docker system prune -a
```

## Переменные окружения

Убедитесь, что файл `.env` содержит все необходимые переменные. Пример находится в `.env.example`.

## Troubleshooting

### Порт 3000 уже занят

Измените порт в `docker-compose.yml`:

```yaml
ports:
  - '3001:3000' # Локальный порт:Порт контейнера
```

### Ошибки сборки

Попробуйте очистить кэш Docker:

```bash
docker-compose build --no-cache
```

### Приложение не запускается

Проверьте логи:

```bash
docker-compose logs app
```
