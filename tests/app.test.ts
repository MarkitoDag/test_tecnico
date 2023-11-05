import { FileReader } from '../src/file_reader';
import { expect } from 'chai';
import 'mocha';

describe('FileReader', () => {
  let fileReader: FileReader;

  beforeEach(() => {
    fileReader = FileReader.getInstance();
  });

  it('should read a local file and return its content as a string', async () => {
    let path = 'tests/test.txt';
    let content = await fileReader.readFile(path);
    expect(content).to.be.a('string');
    expect(content).to.equal('Hello, world!');
  });

  it('should read a web file and return its content as a string', async () => {
    let path = 'https://raw.githubusercontent.com/microsoft/TypeScript/master/README.md';
    let content = await fileReader.readFile(path);
    expect(content).to.be.a('string');
    expect(content).to.include('TypeScript');
  });

  it('should throw an error if the file path is invalid', async () => {
    let path = './invalid.txt';
    try {
      await fileReader.readFile(path);
    } catch (err) {
      expect(err).to.be.an('error');
    //   expect(err.message).to.include('no such file or directory');
    }
  });

  it('should remove HTML tags from a string', () => {
    let str = '<p>This is a <strong>test</strong>.</p>';
    let result = fileReader.removeTag(str);
    expect(result).to.be.a('string');
    expect(result).to.equal('This is a test.');
  });


  it('should sort a record by key in alphabetical order', () => {
    let rec = {z: 1, a: 2, b: 3, c: 4};
    let result = fileReader.sortAlpha(rec);
    expect(result).to.be.an('object');
    expect(result).to.deep.equal({a: 2, b: 3, c: 4, z: 1});
  });

  it('should sort a record by entries in numerical order', () => {
    let rec = {a: 2, b: 3, c: 4, z: 1};
    let result = fileReader.sortNum(rec);
    expect(result).to.be.an('object');
    expect(result).to.deep.equal({c: 4, b: 3, a: 2, z: 1});
  });

  it('should calculate the word count, letter count, space count, and repeated words of a file', async () => {
    let path = 'tests/test.txt';
    let content = await fileReader.readFile(path);
    let result = fileReader.calculateWords(content);
    expect(result).to.be.an('object');
    expect(result).to.have.property('wordCount');
    expect(result).to.have.property('letterCount');
    expect(result).to.have.property('spaceCount');
    expect(result).to.have.property('repeatedWords');
    expect(result.wordCount).to.equal(2);
    expect(result.letterCount).to.equal(10);
    expect(result.spaceCount).to.equal(1);
    expect(result.repeatedWords).to.deep.equal({});
  });
});
