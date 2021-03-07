/**
 * Created by Rajinda Waruna on 25/04/2018.
 */

agentApp.factory('veery_video_phone', function (videoFrameComService, authService) {
    var ui_events = {};
    videoFrameComService.onMessage(function (messageStr) {
        let message = JSON.parse(messageStr);

        if (ui_events.onMessage) {
            switch (message.type) {
                case "IncomingCall":
                    ui_events.onMessage(getUIEvent({ veery_command: "SetStrategy", isVideo: true }));
                    ui_events.onMessage(getUIEvent({ veery_command: "IncomingCall", number:  message.body.cid_number}));

                    // var msg = {
                    //     "veery_command": "IncomingCall",
                    //     "description": "IncomingCall - " + sRemoteNumber,
                    //     "number": sRemoteNumber
                    // };
                    // switch to video page
                    window.dispatchEvent(new Event("OpenVideoCall"));
                    break;
                case "AnswerCall":
                    ui_events.onMessage(getUIEvent({ veery_command: "AnswerCall" }));
                    break;
                case "EndCall":
                    ui_events.onMessage(getUIEvent({ veery_command: "EndCall" }));
                    ui_events.onMessage(getUIEvent({ veery_command: "SetStrategy", isVideo: false }));
                    break;
                case "MuteCall":
                    ui_events.onMessage(getUIEvent({ veery_command: "MuteCall" }));
                    break;
                case "UnmuteCall":
                    ui_events.onMessage(getUIEvent({ veery_command: "UnmuteCall" }));
                    break;
                case "VideoOn":
                    ui_events.onMessage(getUIEvent({ veery_command: "VideoOn" }));
                    break;
                case "VideoOff":
                    ui_events.onMessage(getUIEvent({ veery_command: "VideoOff" }));
                    break;
            }
        }
    });

    var getUIEvent = function(msgObject){
        return {data: JSON.stringify(msgObject)};
    }

    window.addEventListener('OpenedVideoCall', function() {
        ui_events.onMessage(getUIEvent({ veery_command: "InitFrame" }));
    });

    return {
        getName: function () {
            return 'veery_video_phone';
        },
        resetPhone: function (key) {
            videoFrameComService.resetFrame();
        },
        autoAnswer: function (key, delay) {

        },
        initFrame: function () {
            let frame = $('iframe').get(0);
            let domain = baseUrls.videoCallDomain;
            let token = authService.TokenWithoutBearer();
            videoFrameComService.initFrame(frame, domain, token);
        },
        subscribeEvents: function (events) {
            ui_events = events;
            // open iframe;
            window.dispatchEvent(new Event("OpenVideoCall"));
        },
        unsubscribeEvents: function () {
            ui_events = {};
        },
        incomingCall: function (key, number) {
            // videoFrameComService.sendMessage("incomingCall"); 
        },
        makeCall: function (key, number, my_id) {

        },
        answerCall: function (key, session_id) {
            videoFrameComService.sendMessage("answerCall");
        },
        rejectCall: function (key, session_id) {
            videoFrameComService.sendMessage("rejectCall");
        },
        endCall: function (key, session_id) {
            videoFrameComService.sendMessage("endCall");
        },
        etlCall: function (key, session_id) {

        },
        transferCall: function (key, session_id, number, callref_id) {
            videoFrameComService.sendMessage("transferCall");
        },
        transferIVR: function (key, session_id, number, callref_id) {

        },
        swapCall: function (key, session_id) {

        },
        holdCall: function (key, session_id) {

        },
        unholdCall: function (key, session_id) {

        },
        muteCall: function (key, session_id) {
            videoFrameComService.sendMessage("muteCall");
        },
        unmuteCall: function (key, session_id) {
            videoFrameComService.sendMessage("unmuteCall");
        },
        conferenceCall: function (key, session_id) {

        },
        freezeAcw: function (key, session_id) {

        },
        endFreeze: function (key, session_id) {

        },
        endAcw: function (key, session_id) {

        },
        send_dtmf: function (key, session_id, dtmf) {

        },
        unregister: function (key) {

        },
        phone_mode_change: function (key, mode) {

        }
    };
});