//jshint esversion:6


module.exports.getDate = getDate;           //we exporting it to any file that require it

function getDate() {
    var today = new Date();

    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var currentDay = today.getDay()
    //var day = "";
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return  today.toLocaleDateString("en-US", option);


    
}


exports.getDay = function () {           //you can use export instead of module.export

    let today = new Date();

    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currentDay = today.getDay()
    //var day = "";
    let option = {
        weekday: "long",
        
    };

    return  today.toLocaleDateString("en-US", option);


    
}

console.log(module.exports);

