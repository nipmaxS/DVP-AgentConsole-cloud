agentApp.factory('videoFrameComService', function () {
    let frameElement;
    let frameDoamin;
    let authToken;
    return {
        initFrame: function (frame, domain, token) {
            frameElement = frame;
            frameDoamin = domain;
            authToken = token;
        },
        resetFrame: function() {
            frameElement.contentWindow.location.reload();
        },
        sendMessage: function (msg) {
            frameElement.contentWindow.postMessage(msg, frameDoamin);
        },
        onMessage: function (callback) {
            window.addEventListener("message", (event) => {
                // Do we trust the sender of this message?
                if (event.origin !== frameDoamin)
                    return;

                if (callback)
                    callback(event.data);
                else
                    alert(event.data);
            }, false);
        },
        openIframe: function(callback) {
            callback();
        }
    };
});