import * as fs from 'fs';
import * as https from 'https';



/**
 *
 *
 * @export
 * @class FileReader
 * La classe FileReader permette di leggere i file in modo asincrono, rimuovere i tag HTML e la punteggiatura,
 * e calcolare il numero di parole, lettere, spazi e parole ripetute.
 * 
 * Usa il pattern singleton per garantire che ci sia una sola istanza di FileReader.
 */
export class FileReader {

    private static instance: FileReader;
    private constructor() {}
  // get the FileReader instance
    public static getInstance(): FileReader {
      if (!FileReader.instance) {
        FileReader.instance = new FileReader();
      }
      return FileReader.instance;
    }
  
/**
 *
 *
 * @param {string} path
 * @return {*}  {Promise<string>}
 * @memberof FileReader
 * 
 * Legge il file di input e si assicura, se è una pagina web di ricevere una risposta 200 ok
 */
public readFile(path: string): Promise<string> {
      return new Promise((resolve, reject) => {
        // I check if the path is a web address, if it is I have to make sure to receive a 200 response
        if (path.startsWith('http')) {
          https.get(path, (res) => {
            if (res.statusCode !== 200) {
              reject(new Error(`Status Code: ${res.statusCode}`));
            }
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              resolve(data);
            });
          }).on('error', (err) => {
            reject(err);
          });
        } else {
          fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(data);
            }
          });
        }
      });
    }

  // I create a regular expression to identify the HTML tags and replace them with an empty string
    public removeTag(str: string): string {
      let regex = /<[^>]+>/g;
      return str.replace(regex, "");
    }


    // Sort the record by key in alphabetical order
    public sortAlpha(rec: Record<string, any>): Record<string, any> {
      let keys = Object.keys(rec);
      keys.sort();
      let sortedRec = keys.reduce((result: Record<string, any>, key: string) => {
        result[key] = rec[key];
        return result;
      }, {}); 
      return sortedRec;
    }
    
    // Sort the record by entries in numerical order
    public sortNum(rec: Record<string, any>): Record<string, any> {
      let entries = Object.entries(rec);
      entries.sort((a, b) => b[1] - a[1]);
      let sortedRec = entries.reduce((result: Record<string, any>, entry: [string, any]) => {
        result[entry[0]] = entry[1];
        return result;
      }, {}); 
    return sortedRec;
    }


    // Define the public method that calculates the required statistics on a file and returns an object
    // I split the text into lines and iterate over each line;
    // I split the line using spaces and update the word counter
    // I iterate over each word to update the letter counter
    // I check if the word is already present I update the count otherwise I set it to 1. The words are compared using toLocaleLowerCase
    // at the end if a word is present more than 10 times I add it to the record for the words that exceed 10 repetitions.
    public calculateWords(file: string): Record<string, any> {
      
      let wordCount = 0;
      let letterCount = file.match (/[a-zA-Z]/g)?.length ?? 0;
      let spaceCount = file.match (/ /g)?.length ?? 0;
      let wordFrequency: Record<string, number> = {};
      let repeatedWords: Record<string, number> = {};
      let lines = file.split('\n');

      for (let line of lines) {
        let words = line.split(' ');

        for (let word of words) {
          if(word.match(/[a-zA-Z]/g)?.length ?? 0 !== 0){
            wordCount++;
          if (wordFrequency[word.toLocaleLowerCase()]) {
            wordFrequency[word.toLocaleLowerCase()]++;
          }
          else {
            wordFrequency[word.toLocaleLowerCase()] = 1;
          }
        }
      }
      }

      for (let word in wordFrequency) {
        if (wordFrequency[word] > 10) {
          repeatedWords[word] = wordFrequency[word];
        }
      }

      return {
        wordCount,
        letterCount,
        spaceCount,
        repeatedWords,
      };
    }
}
