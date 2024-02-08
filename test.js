import fs from 'fs';

let obj = {
    table: []
};

obj.table.push({id: 1, square:2});

let json = JSON.stringify(obj);


try {
      const data = fs.writeFileSync('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', json, 'utf8');
    } catch (err) {
      console.error(err)
    }


try {
      const d = fs.readFileSync('/Users/rualeksandr/Development/web-scraper-nodejs/data.json')
      console.log(`d: ${d}`)
    } catch (err) {
      console.error(err)
    }







// try {
//     const data = fs.writeFileSync('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', json, 'utf8', callback);
//     console.log('dd')
// } catch (err) {
//     console.error(err)
// }

// fs.readFile('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', 'utf8', function readFileCallback(err, data){
//     if (err){
//         console.log(err);
//     } else {
//     obj = JSON.parse(data); //now it an object
//     obj.table.push({id: 2, square:3}); //add some data
//     json = JSON.stringify(obj); //convert it back to json
//     fs.writeFile('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', json, 'utf8', callback); // write it back 
// }});








// const content = toString({data:{
//     '1':'www',
// }})
// try {
//   const data = fs.writeFileSync('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', content);
//   console.log('jj')
//   //файл записан успешно
// } catch (err) {
//   console.error(err)
// }
























// let idsOld = [
//     '3237186843', '3589418408', '3493153301', '3428745777',
//     '3653158212', '3653274938', '3301267322', '3236748941',
//     '3557137400', '3589367416', '3653388105', '3652662349',
//     '3620787364', '3653081091', '3653467917', '3652644016',
//     '3653369406', '2820815888', '3653268992', '3493525162',
//     '3557033868', '3557378693', '3109190389', '2853556945',
//     '3204898715', '3621433222', '3620989720', '3557003808',
//     '3557216273', '3620727129', '3205629816', '3460841141',
//     '3461315177', '3621315422', '3620804787', '3620957107',
//     '3556997679', '3621459464', '2821405488', '3396732569',
//     '3621423535', '3621635466', '3525427392', '3621344220',
//     '3524892852', '3525634062', '3621539823', '2853598789',
//     '2949579633', '3365506109', '3077703677', '2949242251',
//     '2949489052', '2820935879', '3589302663', '3589507823',
//     '3589229703', '3588829470', '3525650283', '3588861785',
//     '3525449262', '3589221535', '3588775790', '3588942881',
//     '3301463022', '2821041045', '2949584036', '3237220546',
//     '3237373725', '3365648751', '3525211810', '3044833721',
//     '3493273423', '3429366357'
//   ]; // нет '3557366796', '3620873065', '3557443252', '3556741701',

//   let idsInIteration = [
//     '3237186843', '3589418408', '3493153301', '3428745777',
//     '3653158212', '3653274938', '3301267322', '3236748941',
//     '3557137400', '3589367416', '3653388105', '3652662349',
//     '3620787364', '3653081091', '3653467917', '3652644016',
//     '3653369406', '2820815888', '3653268992', '3493525162',
//     '3557033868', '3557378693', '3109190389', '2853556945',
//     '3204898715', '3621433222', '3620989720', '3557003808',
//     '3557366796', '3620873065', '3557443252', '3556741701',
//     '3557216273', '3620727129', '3205629816', '3460841141',
//     '3461315177', '3621315422', '3620804787', '3620957107',
//     '3621423535', '3621635466', '3525427392', '3621344220',
//     '3524892852', '3525634062', '3621539823', '2853598789',
//     '2949579633', '3365506109', '3077703677', '2949242251',
//     '2949489052', '2820935879', '3589302663', '3589507823',
//     '3589229703', '3588829470', '3525650283', '3588861785',
//     '3525449262', '3589221535', '3588775790', '3588942881',
//     '3301463022', '2821041045', '2949584036', '3237220546',
//     '3237373725', '3365648751', '3525211810', '3044833721',
//     '3493273423', '3429366357'
//   ]; // нет '3556997679', '3621459464', '2821405488', '3396732569',


// console.log(`Появились новые объявления: ${idsInIteration.filter(x => !idsOld.includes(x)).length} шт. - ${idsInIteration.filter(x => !idsOld.includes(x))}\n`);
// console.log(`Исчезли объявления: ${idsOld.filter(x => !idsInIteration.includes(x)).length} шт. - ${idsOld.filter(x => !idsInIteration.includes(x))}\n`);

// console.log(`Не изменильсь: ${idsOld.filter(x => idsInIteration.includes(x)).length} шт. - ${idsOld.filter(x => idsInIteration.includes(x))}\nНужно сравнить есть ли изменения среди них!`);



// let dataInIteration = {};

// console.log(Boolean(dataInIteration.ids))



