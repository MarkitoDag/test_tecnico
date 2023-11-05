import { FileReader } from './file_reader';
import * as readline from 'readline';


async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // create a function that returns a promise that resolves with the user input
  function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  // create a boolean variable to check if I have to repeat the input it will be set to false only if the command was successful
  let repeat = true;
console.log()
  while (repeat) {
    
    let input = await ask('Enter a command, a path, or “help” for options: ');

    let fileReader = FileReader.getInstance();

// I used some if statements to handle the commands both to avoid running a useless for loop and because this way I am sure to remove the tags first
// otherwise removing the punctuation first there would have been problems with the removal of the tags.
// also I can first create the records of the words and then reorder them, otherwise I would have had to ask for two separate commands.


    try {
      let command = input.split(' ');
      if(command.includes('-c')){
repeat = false;
continue;
      }
      if (command.includes('help')) {
        console.log(`

To analyze a text in a web page or file, enter its URL as the last argument of the command.

You can also use some optional flags to modify the output:

-rt   This flag removes all HTML tags from the web page. 
      Use it if you want to see the statistics of the words that are visible on the page not the raw HTML.
-sa   This flag sorts the words that appear more than ten times in alphabetical order.
-sn   This flag sorts the words that appear more than ten times from the most frequent to the least frequent.   
-c    This flag terminates the execution of the program.
            
If you use both -sa and -sn flags, the output will be sorted by frequency.
      
Example: -rt -rp -sa https://it.wikipedia.org/wiki/Pagina_principale
      
      `);


        repeat = true;
      } else {
        repeat = false;

        let file = await fileReader.readFile(command[command.length - 1]);
        command.pop();

        if (command.includes('-rt')) {
          console.log('-rt');
          file = fileReader.removeTag(file);
        }

        let stats = fileReader.calculateWords(file);

        if (command.includes('-sa')) {
          console.log('-sa');
          stats.repeatedWords = fileReader.sortAlpha(stats.repeatedWords);
        }

        if (command.includes('-sn')) {
          console.log('-sn');
          stats.repeatedWords = fileReader.sortNum(stats.repeatedWords);
        }

        console.log('Total number of words in the file:', stats.wordCount);
        console.log('Number of letters in the file:', stats.letterCount);
        console.log('Number of spaces in the file', stats.spaceCount);
        console.log(
          'Words that repeat more than 10 times and the number of times they repeat:'
        );
        for (let word in stats.repeatedWords) {
          console.log(word, ':', stats.repeatedWords[word]);
        }
      }
    } catch (err) {
      console.error(
        `
I could not read the path because of an error,
make sure you have written the path correctly and have the necessary permissions.

Type help to view the commands or -c to terminate.

      `);

      repeat = true;
    }
  }
rl.close()}


run();