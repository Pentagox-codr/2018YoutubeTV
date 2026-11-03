 var currentHost = window.location.hostname;
        var currentPort = window.location.port;

        var APP_URL = "http://" + currentHost + ":" + (currentPort || "8090");  
        var PROXY_URL = "http://create.nyl.qzz.io"; 

        console.log("APP_URL:", APP_URL);
        console.log("PROXY_URL:", PROXY_URL);