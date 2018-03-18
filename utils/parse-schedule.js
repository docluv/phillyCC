const fs = require("fs"),
    path = require("path"),
    utf8 = "utf-8";


//read content/article
let sessions = fs.readFileSync(path.resolve("../data/philly-cc-schedule.json"), utf8);

sessions = JSON.parse(sessions);

let _sessions = [],
    _sessions830 = [],
    _sessions1000 = [],
    _sessions1130 = [],
    _sessions1200 = [],
    _sessions1330 = [],
    _sessions1500 = [];

sessions.forEach((session) => {

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

});

fs.writeFileSync(path.resolve("../public/api/0830.json"), JSON.stringify(_sessions830), utf8);
fs.writeFileSync(path.resolve("../public/api/1000.json"), JSON.stringify(_sessions1000), utf8);
fs.writeFileSync(path.resolve("../public/api/1130.json"), JSON.stringify(_sessions1130), utf8);
fs.writeFileSync(path.resolve("../public/api/1200.json"), JSON.stringify(_sessions1200), utf8);
fs.writeFileSync(path.resolve("../public/api/1330.json"), JSON.stringify(_sessions1330), utf8);
fs.writeFileSync(path.resolve("../public/api/1500.json"), JSON.stringify(_sessions1500), utf8);
