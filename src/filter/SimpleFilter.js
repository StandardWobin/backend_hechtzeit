import fs from "fs";

export class SimpleFilter {

    constructor(logger, languages) {
        this.logger = logger;
        this.languages = languages;
        this.badWords = [];
        this.load();
    }

    load() {
        // every word in this list will be filtered out
        let file = './src/filter/lists/words.json'
        let rawdata = fs.readFileSync(file);
        let words = JSON.parse(rawdata);

        this.languages.forEach(lang => {
            let temp = words[lang]
            if (temp !== undefined) {
                this.badWords = this.badWords.concat(temp)
            } else {
                throw Error("languge '" + lang + "' not in file: " + file)
            }
        })
    }

    sceneFilter(scene, skip, callback) {
        this.logger.trace("FILTER", scene.message);
        if (skip) {
            this.logger.trace("FILTER", "skipped");
            return callback(scene);
        }
        scene.message = this.filter(scene.message);
        scene.username = this.filter(scene.username);
        this.logger.trace("FILTER - filtered", scene.message);
        callback(scene);
    }

    _filter_helper(entitiy) {
        let entSave = entitiy;
        let lookdeeper = false;
        if (typeof entitiy === "string") {
            this.badWords.forEach(bw => {
                if (entitiy.toLowerCase().includes(bw)) {
                    lookdeeper = true;
                    entitiy = entitiy.toLowerCase().replace(bw, "*".repeat(bw.length))
                }
            })

            let new_ent = "";
            for (var i = 0; i < entitiy.length; i++) {
                if (entitiy[i] !== "*") {
                    new_ent = new_ent + entSave[i];
                } else {
                    new_ent = new_ent + "*";
                }
            }
            entitiy = new_ent;
            if (lookdeeper) {
                return this._filter_helper(entitiy);
            } else {
                return entitiy;
            }
        } else {
            return entitiy;
        }

    }
    filter(entitiy) {
        return this._filter_helper(entitiy)
    }
}