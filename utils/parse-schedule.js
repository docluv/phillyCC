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

sessions.forEach((session)=>{

    fs.writeFileSync(path.resolve("../data/sessions/" + session.id + ".json"), JSON.stringify(session), utf8);

    delete session.body;

    _sessions.push(session);

});

fs.writeFileSync(path.resolve("../public/api/philly-cc-schedule.json"), JSON.stringify(_sessions), utf8);
