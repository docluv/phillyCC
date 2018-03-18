const fs = require("fs"),
    path = require("path"),
    mustache = require("mustache"),
    utf8 = "utf-8";


//read content/article
let sessions = fs.readFileSync(path.resolve("../data/philly-cc-schedule.json"), utf8),
    appShell = fs.readFileSync(path.resolve("../public/html/app-shell.html"), utf8),
    sessionTemplate = fs.readFileSync(path.resolve("../public/templates/session.html"), utf8);

sessions = JSON.parse(sessions);

let _sessions = [],
    _sessions830 = [],
    _sessions1000 = [],
    _sessions1130 = [],
    _sessions1200 = [],
    _sessions1330 = [],
    _sessions1500 = [];

function renderSession(session) {

    let sessionShell = appShell.replace("<%template%>", sessionTemplate),
        html = mustache.render(sessionShell, session),
        folder = path.resolve("../public/session/" + session.slug),
        stats = fs.lstatSync(folder);

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder);

    }

    fs.writeFileSync(path.resolve("../public/session/" + session.slug + "/index.html"), html, utf8);

}

sessions.forEach((session) => {

    if (session.date.indexOf("2018-03-24") > -1) {

        fs.writeFileSync(path.resolve("../data/sessions/" + session.id + ".json"), JSON.stringify(session), utf8);

        switch (session.time) {

            case "08:30":

                _sessions830.push(session);

                break;

            case "10:00":

                _sessions1000.push(session);

                break;

            case "11:30":

                _sessions1130.push(session);

                break;

            case "12:00":

                _sessions1200.push(session);

                break;

            case "13:30":

                _sessions1330.push(session);

                break;

            case "15:30":

                _sessions1500.push(session);

                break;

            default:
                break;
        }

        renderSession(session);

    }

});

fs.writeFileSync(path.resolve("../public/api/0830.json"), JSON.stringify(_sessions830), utf8);
fs.writeFileSync(path.resolve("../public/api/1000.json"), JSON.stringify(_sessions1000), utf8);
fs.writeFileSync(path.resolve("../public/api/1130.json"), JSON.stringify(_sessions1130), utf8);
fs.writeFileSync(path.resolve("../public/api/1200.json"), JSON.stringify(_sessions1200), utf8);
fs.writeFileSync(path.resolve("../public/api/1330.json"), JSON.stringify(_sessions1330), utf8);
fs.writeFileSync(path.resolve("../public/api/1500.json"), JSON.stringify(_sessions1500), utf8);
