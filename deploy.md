# Публикация Showme.menu с другой машины

Инструкция для обновления существующего сервера, а не для первоначальной установки сервера с нуля. Пути, ветки и процессы сверены по SSH и локальным репозиториям 31.10.2026. Перед следующей публикацией повторите короткую сверку: сервер и ветки могут измениться.

Основное правило: публиковать только изменённые файлы и необходимые зависимые бандлы. Не перекодировать и не заменять неизменившиеся изображения, шрифты и библиотеки. Сборка, публикация и commit/push являются отдельными действиями.

## 1. Карта проектов и сервера

| Часть                                 | Репозиторий, рабочая ветка                                    | Папка на исходной Windows-машине   | Production                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Лендинг, публичные документы          | `https://github.com/Savallera/QR-menu-landing.git`, `main`    | `D:\Projects\Web\QR-menu-landing`  | `https://showme.menu/`, файлы `/var/www/landing`                                                                                  |
| Кабинет, вход, регистрация            | `https://gitlab.com/showme2/front.git`, `dev`                 | `D:\Projects\Web\showme\front`     | `https://admin.showme.menu/`, nginx читает `/var/www/front/dist`                                                                  |
| Node API кабинета и worker            | `https://gitlab.com/showme2/back.git`, `dev`                  | `D:\Projects\Web\showme\back`      | `https://api.showme.menu/`, исходники `/root/back`, сборка `/root/back/dist`                                                      |
| Гостевое меню Vue и отдельный PHP API | `https://github.com/Navat2007/showme_menu_vue3.git`, `master` | `D:\Projects\Web\showme.menu vue3` | Меню заведений, например `https://harry.showme.menu/`; статика `/var/www/html`; PHP API `https://frontapi.showme.menu/php/models` |

Дополнительные пути:

- `/var/www/front/dist` сейчас является символической ссылкой на `/var/www/front/releases/registration-20261030-180356-utc`. Не заменяйте её обычным каталогом по ошибке. В `/var/www/front` есть отдельная серверная рабочая копия Git и `.env`.
- `/root/back/src/uploads`: пользовательские загрузки Node API, доступны через `https://api.showme.menu/public/`. Это рабочие данные, их нельзя заменять содержимым из Git.
- `/root/back/src/static`: статические ресурсы Node API, доступны через `/static/`.
- `/var/www/html/php`: отдельный PHP API. Важные приватные конфиги: `php/db_config.php`, `php/push_config.php`.
- `/var/www/html/uploads`, `/var/www/html/public`: рабочие ресурсы старого контура. Их не затрагивает публикация Vue `dist`.
- `/root/deploy-staging`: временные материалы текущей публикации. Удаляются после проверки.
- `/root/deploy-backups`: резервные копии и планы отката. Не удаляются вместе с временными проверками.
- В `/root/deploy-staging/legal-documents-20261030-142944-utc` сохранены два рабочих Git-кеша: `git-front.git`, `git-back.git`. Это не обязательная зависимость описанного ниже способа и не папки приложения.

Последние сверенные версии:

| Проект        | Commit                                     |
| ------------- | ------------------------------------------ |
| Лендинг       | `89e453bd34a3ba7135e42f61fe959211f3f3e590` |
| Кабинет       | `5758ea8bcfb849e9f7ab4b87db402dcc3d32e4a9` |
| Node API      | `5da54f38209ccb672b9010038a7ad0ff2e2b9d17` |
| Гостевое меню | `85f03a80927c7eb0eff08eedbd2cb87fea568645` |

У лендинга и гостевого меню production является набором файлов, а не обязательно Git checkout. Основание опубликованной версии нужно брать из плана последней публикации и проверять по хешам. Например, последний план лендинга: `/root/deploy-backups/landing-89e453b-20261030-185409/plan.json`.

## 2. Что подготовить на другой машине

Нужны Git с доступом к указанным GitHub/GitLab репозиториям, OpenSSH (`ssh`, `scp`), Python 3.9 или новее, Node.js и менеджеры пакетов. Для повторяемости текущего контура используйте Node.js `22.22.3`; гостевое меню использует `pnpm 8.15.2`, остальные три проекта используют npm и свой `package-lock.json`.

Примеры shell-команд ниже выполняются в Linux/WSL. Для бэкенда используйте файловую систему WSL, например `~/projects/showme/back`, а не `/mnt/d/...`: в старой истории есть отслеживаемые изображения с двоеточиями в именах. Обычный checkout этих файлов на NTFS может завершиться ошибкой. Не отключайте `core.protectNTFS` для обхода проблемы. Лендинг, кабинет и гостевое меню можно собирать и в PowerShell; команды `npm`, `node`, `pnpm`, `git` остаются теми же, но shell-сценарии публикации ниже требуют Linux/WSL.

Сценарии публикации выполняйте с остановкой при первой ошибке: перед последовательностью команд задайте `set -euo pipefail`. После неуспешной сборки, загрузки или дампа не переходите к следующему этапу.

Проверка установленных инструментов:

```bash
git --version
ssh -V
python3 --version
node --version
npm --version
corepack enable
corepack prepare pnpm@8.15.2 --activate
pnpm --version
```

В WSL нужен собственный Linux Node.js. Не смешивайте Windows `node_modules` с Linux `node_modules`. Если `corepack` отсутствует, установите согласованную версию pnpm отдельно; не подменяйте pnpm гостевого меню на npm.

### SSH-доступ

На исходной машине реквизиты соединения находятся в игнорируемом файле `D:\Projects\Web\showme.menu vue3\.claude\deploy.json`: поля `host` и `identityFile`. Использовался пользователь `root`, ключ `~/.ssh/showme_e2e`. Адрес сервера и ключ нужно получить из этого файла и защищённого хранилища отдельно. Их значения намеренно не записаны в этот документ для публичного Git.

Приватный ключ переносите защищённым способом. Альтернатива: отдельный ключ новой машины, публичная часть которого добавляется администратором в разрешённые ключи сервера. Сам этот документ доступ не выдаёт.

Создайте на новой машине запись в `~/.ssh/config`, заменив `SERVER_IP` реальным адресом:

```sshconfig
Host showme-prod
    HostName SERVER_IP
    User root
    IdentityFile ~/.ssh/showme_e2e
    IdentitiesOnly yes
    StrictHostKeyChecking yes
    ServerAliveInterval 30
```

В Linux/WSL:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config ~/.ssh/showme_e2e
ssh showme-prod 'hostname; id; readlink -f /var/www/front/dist'
```

До подключения перенесите проверенную запись сервера из `known_hosts` старой машины либо сверяйте fingerprint по доверенному каналу. С `StrictHostKeyChecking yes` неизвестный ключ будет отклонён. Не отключайте проверку и не принимайте результат `ssh-keyscan` без сверки fingerprint. В Windows права на приватный ключ задаются через ACL, а не `chmod`.

### Исходники

```bash
mkdir -p ~/projects/showme
cd ~/projects/showme
git clone --branch main https://github.com/Savallera/QR-menu-landing.git landing
git clone --branch dev https://gitlab.com/showme2/front.git front
git clone --branch dev https://gitlab.com/showme2/back.git back
git clone --branch master https://github.com/Navat2007/showme_menu_vue3.git guest
```

GitLab потребует доступ к частным репозиториям. Если HTTPS недоступен, используйте уже разрешённый Git SSH-доступ или перенос `git bundle` с доверенной машины. Не храните токен в remote URL. После переноса проверьте `git remote -v`, ветку, `git rev-parse HEAD` и `git status --short`.

### Окружение и секреты

- Лендинг: для обычной сборки публичных страниц серверный `.env` не требуется.
- Кабинет: возьмите `.env.example` за основу. Production `.env` есть в `/var/www/front/.env`; его актуальные значения надо перенести отдельно в локальную сборку. Важны `VITE_API_URL=https://api.showme.menu/api/v1`, `VITE_API_MEDIA_URL=https://api.showme.menu`, `VITE_API_TIMEOUT=30000` и фактический публичный ID CloudPayments. Не оставляйте публичный ID пустым при публикации оплаты.
- Гостевое меню: production-параметры сборки берутся из защищённой копии действующего `.env`. Адреса: `VITE_API_URL=https://frontapi.showme.menu/php/models`, `VITE_SERVICE_API_URL=https://frontapi.showme.menu/php/service`, `VITE_FILE_URL=https://api.showme.menu`. Нужен действующий `VITE_VAPID_PUBLIC_KEY`. Публичную часть можно получить из серверного `php/push_config.php`, но не копировать весь файл в клиентский проект.
- Node API: рабочие `/root/back/.env`, `.env.mail`, `.env.cloudpayments` сохраняются на сервере. Основные имена переменных: `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `SESSION_SECRET`; почтовые `SMTP_*`, `APP_URL`; `CLOUDPAYMENTS_PUBLIC_ID`, `CLOUDPAYMENTS_API_SECRET`. Файлы не надо переносить в статические сборки. `ENABLE_TEST_CONSOLE` уже присутствует в серверном `.env`; его значение не меняется обычной публикацией.

Все `VITE_*` доступны браузеру. В старом локальном `.env` гостевого проекта встречаются имена `VITE_SERVER_PASS`, `VITE_DB_PASS` и подобные. Не используйте их для передачи секретов в новую сборку. В проекте также есть долг по отслеживаемым `.env`/PHP-конфигам. Не публикуйте их содержимое, не перезаписывайте production-конфиги Git-версиями и не меняйте историю/ключи без отдельного решения.

## 3. Перед каждой публикацией

1. Определите один или несколько затронутых проектов. Изменение лендинга само по себе не требует обновления API, кабинета и меню.
2. Получите изменения, сохраните незакоммиченные пользовательские правки отдельно и выберите конкретный commit. Для чистой рабочей копии допустимо `git pull --ff-only`. При расхождении остановитесь и разберите его, не используйте `reset --hard` на рабочем каталоге с данными.
3. Сравните с фактически опубликованным commit: `git diff --name-status BASE HEAD`. `BASE` здесь обозначает проверенный commit production, а не произвольную предыдущую ветку.
4. Составьте список изменённых исходников и зависимых выходных файлов. Зафиксируйте выбранный commit, версию Node и lockfile. Изменение байтов только из-за другой версии сборщика не является основанием обновлять неизменившиеся библиотеки.
5. Запустите необходимые проверки изменённой области. Успешные проверки той же версии не надо повторять ради отдельного commit/push. Сохраняйте source-автотесты, удаляйте только временные скрипты, снимки и отчёты после проверки.
6. Проверьте сервер без изменений:

```bash
ssh showme-prod 'readlink -f /var/www/front/dist; git -C /root/back rev-parse HEAD; git -C /var/www/front rev-parse HEAD'
ssh showme-prod 'export PATH=/root/.nvm/versions/node/v22.22.3/bin:$PATH; pm2 ls'
curl -fsS https://api.showme.menu/healthz
curl -fsS https://api.showme.menu/readyz
```

Убедитесь, что никто параллельно не публикует те же файлы. Сценарий ниже дополнительно сверяет прежние хеши перед записью.

## 4. Сборка лендинга

```bash
cd ~/projects/showme/landing
npm ci --no-audit --no-fund
```

Выберите только нужные Gulp-задачи:

| Изменённый источник                | Задача                           | Возможный выход                                             |
| ---------------------------------- | -------------------------------- | ----------------------------------------------------------- |
| `src/pages/**/*.html`, HTML блоков | `html`                           | `dist/index.html`, языковые и документные страницы          |
| Общие SCSS и SCSS блоков           | `styles`                         | `dist/styles/styles.min.css`                                |
| `src/scripts/*.js`, JS блоков      | `scripts`                        | `dist/scripts/*.js`, включая `main.js`, `documents.js`      |
| `src/scripts/libs/*.js`            | `scriptsLibs`                    | Соответствующие файлы `dist/scripts/libs`                   |
| `src/styles/libs/*.css`            | `stylesLibs`                     | Соответствующие файлы `dist/styles/libs`                    |
| `src/fonts`                        | `fonts`                          | `dist/fonts`                                                |
| `src/files`                        | `files`                          | `dist/files`                                                |
| Изображения, иконки                | `images`, `favicon`, `svgSprite` | Только при фактическом изменении соответствующих исходников |

Например, при изменении юридического текста и общих блоков страницы:

```bash
npm run legal:build
node --no-experimental-require-module node_modules/gulp/bin/gulp.js html styles scripts files
```

`legal:build` нужен при изменении документов или их генератора, а не для любой правки. Канонические тексты находятся в `src/legal/documents/*.json`. Генератор формирует страницы и `src/files/legal/registration-documents.json`. Каталог версий содержит HTML, SHA256 и редакции для API регистрации. Публикуйте его после страниц, в рамках одного изменения. Для изменения только CSS не запускайте генерацию документов.

Флаг `--no-experimental-require-module` использовался с Node 22 для совместимости старого Gulp-стека. В `package.json` нет команды `npm run build`: она здесь неверна. `npm run deploy` отправляет на GitHub Pages, а не на production Showme.menu.

Не используйте `gulp build` по умолчанию: он очищает `dist` и запускает обработку всех изображений. Обычная единица выбора в текущем Gulp является задачей; задача может сформировать несколько выходов. Из них в публикацию включаются только относящиеся к изменённым исходникам и их зависимостям. Неизменившиеся бинарные ресурсы не нужно повторно кодировать.

На новой машине частичный `dist` может не содержать старые изображения. Это нормально для пакета обновления существующего сервера: проверьте, что ссылки страниц ведут на уже существующие production-ресурсы. Такой частичный `dist` не является самостоятельной полной копией сайта.

Проверки: `npm test` при изменении генерации/поведения; визуально проверить изменённые страницы на компьютере и телефоне. Публичные страницы: `/offer/`, `/privacy/`, `/contacts/`, `/personal-data-consent/`. Проверить доступ без входа, ссылки в подвале, язык и отсутствие горизонтального скролла. Не заменять утверждённые тексты собственными формулировками.

## 5. Сборка кабинета

```bash
cd ~/projects/showme/front
# Сначала подготовьте актуальный .env отдельно от Git.
npm ci --no-audit --no-fund
npm run build
```

Результат: `dist`. `VITE_*` встраиваются при сборке: изменение `.env` после неё не меняет уже собранный JS. При изменении поведения выполните относящиеся к нему Vitest-тесты. TypeScript-проверка входит в `npm run build`.

Для Vite новая точка входа может ссылаться на новые имена чанков. В пакет включаются все новые обязательные JS/CSS-зависимости, а не только `index.html`. Проверяйте граф импортов, CSS `url(...)` и ленивые чанки. Не удаляйте старые хешированные `assets`: ими ещё могут пользоваться открытые вкладки. Если неожиданно изменились все vendor-файлы, сначала проверьте Node и lockfile.

Публикация статики кабинета выполняется разделом 7 с корнем `/var/www/front/dist`. Скрипт разрешит существующую ссылку и сохранит её. Смена Git commit в `/var/www/front` сама по себе не публикует `dist`; при сборке на другой машине серверный Git HEAD может отличаться от опубликованного артефакта. Основание нового артефакта записывается в его план.

## 6. Сборка гостевого меню

```bash
cd ~/projects/showme/guest
# Сначала подготовьте production .env и публичный VAPID-ключ.
pnpm install --frozen-lockfile
pnpm build
```

Результат: `dist`. Сборка запускает `scripts/check-push-env.js`; не обходите проверку пустого или неверного VAPID-ключа.

В фактическом `vite.config.js` используется PWA `injectManifest`, исходник `src/sw.js`. После изменения клиентского JS/страниц может измениться `sw.js`, `registerSW.js`, `manifest.webmanifest` и связанные чанки. Публикуйте согласованный набор: сначала ресурсы, затем HTML, затем управляющие PWA-файлы. Старые хешированные чанки сохраняются для закешированных страниц. Не редактируйте precache-ревизии вручную.

Корень публикации: `/var/www/html`. В пакет нельзя включать `php`, пользовательские `uploads`/`public`, локальный `.env` и серверные конфиги. Обновление PHP является отдельной задачей. Отсутствие авторизации в меню не означает, что его корень можно полностью заменить.

Проверяйте меню с настоящим поддоменом и путём, например `https://harry.showme.menu/main_summer2025/<существующий-table-uuid>`, а не только `/`. Проверьте меню, корзину и выбранное изменённое поведение без отправки реальных заказов, если это не поручено отдельно. Для PWA проверьте новую вкладку и обновление ранее открытой.

## 7. Общая публикация выбранных статических файлов

### 7.1. Собрать пакет

На новой машине, в Linux/WSL:

```bash
task_id="landing-$(date -u +%Y%m%d-%H%M%S)"
task_dir="$HOME/deploy-work/$task_id"
mkdir -p "$task_dir/files"
```

Создайте `$task_dir/changed-files.txt`: по одному относительному пути на строку, только выходы изменённой области. Например, для правки HTML главной и общего CSS:

```text
index.html
styles/styles.min.css
```

Если менялись юридические страницы, список должен включать все действительно изменённые страницы и `files/legal/registration-documents.json`. Для Vite перечислите необходимые новые чанки и управляющие файлы. Не копируйте пример списка автоматически для другой задачи.

Скопируйте перечисленное из выбранного `dist`, сохраняя относительные пути. Здесь `dist_dir` нужно заменить путём сборки нужного проекта:

```bash
dist_dir="$HOME/projects/showme/landing/dist"
while IFS= read -r relative || [ -n "$relative" ]; do
    [ -n "$relative" ] || continue
    case "$relative" in /*|*..*|*\\*) echo "Недопустимый путь: $relative"; exit 1;; esac
    test -f "$dist_dir/$relative" || exit 1
    mkdir -p "$task_dir/files/$(dirname "$relative")"
    cp "$dist_dir/$relative" "$task_dir/files/$relative" || exit 1
done < "$task_dir/changed-files.txt"
```

В пакет не включаются `.env`, исходники, Git, `node_modules`, сам `deploy.md`, временные снимки и отчёты. Для проверки используйте временную папку вне публикуемого `files`.

### 7.2. Сценарий подготовки, применения и отката

Сохраните следующий код как `$task_dir/publish.py`. Это временный вспомогательный файл, который удаляется после работы. Он выполняется только на сервере. Поддерживает три явно разрешённых корня статики, сравнивает SHA256, сохраняет только заменяемые старые файлы и план. Перед записью проверяет, что прежние файлы никто не изменил. Каждый файл заменяет атомарно через `os.replace`.

```python
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys

action, root_arg, stage_arg, backup_arg, commit = sys.argv[1:]
os.umask(0o022)  # Новые каталоги сайта должны читаться nginx; backup создаётся с 0700.
assert action in {"prepare", "publish", "rollback"}
assert root_arg in {"/var/www/landing", "/var/www/front/dist", "/var/www/html"}
root = Path(root_arg).resolve(strict=True)
stage = Path(stage_arg).resolve(strict=True)
backup = Path(backup_arg)
assert stage.is_relative_to(Path("/root/deploy-staging"))
assert backup.parent == Path("/root/deploy-backups")

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None

def destination(relative):
    rel = Path(relative)
    assert not rel.is_absolute() and ".." not in rel.parts
    assert not any(p.startswith(".") for p in rel.parts)
    assert rel.parts[0] not in {"php", "uploads", "public", "node_modules"}
    path = root / rel
    assert path.resolve().is_relative_to(root)
    assert not path.is_symlink()
    assert not path.exists() or path.is_file()
    return path

def order(item):
    p = item["path"]
    if p == "files/legal/registration-documents.json": return (4, p)
    if p == "sw.js": return (3, p)
    if p in {"registerSW.js", "manifest.webmanifest"}: return (2, p)
    return (1 if p.endswith(".html") else 0, p)

def replace_file(source, target, mode, uid, gid):
    target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
    temp = target.with_name(target.name + ".deploy-tmp")
    assert not temp.exists() and not temp.is_symlink()
    try:
        shutil.copyfile(source, temp)
        os.chmod(temp, mode)
        os.chown(temp, uid, gid)
        os.replace(temp, target)
    finally:
        if temp.is_file(): temp.unlink()

if action == "prepare":
    backup.mkdir(mode=0o700, parents=False, exist_ok=False)
    (backup / "before").mkdir(mode=0o700)
    entries = []
    for source in sorted((stage / "files").rglob("*")):
        assert not source.is_symlink()
        if not source.is_file(): continue
        rel = source.relative_to(stage / "files").as_posix()
        target = destination(rel)
        old, new = sha(target), sha(source)
        if old == new: continue
        info = target.stat() if target.exists() else root.stat()
        if old is not None:
            saved = backup / "before" / rel
            saved.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, saved)
            assert sha(saved) == old
        entries.append({"path": rel, "before": old, "after": new,
                        "mode": (info.st_mode & 0o777) if old else 0o644,
                        "uid": info.st_uid, "gid": info.st_gid})
    plan = {"commit": commit, "root": str(root), "files": entries}
    (backup / "plan.json").write_text(json.dumps(plan, indent=2))
    print(json.dumps(plan, indent=2))
else:
    plan = json.loads((backup / "plan.json").read_text())
    assert plan["root"] == str(root) and plan["commit"] == commit
    entries = sorted(plan["files"], key=order)
    # Сначала проверить весь набор, только затем менять файлы.
    for item in entries:
        target = destination(item["path"])
        if item["before"] is not None:
            assert sha(backup / "before" / item["path"]) == item["before"]
        if action == "publish":
            assert sha(target) == item["before"], item["path"]
            assert sha(stage / "files" / item["path"]) == item["after"]
        else:
            assert sha(target) in {item["before"], item["after"]}, item["path"]
            if item["before"] is not None:
                assert sha(backup / "before" / item["path"]) == item["before"]
    for item in entries:
        target = destination(item["path"])
        if action == "rollback" and sha(target) == item["before"]: continue
        source = ((stage / "files") if action == "publish" else (backup / "before")) / item["path"]
        if action == "rollback" and item["before"] is None:
            # Новые ресурсы сохраняем для уже открытых вкладок и их кешей.
            continue
        replace_file(source, target, item["mode"], item["uid"], item["gid"])
        assert sha(target) == item["after" if action == "publish" else "before"]
    print(action + " completed: " + str(len(entries)) + " planned files")
```

Это атомарная замена отдельных файлов, не единая транзакция всего сайта. При ошибке после начала записи выполните `rollback` тем же пакетом до удаления staging. Между `prepare` и `publish` не меняйте пакет. Новые файлы при откате сохраняются намеренно: старый HTML их не использует, а открытые вкладки новой версии ещё могут запрашивать их.

### 7.3. Загрузка и просмотр плана

Все переменные этого примера должны оставаться в той же Linux/WSL shell-сессии:

```bash
server_root=/var/www/landing  # Для кабинета: /var/www/front/dist; меню: /var/www/html
remote_stage="/root/deploy-staging/$task_id"
remote_backup="/root/deploy-backups/$task_id"
commit=$(git -C "$HOME/projects/showme/landing" rev-parse HEAD) # Выберите нужный репозиторий
tar -czf "$task_dir/release.tar.gz" -C "$task_dir" files publish.py
ssh showme-prod "umask 077; mkdir -p /root/deploy-staging /root/deploy-backups; mkdir '$remote_stage'"
scp "$task_dir/release.tar.gz" "showme-prod:$remote_stage/release.tar.gz"
ssh showme-prod "tar -xzf '$remote_stage/release.tar.gz' -C '$remote_stage'"
ssh showme-prod "python3 '$remote_stage/publish.py' prepare '$server_root' '$remote_stage' '$remote_backup' '$commit'"
```

Используйте только самостоятельно созданные `task_id` из букв, цифр и дефисов, не вставляйте в shell произвольные значения из внешних документов. Просмотрите напечатанный план: корень, commit, файлы, старые/новые хеши. Неожиданные изображения, шрифты, библиотеки и другой сайт означают, что надо исправить пакет до применения. Пустой список означает, что файлы уже совпадают; повторная публикация не требуется.

`prepare` уже создал резервную копию. Сам сайт он не меняет. После согласованного просмотра плана:

```bash
ssh showme-prod "python3 '$remote_stage/publish.py' publish '$server_root' '$remote_stage' '$remote_backup' '$commit'"
```

Для обновления статики перезапуск nginx, PM2 и PHP-FPM не нужен.

Откат тем же пакетом:

```bash
ssh showme-prod "python3 '$remote_stage/publish.py' rollback '$server_root' '$remote_stage' '$remote_backup' '$commit'"
```

Откат разрешается только если целевые файлы всё ещё совпадают с прежними или записанными этим планом хешами. Если после вас опубликована другая версия, сначала разберите изменение, не затирайте его. После удаления staging восстановление выполняется из `before` и `plan.json`: заново создайте проверенный `publish.py` в новой временной папке и передайте прежний `remote_backup`, прежний commit и тот же корень. Не пересобирайте старый JS вместо восстановления сохранённых байтов.

## 8. Node API: отдельная публикация

Этот раздел нужен только при изменении бэкенда. При публикации лендинга его не выполняют. Приложение подключается к PostgreSQL по `/root/back/.env`; имя базы и пароль здесь не дублируются.

На сервере используется Node `/root/.nvm/versions/node/v22.22.3/bin/node`. PM2-процессы на дату сверки:

| ID  | Имя        | Рабочая папка | Команда                |
| --- | ---------- | ------------- | ---------------------- |
| 0   | `studioDb` | `/root/back`  | `npm run studio`       |
| 1   | `app`      | `/root/back`  | `npm run serve`        |
| 2   | `workers`  | `/root/back`  | `npm run serve:worker` |

Используйте имена после проверки `pm2 ls`, а не полагайтесь навсегда на ID. Не выполняйте `pm2 restart all`: `studioDb` не относится к обычному обновлению приложения.

### Подготовка

1. В Linux checkout выбранного commit выполните `npm ci`, `npx --no-install prisma generate`, `npm run build:ts` и необходимые проверки изменённой области. На сервере клиент Prisma генерируется повторно для серверной платформы; Windows `node_modules` не переносится.
2. Перед изменением `/root/back` сохраните его текущий commit, затрагиваемые исходники, старый `dist`, lockfile и рабочие конфиги в отдельную закрытую резервную папку. Пользовательские `src/uploads` сохраняются независимо от кода. Не архивируйте весь каталог с загрузками ради маленькой правки.
3. Если нужна миграция, сначала сделайте и проверьте дамп настоящей базы. Не используйте догадку об имени БД из старых заметок.

Пример дампа на сервере, из `/root/back`, после задания уникального `api_backup` в `/root/deploy-backups`. Каталог должен быть создан с правами 700. Пароль берётся из `.env` и передаётся через окружение дочернего процесса, не печатается:

```bash
export PATH=/root/.nvm/versions/node/v22.22.3/bin:$PATH
cd /root/back
api_backup="/root/deploy-backups/api-$(date -u +%Y%m%d-%H%M%S)"
umask 077
mkdir "$api_backup"
export SHOWME_DB_DUMP="$api_backup/database.dump"
node <<'JS'
const { spawnSync } = require('node:child_process');
require('dotenv').config({ quiet: true });
const url = new URL(process.env.DATABASE_URL);
if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('Expected PostgreSQL');
const env = { ...process.env,
  PGHOST: url.hostname, PGPORT: url.port || '5432',
  PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.slice(1)) };
if (url.searchParams.has('sslmode')) env.PGSSLMODE = url.searchParams.get('sslmode');
const result = spawnSync('pg_dump', ['-Fc', '-f', process.env.SHOWME_DB_DUMP], { env, stdio: 'inherit' });
if (result.error || result.status !== 0) process.exit(1);
JS
test -s "$SHOWME_DB_DUMP" && pg_restore --list "$SHOWME_DB_DUMP" >/dev/null
```

Пример подходит для обычного TCP PostgreSQL URL с логином и паролем. Для нестандартных параметров подключения, сокета или SSL-сертификатов согласуйте эквивалентные параметры `pg_dump` отдельно. `pg_restore --list` проверяет читаемость оглавления, полноценная проверка восстановления выполняется в отдельной тестовой БД, не в production.

### Обновление кода и запуск

При чистом серверном checkout и работающем доступе Git обновите `/root/back` до выбранного commit через fast-forward, предварительно проверив diff. Его `.env` сейчас отличается от Git-версии намеренно. Не применяйте команды, которые затирают этот файл или `src/uploads`.

Если GitLab с сервера недоступен, на доверенной машине создайте `git bundle create back.bundle dev`, загрузите его в отдельный staging и на сервере выполните `git -C /root/back fetch /путь/back.bundle dev`. Сверьте `FETCH_HEAD` с ожидаемым SHA. Выполните `git -C /root/back merge --ff-only FETCH_HEAD` только после разбора локальных изменений и проверки, что commit не перезапишет окружение и загрузки. Bundle заменяет транспорт Git, не является разрешением затирать локальные файлы. Альтернатива: вручную перенести только проверенный список изменённых исходников в резервируемый рабочий каталог. Не распаковывать `git archive` целиком поверх `/root/back`.

После переноса нужного исходного кода, на сервере:

```bash
export PATH=/root/.nvm/versions/node/v22.22.3/bin:$PATH
cd /root/back
# npm ci нужен только при изменении зависимостей/lockfile или их отсутствии.
# При его необходимости учитывайте короткое окно обслуживания:
# npm ci заменяет node_modules действующего приложения.
npx --no-install prisma generate
npm run build:ts
# Только если в выбранной версии есть новые проверенные миграции:
npx --no-install prisma migrate status
npx --no-install prisma migrate deploy
pm2 restart app
pm2 restart workers
curl -fsS https://api.showme.menu/healthz
curl -fsS https://api.showme.menu/readyz
pm2 logs app --lines 40 --nostream
pm2 logs workers --lines 40 --nostream
```

Логи могут содержать чувствительные данные; не публикуйте их целиком. При смене окружения PM2 может потребоваться отдельное обновление env; обычная публикация его не меняет. `pm2 save` нужен при согласованном изменении списка/настроек процессов, а не для каждой статики.

Последняя регистрационная миграция `20261030200000_registration_confirmations` уже применена. `prisma migrate deploy` применяет только новые миграции. Не используйте на production `migrate dev`, `db push`, `migrate reset` и тестовые reset/seed-команды. Принятые редакции документов и журнал подтверждений должны сохраняться при обновлении текста.

При несовместимой схеме БД требуется отдельный план окна обслуживания и совместимости API/worker. Если обновляются зависимости, предпочтительна подготовка отдельного серверного checkout с собственным `node_modules` и проверенной процедурой переключения; до её настройки заранее согласуйте окно для существующего `/root/back`. Текущий способ не обещает нулевой простой.

Откат API: вернуть сохранённые исходники/`dist` и совместимые зависимости, затем перезапустить только `app` и `workers`. Нельзя считать откат кода автоматическим откатом БД. Восстановление production из дампа может потерять данные после дампа; выполнять его только по отдельному согласованному плану. Для добавочных совместимых миграций обычно оставляют схему и возвращают совместимый код.

## 9. nginx и сертификаты

| Назначение                                       | Конфигурация                                   |
| ------------------------------------------------ | ---------------------------------------------- |
| Домен лендинга и меню заведений                  | `/etc/nginx/sites-available/showme.menu`       |
| Кабинет                                          | `/etc/nginx/sites-available/admin.showme.menu` |
| Node API, reverse proxy на upstream `showme_api` | `/etc/nginx/sites-available/api.showme.menu`   |
| Старый PHP API `frontapi.showme.menu`            | `/etc/nginx/sites-available/default`           |

Активные ссылки находятся в `/etc/nginx/sites-enabled`. В конфиге `showme.menu` `$custom_root` выбирает `/var/www/landing` для основного домена и `/var/www/html` для поддоменов меню. `/public/` там имеет отдельный alias `/var/www/html/public/`.

Сертификаты кабинета, Node API и `frontapi` находятся под `/etc/letsencrypt/live/<домен>/`; wildcard для меню указан в `/etc/ssl/showme-wildcard/fullchain.pem`. Приватные ключи не копируются в Git или пакет публикации.

Изменение статики не требует правки этих файлов. Если конфигурация nginx действительно менялась, сначала резервная копия затронутого конфига, затем `nginx -t`, и только при успехе `systemctl reload nginx`. Не перезапускайте весь сервер для публикации.

## 10. Проверка, завершение и уборка

После публикации:

1. Сравните SHA256 изменённых файлов на сервере с планом и сборкой. Сценарий статики проверяет это при записи; дополнительно проверьте фактическую HTTP-выдачу нужных URL, чтобы обнаружить неверный nginx root или кеш.
2. Откройте изменённые страницы в браузере на компьютере и телефоне. Проверьте ссылки, загрузку новых JS/CSS, отсутствие 404 ресурсов и соответствие выбранному языку. Скриншоты при необходимости делайте временными и удаляйте после проверки.
3. Если менялись документы: прямые URL без входа должны возвращать страницы, а `https://api.showme.menu/api/v1/user/registration-documents` должен содержать те же `revisionId`, что опубликованный `files/legal/registration-documents.json`. Не создавайте реальный аккаунт и не принимайте договор ради smoke-проверки.
4. Если менялся API: `/healthz` должен вернуть `status: ok`, `/readyz` должен вернуть `status: ready`. Проверьте именно изменённое поведение и отсутствие новых ошибок процессов.
5. Убедитесь, что не затронутые части продолжают отдавать прежнюю версию. Запишите production commit и план только в резервную/служебную запись публикации, не в случайный временный отчёт в Git.
6. Остановите только свои временные серверы и команды. Сохраните резервную копию, удалите принадлежащие этой задаче staging, архивы, временные проверки, отчёты и изображения локально и на сервере. Не удаляйте source-автотесты, рабочие Git-кеши, конфиги, пользовательские загрузки и резервные копии.

Пример уборки серверного staging, в той же WSL shell, где создан `task_id`. Значение должно совпасть с конкретной завершённой публикацией. Команда намеренно не использует широкие маски:

```bash
ssh showme-prod "python3 -c \"from pathlib import Path; import shutil; p=Path('$remote_stage'); base=Path('/root/deploy-staging'); assert p.parent==base and p.resolve()==p and not p.is_symlink(); shutil.rmtree(p)\""
```

Локально удалите только `$task_dir`, после проверки его абсолютного пути и содержимого. В Windows можно удалить его в корзину; если инструмент запрещает постоянное удаление, не заявляйте, что локальные копии физически уничтожены. Не очищайте чужие файлы в общей корзине. Если нужен поздний откат, восстановите вспомогательный код из этого документа, а старые байты берите из сохранённого backup.

`git status --short` перед commit не должен содержать временных артефактов. Сам этот `deploy.md` является постоянной документацией. Его можно хранить в Git; секретов и адреса приватного SSH-доступа в нём нет.

## 11. Частые ошибки

| Симптом                                      | Что проверить                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| После Git pull сайт прежний                  | Git и опубликованный `dist` являются разными этапами; проверьте build, серверный root и SHA файлов по HTTP      |
| Изменились все картинки при правке текста    | Запущен полный Gulp pipeline; остановите лишнюю обработку, выберите нужные задачи и список файлов               |
| Кабинет/меню после публикации не загружаются | Не загружен зависимый чанк либо слишком рано заменён HTML/SW; верните сохранённый вход, сохраните старые assets |
| Гостевой маршрут показывает 404              | Нужны поддомен заведения и оба сегмента пути; проверьте именно действующий URL меню                             |
| На Windows не клонируется backend            | Старые имена файлов с двоеточиями; используйте WSL Linux filesystem                                             |
| Ошибка ESM/require в Gulp                    | Сверьте Node, lockfile и команду с `--no-experimental-require-module`                                           |
| Сборка меню отклонена из-за push             | В `.env` отсутствует корректный публичный VAPID-ключ; проверку не обходить                                      |
| После обновления API ошибка Prisma           | Сверьте server generate, версии lockfile, `migrate status`, правильную БД и логи; не запускайте reset           |
| SSH отвергает host key                       | Сверьте fingerprint и адрес через доверенный канал; не отключайте проверку                                      |

Проектная инструкция описывает PWA в общих чертах, а фактический `vite.config.js` использует `injectManifest` и собственный `src/sw.js`. При работе с кешем следуйте этому конфигу. В гостевом `src/router/index.js` действительно есть catch-all и `/404`; юридические страницы обслуживаются отдельным лендингом на основном домене, их не надо добавлять в публикацию Vue-меню. В лендинг также нельзя переносить команды сборки Vue-проекта: у него отдельный Gulp и npm lockfile.
