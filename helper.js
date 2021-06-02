module.exports.parseToNumbers = (str) => {
    const re = /[0-9\,km\.]+/
    const stringNumber = re.exec(str.toLowerCase())?.[0]
    if (!stringNumber) throw Error('wrong text test');
    console.log({stringNumber});
    if(stringNumber.includes('k')){
        return Number(stringNumber.replace(/[k\,]/g,'')) * 1000;
    }
    if(stringNumber.includes('m')){
        return Number(stringNumber.replace(/[k\,]/g,'')) * 1000000;
    }
    return Number(stringNumber.replace(/[k\,]/g,''));
}