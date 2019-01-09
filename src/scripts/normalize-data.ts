import { getLanguages, getNames, getNameInfo } from "../data";
import { getDataFileLines, saveDataFileLines } from "./common";
import { uniq } from "../utils";

function start() {
    const languages = getLanguages();
    const names = getNames();

    for (const lang of languages) {
        for (const name of names) {
            let lines: string[];
            try {
                lines = getDataFileLines(lang, name);
            } catch (e) {
                console.log(e.message);
                continue;
            }
            const info = getNameInfo(name);
            if (!info) {
                throw new Error(`Invalid name: ${name}`);
            }

            if (info.insensitive) {
                lines = lines.map(line => line.trim().toLowerCase());
            }
            if (info.sort) {
                lines = lines.sort();
            }

            lines = uniq(lines);

            saveDataFileLines(lang, lines.join('\n'), name);
        }
    }
}

start();
