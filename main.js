const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const cheakDir = (cyrrentDir, newDir) => {
    fs.exists(newDir, (exists) => {
        if (!exists) {
            fs.mkdir(newDir, (err) => {
                if (err) return console.log(err.message);
            });
        }
        readDir(cyrrentDir, newDir);
    })
}

const readDir = (cyrrentDir, newDir) => {
    fs.readdir(cyrrentDir, (err, data) => {
        if (err) return console.log(err.message);

        data.forEach(item => {
            let localBase = path.join(cyrrentDir, item);
            infoFile(localBase, newDir);
        })
    });
}

const infoFile = (localBase, newDir) => {
    fs.stat(localBase, (err, stats) => {
        if (err) return console.log(err.message);

        if (stats.isDirectory()) {
            readDir(localBase, newDir);
        } else {
            const fileName = path.basename(localBase);
            const catalog = path.join(newDir, fileName.charAt(0).toUpperCase());

            copyFile(localBase, catalog, fileName)
        }
    });
}

const copyFile = (localBase, catalog, fileName) => {
    fs.exists(catalog, (exists) => {
        if (!exists) {
            fs.mkdir(catalog, (err) => {
                fs.link(localBase, path.join(catalog, fileName), err => {
                    if (err) return console.log(err.message);
                });
            });
        }
    });
}



const init = () => {
    const argv = yargs
        .usage('Usage: $0 [option]')
        .help('help')
        .alias('help', 'h')
        .version('1.0.0')
        .alias('version', 'v')
        .example('$0 --entry 1 --src 2')
        .option('entry', {
            alias: 'e',
            describe: 'Путь к папке с файлами',
            default: './musik'
        })
        .option('src', {
            alias: 's',
            describe: 'Путь, где будет итоговая папка',
            default: './album'
        })
        .epilog('Сортировка музыки по папкам')
        .argv

    cheakDir(argv.entry, argv.src)
};

init();
