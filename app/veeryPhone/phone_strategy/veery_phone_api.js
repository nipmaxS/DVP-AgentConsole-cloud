/**
 * Created by Rajinda Waruna on 25/04/2018.
 */

agentApp.factory('veery_phone_api', function ($injector) {

    let storage;
    let videoStorage;
    let activeStorage;

    var setStrategy = function (name) {
        storage = undefined;
        storage = $injector.get(name);
        activeStorage = storage;
    };

    var setVideoStrategy = function (name) {
        videoStorage = undefined;
        videoStorage = $injector.get(name);
    };

    var setActiveStrategy = function (isVideo) {
        activeStorage = isVideo ? videoStorage : storage;
    };

    return {
        setStrategy: setStrategy,
        setVideoStrategy: setVideoStrategy,
        setActiveStrategy: setActiveStrategy,

        // Strategy interface methods:
        getName: function () {
            return activeStorage.getName();
        },
        resetPhone:function (key) {
            return activeStorage.resetPhone(key);
        },
        autoAnswer: function (key,delay) {
            return activeStorage.autoAnswer(key,delay);
        },
        registerSipPhone:function (key,phone_setting) {
            return activeStorage.registerSipPhone(key,phone_setting);
        },
        subscribeEvents: function (events) {
            storage.subscribeEvents(events);
            videoStorage.subscribeEvents(events);
        },
        unsubscribeAfterFail: function (name) {
            try{
                var storage_temp = $injector.get(name);
                return storage_temp.unsubscribeEvents();
            }
            catch (ex){
                console.error(ex);
            }
        },
        unsubscribeEvents: function () {
            storage.unsubscribeEvents();
            videoStorage.unsubscribeEvents();
        },
        incomingCall:function (key,number) {
            return activeStorage.incomingCall(key,number);
        },
        makeCall: function (key,number,my_id) {
            return activeStorage.makeCall(key,number,my_id);
        },
        answerCall: function (key,session_id) {
            return activeStorage.answerCall(key,session_id);
        },
        rejectCall: function (key,session_id) {
            activeStorage.rejectCall(key,session_id);
        },
        endCall: function (key,session_id) {
            activeStorage.endCall(key,session_id);
        },
        etlCall: function (key,session_id) {
            return activeStorage.etlCall(key,session_id);
        },
        transferCall: function (key,session_id, number,callref_id) {
            return activeStorage.transferCall(key,session_id, number,callref_id);
        },
        transferIVR: function (key,session_id, number,callref_id) {
            return activeStorage.transferIVR(key,session_id, number,callref_id);
        },
        swapCall: function (key,session_id) {
            return activeStorage.swapCall(key,session_id);
        },
        holdCall: function (key,session_id) {
            return activeStorage.holdCall(key,session_id);
        },
        unholdCall: function (key,session_id) {
            return activeStorage.unholdCall(key,session_id);
        },
        muteCall: function (key,session_id) {
            return activeStorage.muteCall(key,session_id);
        },
        unmuteCall: function (key,session_id) {
            return activeStorage.unmuteCall(key,session_id);
        },
        conferenceCall: function (key,session_id) {
            return activeStorage.conferenceCall(key,session_id);
        },
        freezeAcw: function (key,session_id) {
            return activeStorage.freezeAcw(key,session_id);
        },
        endFreeze: function (key,session_id) {
            return activeStorage.endFreeze(key,session_id);
        },
        endAcw: function (key,session_id) {
            return activeStorage.endAcw(key,session_id);
        },
        send_dtmf: function (key,session_id,dtmf) {
            return activeStorage.send_dtmf(key,session_id,dtmf);
        },
        unregister: function (key) {
            return activeStorage.unregister(key);
        },
        phone_mode_change:function (key,mode) {
            return activeStorage.phone_mode_change(key,mode);
        },
        isWebRtcSupported:function () {
            return SIPml.isWebRtcSupported();
        },
        isWebSocketSupported:function () {
            return SIPml.isWebSocketSupported();
        },
        initFrame: function() {
            videoStorage.initFrame();
        }
    };

});