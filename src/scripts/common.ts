import { join } from "path";
import { writeFileSync, readFileSync } from "fs";
import { outputFile } from 'fs-extra';

export function saveDataFileLines(lang: string, data: string, fileName: string) {
    const file = join(__dirname, '..', '..', 'data', lang, fileName);
    writeFileSync(file, data, 'utf8');
}

export function getDataFileLines(lang: string, fileName: string) {
    const file = join(__dirname, '..', '..', 'data', lang, fileName);
    let lines: string[] = readFileSync(file, 'utf8').split(/\s*\n\s*/g);
    return lines;
}

export async function saveDbTextFile(lang: string, data: string, fileName: string) {
    const file = join(__dirname, '..', '..', 'db', 'texts', lang, fileName);
    await outputFile(file, data, 'utf8');
}
