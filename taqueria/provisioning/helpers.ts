// import type developmentStateJson from "../.taq/development-state.json";
import fs from "fs/promises";
import path from "path";

export const getFileInfo = async (filePath: string) => {
    return await fs.stat(path.join(process.cwd(), filePath));
}

export const getDirectoryFiles = async (dirPath: string): Promise<string[]> => {
    const absDirPath = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
    const results = await fs.readdir(absDirPath, { withFileTypes: true });
    const allFiles = [
        ...results.filter(x => x.isFile()).map(x => path.join(absDirPath, x.name)),
        ...(await Promise.all(
            results.filter(x => x.isDirectory()).map(async x =>
                await getDirectoryFiles(path.join(absDirPath, x.name))
            ))).flatMap(x => x)
    ];
    return allFiles;
}


export const normalizeProvisionName = (provisionName: string) => {
    return provisionName.replace(/[^a-zA-Z0-9]+/g, '_')
};