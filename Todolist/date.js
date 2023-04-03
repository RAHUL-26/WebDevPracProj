
// module.exports = getDate;
module.exports.getDate = getDate;


function getDate(){
let date = new Date();

let options = {
    weekday:"long",
    day: "numeric",
    month: "long"
};


let day = date.toLocaleDateString("en-US",options);

return day;
}

//we can remove the module word
exports.getDay = function (){
    let date = new Date();
    
    let options = {
        weekday:"long",
    };
    
    return date.toLocaleDateString("en-US",options); 
 }