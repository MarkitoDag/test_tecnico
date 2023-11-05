"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReader = void 0;
var fs = require("fs");
var https = require("https");
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
var FileReader = /** @class */ (function () {
    function FileReader() {
    }
    // get the FileReader instance
    FileReader.getInstance = function () {
        if (!FileReader.instance) {
            FileReader.instance = new FileReader();
        }
        return FileReader.instance;
    };
    /**
     *
     *
     * @param {string} path
     * @return {*}  {Promise<string>}
     * @memberof FileReader
     *
     * Legge il file di input e si assicura, se è una pagina web di ricevere una risposta 200 ok
     */
    FileReader.prototype.readFile = function (path) {
        return new Promise(function (resolve, reject) {
            // I check if the path is a web address, if it is I have to make sure to receive a 200 response
            if (path.startsWith('http')) {
                https.get(path, function (res) {
                    if (res.statusCode !== 200) {
                        reject(new Error("Status Code: ".concat(res.statusCode)));
                    }
                    var data = '';
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', function () {
                        resolve(data);
                    });
                }).on('error', function (err) {
                    reject(err);
                });
            }
            else {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }
        });
    };
    // I create a regular expression to identify the HTML tags and replace them with an empty string
    FileReader.prototype.removeTag = function (str) {
        var regex = /<[^>]+>/g;
        return str.replace(regex, "");
    };
    // I create a regular expression to identify the punctuation and replace them with an empty string
    // also check if there is more than one space and if it is replace with only one.
    FileReader.prototype.removePunctuation = function (str) {
        var spaces = /\s+/g;
        str = str.replace(spaces, ' ');
        var punctuation = /[.,;:?!'\"(){}[\]\\=<>]/g;
        return str.replace(punctuation, '');
    };
    // Sort the record by key in alphabetical order
    FileReader.prototype.sortAlpha = function (rec) {
        var keys = Object.keys(rec);
        keys.sort();
        var sortedRec = keys.reduce(function (result, key) {
            result[key] = rec[key];
            return result;
        }, {});
        return sortedRec;
    };
    // Sort the record by entries in numerical order
    FileReader.prototype.sortNum = function (rec) {
        var entries = Object.entries(rec);
        entries.sort(function (a, b) { return b[1] - a[1]; });
        var sortedRec = entries.reduce(function (result, entry) {
            result[entry[0]] = entry[1];
            return result;
        }, {});
        return sortedRec;
    };
    // Define the public method that calculates the required statistics on a file and returns an object
    // I split the text into lines and iterate over each line;
    // I split the line using spaces and update the word counter
    // I iterate over each word to update the letter counter
    // each word corresponds to a space, so I also update that
    // I check if the word is already present I update the count otherwise I set it to 1. The words are compared using toLocaleLowerCase
    // at the end if a word is present more than 10 times I add it to the record for the words that exceed 10 repetitions.
    FileReader.prototype.calculateWords = function (file) {
        var wordCount = 0;
        var letterCount = 0;
        var spaceCount = 0;
        var wordFrequency = {};
        var repeatedWords = {};
        var lines = file.split('\n');
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var words = line.split(' ');
            wordCount += words.length;
            for (var _a = 0, words_1 = words; _a < words_1.length; _a++) {
                var word = words_1[_a];
                letterCount += word.length;
                spaceCount++;
                if (wordFrequency[word.toLocaleLowerCase()]) {
                    wordFrequency[word.toLocaleLowerCase()]++;
                }
                else {
                    wordFrequency[word.toLocaleLowerCase()] = 1;
                }
            }
        }
        // Subtract 1 from the variable spaceCount to eliminate the final space
        spaceCount--;
        for (var word in wordFrequency) {
            if (wordFrequency[word] > 10) {
                repeatedWords[word] = wordFrequency[word];
            }
        }
        return {
            wordCount: wordCount,
            letterCount: letterCount,
            spaceCount: spaceCount,
            repeatedWords: repeatedWords,
        };
    };
    return FileReader;
}());
exports.FileReader = FileReader;
