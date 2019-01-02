import { join } from "path";
import { writeFileSync, readFileSync } from "fs";
import { outputFile } from 'fs-extra';
import { createHash } from "crypto";

export function md5(value: string): string {
    return createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
}

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

export function getDbTextFiles(lang: string, count: number) {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
        list.push(getDbTextFile(lang, `${i}.txt`));
    }

    return list;
}

export function getDbTextFile(lang: string, fileName: string) {
    const file = join(__dirname, '..', '..', 'db', 'texts', lang, fileName);
    return readFileSync(file, 'utf8');
}
