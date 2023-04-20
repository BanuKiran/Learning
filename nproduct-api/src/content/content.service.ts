import * as fs from 'fs';
export interface Notes {
    title: string;

}
export const listContent = () => {
    try {

        const dataBuffer = fs.readFileSync("src/content/content.json");
        const dataJSON = dataBuffer.toString();

        return JSON.parse(dataJSON);
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const test = async (): Promise<string> => {
    return "hi";
};
