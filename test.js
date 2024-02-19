'use strict'; 
import puppeteer from 'puppeteer';
import fs from 'fs';

const path = './images/33333/';

fs.promises.mkdir(path, { recursive: true }).catch(console.error);


