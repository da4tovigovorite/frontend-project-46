import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { resolve } from 'node:path';
import _ from 'lodash';

const getFullFilePath = (filepath) => resolve(cwd(), filepath);
const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');


const genDiff = (filepath1, filepath2) => {

    const filePath1 = getFullFilePath(filepath1);
    const filePath2 = getFullFilePath(filepath2);

const obj1 = JSON.parse(readFileSync(filePath1, 'utf-8'));    
const obj2 = JSON.parse(readFileSync(filePath2, 'utf-8'));


//console.log(obj1);
//console.log(obj2);


const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
const keys = _.union(keys1, keys2);

const newKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

  const resultAdd = [];
  const resultDeleted = [];
  const resultChanged = [];
  const resultUnchanged = [];
  for (const key of keys) {
    if (!Object.hasOwn(obj1, key)) {
        resultAdd.push({[key]: obj2[key], prefix: '+'});
    } else if (!Object.hasOwn(obj2, key)) {
        resultDeleted.push({[key]: obj1[key], prefix: '-'});
    } else if (obj1[key] !== obj2[key]) {
        resultChanged.push({[key]: obj1[key], prefix: '-'});
        resultChanged.push({[key]: obj2[key], prefix: '+'});
    } else {
        resultUnchanged.push({[key]: obj1[key], prefix: ' '});
    }
  };
  


const diff = {
    children: [
        {   name: 'added',
            elements: resultAdd,
        },

        {   name: 'deleted',
            elements: resultDeleted,
        },

        {   name: 'changed',
            elements: resultChanged,
        },

        {   name: 'unchanged',
            elements: resultUnchanged,
        }

    ]
};





    


const preObjects = diff.children.reduce((acc, curr) => {
    acc.push(...curr.elements);
    return acc;
  }, []);

const sortedObjects = _.sortBy(preObjects, obj => Object.keys(obj)[0]);
console.log(sortedObjects);
console.log(`{`);

sortedObjects.map(item => {
  const keys = Object.keys(item);
  console.log(`  ${item.prefix}  ${keys[0]}: ${item[keys[0]]}`);
});

console.log(`}`);


};

export default genDiff;