import fs from 'fs';
import {resolve}from 'path';
import {parse} from 'babyparse';
import {getFormatedDate} from '../utils/handleDate.js';
// import {concatAll} from '../utils/CollectionFunctions.js';

var postDirPath = resolve('../data/post');
var fanPageDirPath = resolve('../data/fanPage');

outputToJson('post', postDirPath);
outputToJson('fanPage', fanPageDirPath);

function outputToJson(name, dirName) {
    fs.readdir(dirName, (err, fileNames) => {
        var r = fileNames
            .map((file) => resolve(dirName, file))
            .map(proccessData)
            .filter(notEmptyObject)
            .reduce((acc, cur) => acc.concat(cur))
            .filter(notEmptyObject)
        write(name, r)
    });
}

function write(name, data) {
    fs.writeFile(`../output/${name}.json`,
        JSON.stringify(data, null, 4), (err) => {
            if (err) {
                console.log(err)
            };
            console.log("The filed is saved");
        });
}

function proccessData(path) {
    var dataStream = fs.readFileSync(path).toString();
    var parsedData = parse(dataStream);
    var attrs = parsedData.data[0].map(e => e.trim());
    var dataObjects = parsedData.data.slice(2);
    return dataObjects
        .map(e => {
            var o = {};
            attrs.forEach((attr, idx) => {
                if (filterAttr(attr, e[idx])) {
                    switch(attr) {
                        // case 'Post Message':
                        //     o['Country'] = attrSetter('Country', e[idx]);
                        //     break;
                        default:
                            o[attr] = attrSetter(attr, e[idx]);
                    }
                    
                }
            });
            return o;
        });
}

function filterAttr (attr, element) {
    if (element) {
        if (attr.match(/paid/ig) !== null) {
            return false;
        } else if (attr.match(/video/ig) !== null) {
            return false;
        }else if (attr.match(/28/ig) !== null){
            return false;
        }else if (attr.match(/weekly/ig) !== null){
            return false;
        } else {
            return true;
        }
    } else {
        return false
    }
}
function getPostsCountry (post) {
    var matcher = post.match(/^【(.+)】/);
    return matcher ? matcher[1] : post;
}
function attrSetter(attr, element) {
    switch (attr) {
        case 'Posted':
            return getFormatedDate(element);
        case 'Country':
            return getPostsCountry(element)
        default:
            return element;
    }
}

function notEmptyObject (obj) {
    return Object.keys(obj).length > 0;
}