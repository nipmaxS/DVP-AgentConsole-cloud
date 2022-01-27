/**
 * Created by Rajinda Waruna on 25/04/2018.
 */

agentApp.controller('call_notifications_controller', function ($rootScope, $scope, $timeout, $ngConfirm, jwtHelper, $crypto, $filter, hotkeys, authService,chatService, veery_phone_api, shared_data, shared_function, WebAudio, chatService, status_sync, resourceService, phoneSetting, profileDataParser,tabConfig) {

    /*----------------------------enable shortcut keys-----------------------------------------------*/

    hotkeys.add({
        combo: 'alt+a',
        description: 'Answer/Make Call',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            /* if(shared_data.callDetails.sessionId===null || shared_data.callDetails.sessionId===undefined ||shared_data.callDetails.sessionId===""){
                 console.error("invalid call session");
                 return;
             }*/

            if ($scope.currentModeOption.toLowerCase() === 'outbound' && !$scope.inCall) {
                shared_data.callDetails.number = $scope.notification_call.number;
                $scope.notification_panel_phone.make_call(shared_data.callDetails.number);
            }
            else {
                if ($('#answerButton').hasClass('display-none') || shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }

                $scope.notification_panel_phone.call_answer();
            }
        }
    });

    hotkeys.add(
        {
            combo: 'alt+c',
            description: 'Drop Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                $scope.notification_panel_phone.call_end();
            }
        });

    hotkeys.add(
        {
            combo: 'alt+r',
            description: 'reject Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                $scope.notification_panel_phone.call_end();
            }
        });

    hotkeys.add(
        {
            combo: 'alt+h',
            description: 'Hold Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                $scope.notification_panel_phone.call_hold();
            }
        });
    hotkeys.add(
        {
            combo: 'alt+u',
            description: 'Unhold Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                $scope.notification_panel_phone.call_unhold();
            }
        });

    hotkeys.add(
        {
            combo: 'alt+z',
            description: 'freezeAcw Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                if ($scope.isAcw && !$scope.freeze)
                    $scope.notification_panel_phone.call_freeze();
            }
        });

    hotkeys.add(
        {
            combo: 'alt+w',
            description: 'End Freeze',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                if ($scope.freeze)
                    $scope.notification_panel_phone.call_end_freeze();
            }
        });

    hotkeys.add(
        {
            combo: 'alt+q',
            description: 'End-Acw Call',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function () {
                if (shared_data.callDetails.sessionId === null || shared_data.callDetails.sessionId === undefined || shared_data.callDetails.sessionId === "") {
                    console.error("invalid call session");
                    return;
                }
                if ($scope.isAcw)
                    $scope.notification_panel_phone.call_end_acw();
            }
        });

    /*----------------------------enable shortcut keys-----------------------------------------------*/

    // -------------------- ringtone config -------------------------------------
    var options = {
        buffer: true,
        loop: true,
        gain: 1,
        fallback: false,     // Use HTML5 audio fallback
        retryInterval: 500  // Retry interval if buffering fails
    };
    var audio = new WebAudio('assets/sounds/ringtone.wav', options);
    audio.buffer();

    audio.onPlay = function () {
        console.info("........................... Playing Audio ........................... ");
    };    // When media starts playing
    audio.onStop = function () {
        console.info("........................... Stop Audio ........................... ");
    };      // When media is stopped (with audio.stop())
    audio.onEnd = function () {
        console.info("........................... End Audio ........................... ");
    };    // When media finishes playing completely (only if loop = false)
    audio.onBuffered = function () {
        console.info("........................... Buffered  Audio ........................... ");
    }; // When media is buffered

    function startRingTone(no) {
        try {
            if (shared_data.phone_strategy === "veery_sip_phone")
                return;
            audio.play();
            console.info("........................... Play Ring Tone ........................... " + no);
        }
        catch (e) {
            console.error("-------------------------- Fail To play Ring Tone. -----------------------------------");
            console.error(e);
        }
    }

    function stopRingTone() {
        try {
            audio.stop();
            console.info("........................... Stop Ring Tone ........................... ");
        }
        catch (e) {
            console.error("----------------------------- Fail To Stop RingTone. ---------------------------");
            console.error(e);
        }
    }

    /* var ringtone = new Audio('assets/sounds/ringtone.wav');
     ringtone.loop = true;
     function startRingTone(no) {
         try {
             ringtone.play();
             console.info("........................... Play Ring Tone ........................... " + no);
         }
         catch (e) {
             console.error("Fail To play Ring Tone.");
             console.error(e);
         }
     }
     function stopRingTone() {
         try {
             ringtone.pause();
             console.info("........................... Stop Ring Tone ........................... ");
         }
         catch (e) {
             console.error("Fail To Stop RingTone.");
             console.error(e);
         }
     }*/
    // -------------------- ringtone config -------------------------------------

    // ------------------------------------ text to speech ------------------------//
    $scope.isReadyToSpeak = false;
    $scope.sayIt = function (text) {
        if (!$scope.isReadyToSpeak) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        }
    };

    $scope.stopIt = function () {
        window.speechSynthesis.cancel();
    };

    $rootScope.$on("stop_speak", function (event, data) {
        window.speechSynthesis.cancel();
    });
    // ------------------------------------ text to speech ------------------------//

    var veery_api_key = "";
    var sipConnectionLostCount = 0;

    $scope.safeApply = function (fn) {
        if (this.$root) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        } else {
            this.$apply(fn);
        }

    };
    $scope.notification_call = {
        number: "",
        skill: "",
        direction: "",
        sessionId: "",
        callrefid: "",
        transferName: "",
        Company: "",
        CompanyNo: "",
        displayNumber: "",
        displayName: "",
        callre_uniq_id: ""
    };

    var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
    var my_id = decodeData.context.veeryaccount.contact;

    /*----------------------- timers configurations -------------------------------*/

    /*acw_countdown_timer phone */
    var acw_countdown_web_rtc_timer = new Timer();
    acw_countdown_web_rtc_timer.addEventListener('secondsUpdated', function (e) {
        $('#call_notification_acw_countdown_web_rtc_timer .values').html(acw_countdown_web_rtc_timer.getTimeValues().toString());
    });
    acw_countdown_web_rtc_timer.addEventListener('targetAchieved', function (e) {
        notification_panel_ui_state.call_idel();
    });

    /*call duration timer webrtc*/
    var call_duration_webrtc_timer = new Timer();
    call_duration_webrtc_timer.addEventListener('secondsUpdated', function (e) {
        $('#call_notification_call_duration_webrtc_timer').html(call_duration_webrtc_timer.getTimeValues().toString());
    });

    /*call duration timer*/
    var call_duration_timer = new Timer();
    call_duration_timer.addEventListener('secondsUpdated', function (e) {
        $('#call_notification_call_duration_timer').html(call_duration_timer.getTimeValues().toString());
    });

    /*acw_countdown_timer */
    var acw_countdown_timer = new Timer();
    acw_countdown_timer.addEventListener('secondsUpdated', function (e) {
        $('#call_notification_acw_countdown_timer .values').html(acw_countdown_timer.getTimeValues().toString());
    });
    acw_countdown_timer.addEventListener('targetAchieved', function (e) {
        if (shared_data.currentModeOption === "Inbound") {
            notification_panel_ui_state.phone_inbound();
            $scope.notification_panel_phone.phone_mode_change("Inbound");
        }
        notification_panel_ui_state.call_idel();
    });

    /*freeze_timer*/
    var freeze_timer = new Timer();
    freeze_timer.addEventListener('secondsUpdated', function (e) {
        $('#call_notification_freeze_duration_timer').html(freeze_timer.getTimeValues().toString());
    });

    /*----------------------- timers configurations -------------------------------*/

    var removeSharing = function () {
        try {
            resourceService.RemoveSharing(authService.GetResourceId(), "CALL").then(function (data) {
                console.info(data);
            }, function (error) {
                console.error(error);
            });
        } catch (ex) {
            console.error(error);
        }

    };

    var timeReset = function () {

    };
    var autoAnswerTimeTimer = $timeout(timeReset, 0);

    var call_in_progress = false;
    var call_transfer_progress = false;
    $scope.notification_panel_phone = {
        init_call_details: function (data) {
            console.log("----------------------- init_call_details -----------------------------\n %s \n----------------------- init_call_details -----------------------------", JSON.stringify(data));

            if ((data.BusinessUnit === undefined || data.BusinessUnit === null || data.BusinessUnit === "" || data.BusinessUnit === 'default' || profileDataParser.myBusinessUnit === data.BusinessUnit) && profileDataParser.company === data.Company) {

                var values = data.Message.split("|");

                var needToShowNewTab = false;
                /*if (shared_data.phone_strategy != "veery_web_rtc_phone" || shared_data.callDetails.number === "" || shared_data.callDetails.number === undefined || shared_data.callDetails.number === "Outbound Call" || values[3].startsWith(shared_data.callDetails.number)) {*/
                if (shared_data.callDetails.number === "" || shared_data.callDetails.number == undefined || shared_data.callDetails.number == "Outbound Call" || values[3].startsWith(shared_data.callDetails.number)) {
                    needToShowNewTab = true;
                }
                else {
                    var tempNumber = "";
                    if (values.length === 12 && values[11] === 'TRANSFER') {
                        tempNumber = values[3];
                    }
                    else if (values.length === 12 && values[11] === 'AGENT_AGENT') {
                        tempNumber = values[5];
                    } else if (values.length === 11 && values[7] === "outbound") {
                        tempNumber = shared_data.callDetails.number;
                    }
                    needToShowNewTab = tempNumber.startsWith(shared_data.callDetails.number);
                    if (!needToShowNewTab) {
                        if (shared_data.callDetails.number.length <= values[3].length) {
                            //tempNumber = shared_data.callDetails.number.substr(1);
                            tempNumber = shared_data.callDetails.number.slice(-7);
                            needToShowNewTab = values[3].includes(tempNumber)
                        } else {
                            tempNumber = values[3].slice(-7);
                            needToShowNewTab = shared_data.callDetails.number.includes(tempNumber)
                        }

                    }

                    console.log(needToShowNewTab);
                }
                if (!needToShowNewTab) {
                    console.error("Agent Found Event Fire in Invalid State.");
                    return;
                }

                this.reset_call_details();
                $scope.notification_call = {
                    number: values[4],
                    direction: values[7],
                    callrefid: (values.length >= 10) ? values[10] : undefined,
                    transferName: "",
                    Company: data.Company,
                    CompanyNo: (values.length === 12 && values[11] === 'DIALER') ? "" : values[5],
                    displayNumber: values.length > 8 ? (values[8] === 'skype' ? values[4] : values[3]) : (values[3]),
                    callre_uniq_id: (values.length >= 10) ? values[10] : undefined,
                    channelFrom: values.length > 8 ? (values[8] === 'skype' ? values[4] : values[3]) : (values[3]),
                    channelTo: values[5],
                    channel: values.length > 8 ? (values[8]) : ('call'),
                    skill: values[6],
                    sessionId: values[1],
                    displayName: values[4]
                };

                if (values.length === 12 && values[11] === 'TRANSFER') {
                    $scope.notification_call.transferName = 'Transfer Call From : ' + values[9];
                    $scope.notification_call.number = values[3];
                    $scope.notification_call.CompanyNo = '';
                }
                else if (values.length === 12 && values[11] === 'AGENT_AGENT') {
                    $scope.notification_call.number = values[5];
                    $scope.notification_call.CompanyNo = '';
                }
                shared_data.callDetails = $scope.notification_call;
                command_processor({
                    message: 'incoming_call_notification',
                    data: $scope.notification_call,
                    command: "incoming_call_notification"
                })
            }
            else {
                console.error("agentFound - invalid Business Unit/Company");
            }
        },
        reset_local_call_details: function () {
            $scope.safeApply(function () {
                $scope.notification_call = {
                    number: "",
                    skill: "",
                    direction: "",
                    sessionId: "",
                    callrefid: "",
                    transferName: "",
                    Company: "",
                    CompanyNo: "",
                    displayNumber: "",
                    displayName: "",
                    callre_uniq_id: ""
                };
            });
            console.log("----------------------- Reset Call Details -----------------------------\n %s \n----------------------- Reset Call Details -----------------------------", JSON.stringify($scope.notification_call));

        },
        reset_call_details: function () {
            shared_data.callDetails = {
                number: "",
                skill: "",
                direction: "",
                sessionId: "",
                callrefid: "",
                transferName: "",
                Company: "",
                CompanyNo: "",
                displayNumber: "",
                displayName: "",
                callre_uniq_id: ""
            };
            this.reset_local_call_details();
        },
        phone_mode_change: function (mode) {
            console.log("------------------------- Phone mode clicked  -------------------------");
            try {
                veery_phone_api.phone_mode_change(veery_api_key, mode);
            } catch (ex) {
                console.log(ex)
            }
        },
        auto_answer: function () {
            try {
                console.log("------------------------- Auto Answer clicked  -------------------------");
                if (shared_data.phone_config && shared_data.phone_config.autoAnswer) {
                    var autoAnswerAfterDelay = function () {
                        $timeout.cancel(autoAnswerTimeTimer);
                        $scope.notification_panel_phone.call_answer();
                    };
                    autoAnswerTimeTimer = $timeout(autoAnswerAfterDelay, shared_data.phone_config.autoAnswerDelay);
                }
            }
            catch (ex) {
                console.log(ex)
            }
        },
        make_call: function (number) {


            /*if (shared_data.phone_strategy !== "veery_web_rtc_phone") {
                if (document.getElementById("call_notification_outbound_btn").disabled === true) {
                    console.log("fail to make call ---------");
                    return;
                }
                document.getElementById("call_notification_outbound_btn").disabled = false;
            }*/

            console.log("------------------------- Make call clicked  -------------------------");
            if (number === "" || number===undefined) {
                //shared_function.showAlert("Soft Phone", "error", "Please Enter Number To Dial.");
                $scope.notification_call =  $scope.callLog[$scope.callLog.length - 1];
                document.getElementById("call_notification_outbound_btn").disabled = false;
                if($scope.notification_call.number  === "" || $scope.notification_call.number===undefined){
                    shared_function.showAlert("Soft Phone", "error", "Please Enter Number To Dial.");
                }else{

                    shared_function.showAlert("Soft Phone", "notice", "Reload Last Dialed Number.");
                }
                return
            }
            if (call_in_progress) {
                shared_function.showAlert("Soft Phone", "error", "Call In Progress.");
                return
            }
            if ($scope.currentModeOption === null || $scope.currentModeOption.toLowerCase() !== 'outbound') {
                shared_function.showAlert("Soft Phone", "error", "Cannot make outbound call while you are in inbound mode.");
                return
            }
            if (veery_api_key === undefined || veery_api_key === "" || ($('#call_notification_panel').hasClass('display-none') && $('#softPhone').hasClass('display-none'))) {
                shared_function.showAlert("Soft Phone", "error", "Phone Not Registered");
                return
            }

            $scope.notification_call.skill = 'Outbound Call';
            $scope.notification_call.direction = 'outbound';
            shared_data.callDetails = $scope.notification_call;
            veery_phone_api.makeCall(veery_api_key, number, my_id);
            notification_panel_ui_state.call_ringing();
            $scope.addToCallLog(number, "Outbound");
            // if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            //     try {
            //         notification_panel_ui_state.update_call_status('Dialing');
            //         call_duration_webrtc_timer.start();
            //     }
            //     catch (ex) {
            //         console.error(ex);
            //     }
            // }
        },
        call_answer: function () {

            /*
            if (shared_data.phone_strategy !== "veery_web_rtc_phone") {
                if (document.getElementById("call_notification_answer_btn").disabled === true) {
                    console.log("fail to answer---------");
                    return;
                }
                document.getElementById("call_notification_answer_btn").disabled = true;
            }

             */

            console.log("------------------------- Call Answer clicked  -------------------------");
            veery_phone_api.answerCall(veery_api_key);

        },
        call_end: function () {
            console.log("------------------------- Call End clicked  -------------------------");
            if (!call_in_progress) {
                $scope.addToCallLog(shared_data.callDetails.number, "Rejected");
            }
            veery_phone_api.endCall(veery_api_key, (shared_data.callDetails.direction && shared_data.callDetails.direction.toLowerCase() === 'outbound') ?
                shared_data.callDetails.sessionId : shared_data.callDetails.callrefid);
        },
        call_mute: function () {
            console.log("------------------------- Call Mute clicked  -------------------------");
            veery_phone_api.muteCall(veery_api_key);
        },
        call_unmute: function () {
            console.log("------------------------- Call unmute clicked  -------------------------");
            veery_phone_api.unmuteCall(veery_api_key);
        },
        call_hold: function () {
            console.log("------------------------- Call Hold clicked  -------------------------");
            veery_phone_api.holdCall(veery_api_key, shared_data.callDetails.sessionId);
        },
        call_unhold: function () {
            console.log("------------------------- Call Hold clicked  -------------------------");
            veery_phone_api.unholdCall(veery_api_key, shared_data.callDetails.sessionId);
        },
        call_freeze: function () {
            console.log("------------------------- Call Freeze clicked  -------------------------");
            notification_panel_ui_state.call_freeze_req();
            veery_phone_api.freezeAcw(veery_api_key, shared_data.callDetails.sessionId);
        },
        call_end_freeze: function () {
            console.log("------------------------- Call End Freeze clicked  -------------------------");
            veery_phone_api.endFreeze(veery_api_key, shared_data.callDetails.sessionId);
        },
        call_end_acw: function () {
            console.log("------------------------- Call End ACW clicked  -------------------------");
            notification_panel_ui_state.call_freeze_req();
            veery_phone_api.endAcw(veery_api_key, shared_data.callDetails.sessionId);
        },
        call_transfer: function (number) {
            console.log("------------------------- Call Transfer clicked  -------------------------");
            notification_panel_ui_state.call_transfering();
            veery_phone_api.transferCall(veery_api_key, shared_data.callDetails.sessionId, number, shared_data.callDetails.callrefid);
        },
        call_transfer_ivr: function (number) {
            console.log("------------------------- Call Transfer IVR clicked  -------------------------");
            notification_panel_ui_state.call_transfering();
            veery_phone_api.transferIVR(veery_api_key, shared_data.callDetails.sessionId, number, shared_data.callDetails.callrefid);
        },
        open_transfer_view: function () {
            console.log("------------------------- Transfer Open clicked  -------------------------");
            notification_panel_ui_state.call_transfer_view();
        },
        close_transfer_view: function () {
            console.log("------------------------- Transfer Close clicked  -------------------------");
            notification_panel_ui_state.call_close_transfer_view();
        },
        call_etl: function () {
            console.log("------------------------- Call ETL clicked  -------------------------");
            veery_phone_api.etlCall(veery_api_key);
        },
        call_conference: function () {
            console.log("------------------------- Call Conference clicked  -------------------------");
            veery_phone_api.conferenceCall(veery_api_key);
        },
        cPanleToggelRight: function () {
        },
        cPanleToggelLeft: function () {

        },
        send_dtmf: function (dtmf) {
            console.log("------------------------- Send DTMF clicked  -------------------------");
            veery_phone_api.send_dtmf(veery_api_key, shared_data.callDetails.sessionId, dtmf);
        },
        unregister: function () {
            console.log("------------------------- Unregister clicked  -------------------------");
            veery_phone_api.unregister(veery_api_key);
        }
    };


    var element;
    var phone_status = "Offline";
    $scope.callNotifMinHeight = false;
    /* ---------------- UI status -------------------------------- */
    $scope.notification_panel_ui_methid = {
        showIvrPenel: function () {

            if ($('#divIvrPad').hasClass('display-none')) {
                $('#divIvrPad').removeClass('display-none');
                $('#divKeyPad').addClass('display-none');
            }
            else {
                $('#divKeyPad').removeClass('display-none');
                $('#divIvrPad').addClass('display-none');
            }
        },
        showMoreOption: function () {
            $('#onlinePhoneBtnWrapper').removeClass('display-none');
            $('#phoneBtnWrapper').addClass('display-none');
        },
        hideMoreOption: function () {
            $('#phoneBtnWrapper').removeClass('display-none');
            $('#onlinePhoneBtnWrapper').addClass('display-none');
        },
        showPhoneBook: function () {
            notification_panel_ui_state.showPhoneBook();
        },
        hidePhoneBook: function () {
            notification_panel_ui_state.hidePhoneBook();
        },
        // Kasun_Wijeratne_1_JUNE_2018
        toggleCallNotificationSize: function (status) {
            $scope.callNotifMinHeight = false;
            var chatUIWidth = $('#mySidenav').width();
            if (status == 'forceToggle' || !$("#call_notification_panel").hasClass('dragging')) {
                if ($("#call_notif_min").hasClass('display-none')) {
                    $("#call_notif_min").removeClass('display-none');
                    $("#call_notif_full").addClass('display-none');
                    $("#call_notif_min .fa-chevron-circle-right").removeClass('fa-chevron-circle-right');
                    $("#call_notif_min .fa").addClass('fa-chevron-circle-left');
                    $("#call_notification_panel").addClass('call_notification_panel_min');

                    // Kasun_Wijeratne_28_MAY_2018
                    // if(!$('#AgentDialerUi').hasClass('display-none')) {
                    //     $("#call_notification_panel").css('bottom', '72px');
                    //
                    //     if(!$('#AgentDialerUi').hasClass('dialer-minimize')) {
                    //         if (!$('#mainDialerScreen .header-052017').hasClass('ng-hide') && !$('#mainDialerScreen .dialer-052017-body').hasClass('ng-hide')) {
                    //             if ($('#call_notification_panel').hasClass('call_notification_panel_min')) {
                    //                 $("#call_notification_panel").css('bottom', '330px');
                    //             } else {
                    //                 $("#call_notification_panel").css('bottom', '320px');
                    //             }
                    //         }
                    //     }
                    // }
                    // Kasun_Wijeratne_28_MAY_2018

                } else {
                    $("#call_notif_full").removeClass('display-none');
                    $("#call_notif_min").addClass('display-none');
                    $("#call_notif_min .fa-chevron-circle-left").removeClass('fa-chevron-circle-left');
                    $("#call_notif_min .fa").addClass('fa-chevron-circle-right');
                    $("#call_notification_panel").removeClass('call_notification_panel_min');

                    // Kasun_Wijeratne_28_MAY_2018
                    // if(!$('#AgentDialerUi').hasClass('display-none')) {
                    //     $("#call_notification_panel").css('bottom', '62px');
                    //
                    //     if(!$('#AgentDialerUi').hasClass('dialer-minimize')) {
                    //         if(!$('#mainDialerScreen .header-052017').hasClass('ng-hide') &&
                    //             !$('#mainDialerScreen .dialer-052017-body').hasClass('ng-hide') ) {
                    //             if ($('#call_notification_panel').hasClass('call_notification_panel_min')) {
                    //                 $("#call_notification_panel").css('bottom', '330px');
                    //             }else{
                    //                 $("#call_notification_panel").css('bottom', '320px');
                    //             }
                    //         }
                    //     }
                    // }
                    // Kasun_Wijeratne_28_MAY_2018
                }
            } else {
                $("#call_notification_panel").removeClass('dragging');
            }
        },
        // Kasun_Wijeratne_1_JUNE_2018 - ENDS

        toggleCallNotificationHeight: function () {
            $scope.callNotifMinHeight = !$scope.callNotifMinHeight;
        }
    };

    var notification_panel_ui_state = {
        phone_online: function () {
            $('#softPhone').removeClass('display-block ').addClass('display-none');
            $('#call_notification_panel').addClass('display-none');

            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            $('#idPhoneReconnect').addClass('display-none');
            $('#isLoadingRegPhone').addClass('display-none').removeClass('display-block active-menu-icon');
            $('#phoneRegister').addClass('display-none');
            $('#phoneStrategyIcon').removeClass('display-none');
            $('#phoneStrategyIcon').attr('src', 'assets/img/' + shared_data.phone_strategy + '.svg');
            $('#isBtnReg').addClass('display-block active-menu-icon').removeClass('display-none');
            $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
            $('#softPhoneDragElem').addClass('display-block').removeClass('display-none ');
            $('.isOperationPhone').addClass('display-block ').removeClass('display-none');
            $('#softPhone').addClass('display-block ').removeClass('display-none');
            //document.getElementById('calltimmer').getElementsByTagName('timer')[0].stop();
            $('#softPhone').removeClass('phone-disconnected');
            element = document.getElementById('answerButton');

            $('#phoneDialpad input').off('click');
            $('#phoneDialpad input').click(function () {
                var values = $(this).data('values');
                var chr = values[0].toString();
                $scope.notification_call.number = $scope.notification_call.number ? $scope.notification_call.number + chr : chr;

                $scope.notification_panel_phone.send_dtmf(chr);
                $scope.$apply();
            });
            $('#call_notification_call_duration_webrtc_timer').removeClass('display-none');
            $('#call_logs').addClass('display-none');
            $('#calltimmer').removeClass('display-none').addClass('call-duations');
            $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
            //}
            /*else {
                if ($scope.currentModeOption === "Outbound") {

                    //$('#call_notification_panel').removeClass('display-none');

                }
                $('#idPhoneReconnect').addClass('display-none');
                //is loading done
                $('#isLoadingRegPhone').addClass('display-none').removeClass('display-block active-menu-icon');
                $('#phoneRegister').addClass('display-none');
                $('#phoneStrategyIcon').removeClass('display-none');
                $('#phoneStrategyIcon').attr('src', 'assets/img/' + shared_data.phone_strategy + '.svg');
                $('#isBtnReg').addClass('display-block active-menu-icon').removeClass('display-none');
                $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
                $('#softPhoneDragElem').addClass('display-block').removeClass('display-none ');
                $('#softPhone').removeClass('phone-disconnected');
                $('#call_logs').removeClass('display-none');

            }*/

            $('#agentDialerTop').addClass('display-block active-menu-icon').removeClass('display-none');
            shared_function.showAlert("Soft Phone", "success", "Phone Connected");

            sipConnectionLostCount = 0;
            shared_data.phone_initialize = true;
            shared_data.phone_initializing = false;
            phone_status = "phone_online";
            if (shared_data.currentModeOption === "Inbound" || shared_data.currentModeOption === "Outbound")
                $scope.notification_panel_phone.phone_mode_change(shared_data.currentModeOption);

            notification_panel_ui_state.call_idel();
            set_agent_status_available();
        },
        phone_inbound: function () {
            $('#call_notification_panel').addClass('display-none');
        },
        phone_outbound: function () {

            //$('#call_notification_panel').removeClass('display-none');

        },
        ReciveCallInfo: function (data, Number) {
            try {
                console.log("----------------------- ReciveCallInfo -----------------------------\n %s \n----------------------- ReciveCallInfo -----------------------------", JSON.stringify(data));
                if(data){
                    var skilData = undefined;
                    var sessionData = undefined;


                    data.map(function (item) {
                        if(item && item.s_name)
                        {
                            switch (item.s_name.toLowerCase()){
                                case "x-skill":
                                    $scope.notification_call.skill = item.s_value;
                                    skilData = item.s_value;
                                    break;
                                case "x-session":
                                    $scope.notification_call.sessionId = item.s_value;
                                    sessionData = item.s_value;
                                    break;
                                case "x-callingnumber":
                                    $scope.notification_call.CompanyNo= item.s_value;
                                    break;
                            }


                        }
                    });

                    console.log("----------------------- ReciveCallInfo -----------------------------\n %s \n %s \n----------------------- ReciveCallInfo -----------------------------", skilData,sessionData);
                    if(skilData && sessionData ){

                        $scope.sayIt("you are receiving " + skilData + " call");

                        var notifyData = {
                            direction: "inbound",
                            channel_from: Number,
                            channel_to: $scope.notification_call.CompanyNo,
                            channel: "call",
                            skill: $scope.notification_call.skill,
                            engagement_id: $scope.notification_call.sessionId,
                            displayName: Number,
                            index:$scope.notification_call.sessionId,
                            tabType : 'engagement'
                        };

                        if(profileDataParser.is_tab_open($scope.notification_call.sessionId))
                        {
                            console.log("----------------------- ReciveCallInfo -----------------------------\n %s \n %s \n----------------------- ReciveCallInfo -----------------------------", "Open Tab By Agent Found - SIP data Avoided ",sessionData);
                            return;
                        }
                        profileDataParser.RecentEngagements.push($scope.notification_call.sessionId);
                        $rootScope.$emit('openNewTab', notifyData);
                        console.log("----------------------- ReciveCallInfo -----------------------------\n %s \n %s \n----------------------- ReciveCallInfo -----------------------------", "Open Tab Using SIP Data",JSON.stringify(notifyData));
                    }


                }
            } catch (ex) {
                console.error(ex);
            }


        },
        phone_offline: function (title, msg) {
            //removeSharing();
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            //}
            $('#call_notification_panel').addClass('display-none');
            $('#isBtnReg').addClass('display-none').removeClass('display-block active-menu-icon');
            $('#isCallOnline').addClass('display-none').removeClass('display-block deactive-menu-icon');
            $('#agentDialerTop').removeClass('display-block active-menu-icon').addClass('display-none');
            $('#call_logs').addClass('display-none');
            $('#agentDialerTop').addClass('display-none');
            shared_function.showAlert('Phone', 'error', msg);
            shared_function.showWarningAlert(title, msg);
            phone_status = "phone_offline";
            shared_data.phone_initialize = false;shared_data.phone_initializing = false;
            $('#answerButton').removeClass('phone-sm-btn answer').addClass('display-none');
            resourceService.RemoveSharing(authService.GetResourceId(), "call").then(function (data) {
                if (data && data.IsSuccess) {
                    console.log("Call task removed");
                    $rootScope.$emit("current_mode", {
                        currentModeOption: 'Offline'
                    });
                }
            }, function (error) {
                authService.IsCheckResponse(error);
                console.log("Fail To remove sharing resource.");
            });


            $rootScope.$emit('dialstop', undefined);
            $('#AgentDialerUi').removeClass('agent-d-wrapper-0522017 fadeIn').addClass('display-none');
            agent_status_mismatch_count = 0;
            $('#phoneRegister').removeClass('display-none');
        },
        phone_operation_error: function (msg) {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            veery_phone_api.unsubscribeEvents();
            document.getElementById('callStatus').innerHTML = 'Error Occurred';

            $('#answerButton').removeClass('phone-sm-btn answer').addClass('display-none');
            $('#softPhone').addClass('phone-disconnected');
            $('#isCallOnline').addClass('display-block transport-error').removeClass('display-none');
            //call_duration_webrtc_timer.reset();
            call_duration_webrtc_timer.stop();
            $('#call_notification_call_duration_webrtc_timer').addClass('display-none');

            $rootScope.$emit('dialstop', undefined);
            console.log("Phone Offline....PhoneOnErrorState......");

            $scope.showAlert("Soft Phone", "error", msg);
            notification_panel_ui_state.update_call_status('Error Occurred');
            //} else {
            // shared_function.showAlert('Phone', 'error', msg);
            //}
            chatService.Status('offline', 'call');
            phone_status = "phone_operation_error";


            $('#call_logs').addClass('display-none');

            $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
            $('#isLoadingRegPhone').addClass('display-block').removeClass('display-none');
            $('#isBtnReg').addClass('display-none ').removeClass('display-block active-menu-icon');
            $('#phoneRegister').removeClass('display-none');
            $('#agentDialerTop').removeClass('display-block active-menu-icon').addClass('display-none');
        },
        call_idel: function () {
            shared_data.allow_mode_change = true;

            // if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            $('#answerButton').addClass('phone-sm-btn answer').removeClass('display-none');
            $('#freezebtn').addClass('display-none').removeClass('phone-sm-btn ');
            $('#endACWbtn').addClass('display-none').removeClass('phone-sm-btn ');
            //$('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
            $('#endButton').addClass('display-none').removeClass('phone-sm-btn call-ended');
            $('#dialPad').addClass('veery-font-1-menu-4').removeClass('display-none');
            $('#contactList').addClass('veery-font-1-user').removeClass('display-none');
            $('#morebtn').addClass('phone-sm-btn phone-sm-bn-p8 veery-font-1-more').removeClass('display-none');
            $scope.freeze = false;
            $scope.isAcw = false;
            $scope.isReadyToSpeak = false;
            $scope.profile.freezeExceeded = false;
            document.getElementById('callStatus').innerHTML = 'Idle';
            $('#conferenceCall').addClass('display-none').removeClass('display-inline');
            $('#etlCall').addClass('display-none').removeClass('display-inline');
            $('#transferCall').addClass('display-none').removeClass('display-inline');
            $('#divKeyPad').removeClass('display-none');
            $('#divIvrPad').addClass('display-none');
            $('#transferIvr').addClass('display-none').removeClass('display-inline');
            $('#countdownCalltimmer').addClass('display-none').removeClass('call-duations');
            $('#endfreezebtn').removeClass('phone-sm-btn ').addClass('display-none');
            $('#freezeRequest').addClass('display-none');
            if (element) {
                element.onclick = function () {
                    shared_data.callDetails.number = $scope.notification_call.number;
                    $scope.notification_panel_phone.make_call(shared_data.callDetails.number);
                };
                element.title = "Make Call [Alt+A]";
            }
            // $('#swapCall').addClass('display-none').removeClass('display-inline');
            call_duration_webrtc_timer.stop();
            acw_countdown_web_rtc_timer.stop();
            $('#calltimmer').removeClass('display-none').addClass('call-duations');
            $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
            $('#holdButton').addClass('display-none');
            $('#unholdButton').addClass('display-none');
            //}
            /*else {

                $('#call_notification_freeze_request').addClass('display-none');
                $('#call_notification_freeze_btn').removeClass('display-none');
                $('#call_notification_end_acw_btn').removeClass('display-none');

                $('#call_notification_call_function_btns').addClass('display-none');
                $('#call_notification_acw_panel').addClass('display-none');
                $('#call_notification_Information').addClass('display-none');
                $('#call_notification_outbound').removeClass('display-none');

                $('#call_notification_call_conference_btn').addClass('display-none');
                $('#call_notification_call_etl_btn').addClass('display-none');
                $('#call_notification_call_transfer_btn').removeClass('display-none');
                $('#call_notification_call_duration_timer').addClass('display-none');
                $('#call_notification_call_unmute_btn').addClass('display-none');
                $('#call_notification_call_mute_btn').removeClass('display-none');
                $('#call_notification_call_unhold_btn').addClass('display-none');
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', '100%');
                // Kasun_Wijeartne_18_MAY_2018 - END
                call_duration_timer.stop();
                acw_countdown_timer.stop();
                if (shared_data.currentModeOption === "Inbound") {
                    $('#call_notification_panel').addClass('display-none');
                }
                document.getElementById("call_notification_answer_btn").disabled = false;
                document.getElementById("call_notification_outbound_btn").disabled = false;
            }*/


//$scope.$apply();
            $scope.notification_panel_phone.reset_call_details();
            stopRingTone();
            chatService.Status('available', 'call');
            $scope.isAcw = false;
            $scope.freeze = false;
            phone_status = "call_idel";
            if (!$('#AgentDialerUi').hasClass('display-none')) { // start only if dialer start
                $rootScope.$emit('dialnextnumber', undefined);
            }
            set_agent_status_available();
            call_transfer_progress = false;
            shared_data.agent_status = "call_idel";

        },
        call_ringing: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
            $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
            //}

            phone_status = "call_ringing";
            shared_data.agent_status = "Reserved";
            shared_data.allow_mode_change = false;
        },
        call_incoming: function () {

            console.log("Show Incoming Call Answer Penal-start : " + shared_data.callDetails.number);
            if (shared_data.agent_status === "Break") {
                $scope.notification_panel_phone.call_end();
                console.error("call receive in break - agent-agent : " + shared_data.callDetails.number);
                return;
            }
            $scope.inCall = true;
            shared_data.agent_status = "Reserved";
            shared_data.allow_mode_change = false;
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            if (element) {
                element.onclick = function () {
                    $scope.notification_panel_phone.call_answer();
                };
                element.title = "Answer Call [Alt+A]";
            }
            $('#incomingNotification').addClass('display-block fadeIn').removeClass('display-none zoomOut');

            $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
            // $('#holdButton').addClass('display-none ').removeClass('display-inline');
            $('#holdButton').addClass('display-none');
            $('#unholdButton').addClass('display-none');
            $('#muteButton').addClass('display-none ').removeClass('display-inline');
            /*addCallToHistory(sRemoteNumber, 2);*/
            document.getElementById('callStatus').innerHTML = 'Incoming Call';
            $scope.notification_panel_phone.auto_answer();
            call_duration_webrtc_timer.stop();
            acw_countdown_web_rtc_timer.stop();
            //}
            /* else {
                 $('#call_notification_panel').removeClass('display-none');
                 $('#call_notification_call_function_btns').addClass('display-none');
                 $('#call_notification_acw_panel').addClass('display-none');
                 $('#call_notification_Information').removeClass('display-none');
                 $('#call_notification_outbound').addClass('display-none');
                 $('#call_notification_answer_btn').removeClass('display-none');
                 $('#call_notification_endcall_btn_dumy').addClass('display-none');
                 // Kasun_Wijeartne_18_MAY_2018
                 $('#call_notification_body').css('height', '100%');
                 // Kasun_Wijeartne_18_MAY_2018 - END
                 call_duration_timer.stop();
                 acw_countdown_timer.stop();
             }*/

            startRingTone(shared_data.callDetails.number);
            chatService.Status('busy', 'call');

            phone_status = "call_incoming";
            console.info("........................... On incoming Call Event End ........................... " + shared_data.callDetails.number);

            var msg = "Hello " + $scope.firstName + " you are receiving a call";
            if (shared_data.callDetails.number) {
                msg = msg + " From " + shared_data.callDetails.number;
            }
            if (shared_data.callDetails.skill && shared_data.callDetails.number) {
                msg = "Hello " + $scope.firstName + " You Are Receiving a " + shared_data.callDetails.skill + " Call From " + shared_data.callDetails.number;
            }
            showNotification(msg, 15000);

            $scope.sayIt("you are receiving " + shared_data.callDetails.skill + " call");

            console.info("........................... Show Incoming call Notification Panel ........................... : " + shared_data.callDetails.number);
        },
        call_connected: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            //$('#holdButton').addClass('phone-sm-btn phone-sm-bn-p8').removeClass('display-none');
            $('#holdButton').removeClass('display-none');
            $('#unholdButton').addClass('display-none');
            //$('#speakerMuteButton').addClass('veery-font-1-microphone').removeClass('veery-font-1-muted display-none');
            $('#speakerMuteButton').removeClass('display-none');
            $('#speakerUnmuteButton').addClass('display-none');
            $('#muteButton').addClass('phone-btn ').removeClass('display-none');
            $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
            $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
            $('#transferCall').addClass('display-inline').removeClass('display-none');
            $('#transferIvr').addClass('display-inline').removeClass('display-none');
            $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
            $('#etlCall').addClass('display-none').removeClass('display-inline');
            document.getElementById('callStatus').innerHTML = 'In Call';
            $('#calltimmer').removeClass('display-none').addClass('call-duations');
            $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
            $('#conferenceCall').addClass('display-none').removeClass('display-inline');

            //document.getElementById('calltimmer').getElementsByTagName('timer')[0].start();
            $('#call_notification_acw_countdown_web_rtc_timer .values').html("00:00:00");
            $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
            acw_countdown_web_rtc_timer.stop();
            call_duration_webrtc_timer.reset();
            //}
            /*else {

                $('#call_notification_call_duration_timer').removeClass('display-none');
                $('#call_notification_call_function_btns').removeClass('display-none');
                $('#call_notification_acw_panel').addClass('display-none');
                $('#call_notification_Information').removeClass('display-none');
                $('#call_notification_outbound').addClass('display-none');

                $('#call_notification_answer_btn').addClass('display-none');
                $('#call_notification_endcall_btn_dumy').removeClass('display-none');
                $('#call_notification_call_transfer_btn').removeClass('display-none');
                $('#call_notification_call_etl_btn').addClass('display-none');
                $('#call_notification_call_hold_btn').removeClass('display-none');

                $('#call_notification_acw_countdown_timer .values').html("00:00:00");
                $('#call_notification_call_duration_timer').html("00:00:00");
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', 'calc(100% - 40px)');
                // Kasun_Wijeartne_18_MAY_2018 - END
                call_duration_timer.reset();
                acw_countdown_timer.stop();
                document.getElementById("call_notification_outbound_btn").disabled = false;
            }*/
            stopRingTone();
            stopRingbackTone();
            chatService.Status('busy', 'call');
            phone_status = "call_connected";
            //$rootScope.$emit('stop_speak', true);
            $scope.stopIt();
            shared_data.agent_status = "Connected";
            shared_data.allow_mode_change = false;
            $scope.addToCallLog(shared_data.callDetails.number, 'Answered');
            call_transfer_progress = false;
        },
        outbound_call_connected: function () {

            try {
                $scope.inCall = true;
                notification_panel_ui_state.update_call_status('Dialing');
                call_duration_webrtc_timer.start();
            }
            catch (ex) {
                console.error(ex);
            }

            //fucntions after agent is connected in outbound call
            //---start---
               
            chatService.SubscribeEvents("call_notification_controller", function (event, data) {

                console.log('Chat Service Subscribe Events >>>>>>>>>>>>>>>>>>> : ' + event);

                if ($scope.currentModeOption !== null && $scope.currentModeOption.toLowerCase() === 'outbound') {
                                                         
                    switch (event) {
                        
                        case 'agent_connected':

                        $('#holdButton').removeClass('display-none');
                        $('#unholdButton').addClass('display-none');
                        $('#speakerMuteButton').removeClass('display-none');
                        $('#speakerUnmuteButton').addClass('display-none');
                        $('#muteButton').addClass('phone-btn ').removeClass('display-none');
                        $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
                        $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
                        $('#transferCall').addClass('display-inline').removeClass('display-none');
                        $('#transferIvr').addClass('display-inline').removeClass('display-none');
                        $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
                        $('#etlCall').addClass('display-none').removeClass('display-inline');
                        document.getElementById('callStatus').innerHTML = 'In Call';
                        $('#calltimmer').removeClass('display-none').addClass('call-duations');
                        $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
                        $('#conferenceCall').addClass('display-none').removeClass('display-inline');
                        $('#call_notification_acw_countdown_web_rtc_timer .values').html("00:00:00");
                        $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
                        acw_countdown_web_rtc_timer.stop();
                        call_duration_webrtc_timer.reset();


                        call_in_progress = true;
                    
                        stopRingTone();
                        stopRingbackTone();
                        chatService.Status('busy', 'call');
                        phone_status = "call_connected";
                        $scope.stopIt();
                        shared_data.agent_status = "Connected";
                        shared_data.allow_mode_change = false;
                        $scope.addToCallLog(shared_data.callDetails.number, 'Answered');
                        call_transfer_progress = false;  

                    break;  
                        
                    }

                }
 
            });

            //---end---
        },
        call_end_etl: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            //$('#holdButton').addClass('phone-sm-btn phone-sm-bn-p8').removeClass('display-none');
            $('#holdButton').removeClass('display-none');
            $('#unholdButton').addClass('display-none');
            //$('#speakerMuteButton').addClass('veery-font-1-microphone').removeClass('veery-font-1-muted display-none');
            $('#speakerMuteButton').removeClass('display-none');
            $('#speakerUnmuteButton').addClass('display-none');
            $('#muteButton').addClass('phone-btn ').removeClass('display-none');
            $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
            $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
            $('#transferCall').addClass('display-inline').removeClass('display-none');
            $('#transferIvr').addClass('display-inline').removeClass('display-none');
            $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
            $('#etlCall').addClass('display-none').removeClass('display-inline');
            document.getElementById('callStatus').innerHTML = 'In Call';
            $('#calltimmer').removeClass('display-none').addClass('call-duations');
            $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
            $('#conferenceCall').addClass('display-none').removeClass('display-inline');

            //document.getElementById('calltimmer').getElementsByTagName('timer')[0].start();

            $('#call_notification_acw_countdown_web_rtc_timer .values').html("00:00:00");
            $('#call_notification_call_duration_webrtc_timer').html("00:00:00");


            //}
            /*else {
                $('#call_notification_call_duration_timer').removeClass('display-none');
                $('#call_notification_call_function_btns').removeClass('display-none');
                $('#call_notification_acw_panel').addClass('display-none');
                $('#call_notification_Information').removeClass('display-none');
                $('#call_notification_outbound').addClass('display-none');

                $('#call_notification_answer_btn').addClass('display-none');
                $('#call_notification_endcall_btn_dumy').removeClass('display-none');
                $('#call_notification_call_transfer_btn').removeClass('display-none');
                $('#call_notification_call_etl_btn').addClass('display-none');
                $('#call_notification_call_conference_btn').addClass('display-none');
                $('#call_notification_call_hold_btn').removeClass('display-none');
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', 'calc(100% - 40px)');
                // Kasun_Wijeartne_18_MAY_2018 - END
            }*/

        },
        call_disconnected: function () {
            if (shared_data.phone_strategy === "veery_web_rtc_phone") {
                if (element) {
                    element.onclick = function () {
                        shared_data.callDetails.number = $scope.notification_call.number;
                        $scope.notification_panel_phone.make_call(shared_data.callDetails.number);
                    };
                }
                $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
                //document.getElementById('calltimmer').getElementsByTagName('timer')[0].stop();
                $('#calltimmer').addClass('display-none').removeClass('call-duations');
                $('#countdownCalltimmer').addClass('call-duations').removeClass('display-none');
                document.getElementById('callStatus').innerHTML = 'ACW';
                //document.getElementById('countdownCalltimmer').getElementsByTagName('timer')[0].start();
                $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
                $('#conferenceCall').addClass('display-none').removeClass('display-inline');
                $('#morebtn').addClass('display-none').removeClass('phone-sm-btn phone-sm-bn-p8 veery-font-1-more');
                $('#endButton').addClass('display-none ');
                $('#etlCall').addClass('display-none').removeClass('display-inline');
                //$('#holdButton').addClass('display-none ').removeClass('display-inline');
                $('#holdButton').addClass('display-none');
                $('#unholdButton').addClass('display-none');
                $('#muteButton').addClass('display-none ').removeClass('display-inline');
                $('#speakerMuteButton').addClass('display-none ');
                $('#speakerUnmuteButton').addClass('display-none');
                // $('#swapCall').addClass('display-none').removeClass('display-inline');
                $('#transferCall').addClass('display-none').removeClass('display-inline');
                $('#transferIvr').addClass('display-none').removeClass('display-inline');
                $('#divKeyPad').removeClass('display-none');
                $('#divIvrPad').addClass('display-none');
                $('#dialPad').addClass('display-none').removeClass('veery-font-1-menu-4');
                $('#contactList').addClass('display-none').removeClass('veery-font-1-user');
                $('#freezebtn').addClass('phone-sm-btn ').removeClass('display-none');
                $('#endACWbtn').addClass('phone-sm-btn ').removeClass('display-none');
                call_duration_webrtc_timer.reset();
                call_duration_webrtc_timer.stop();
                $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
                acw_countdown_web_rtc_timer.start({countdown: true, startValues: {seconds: shared_data.acw_time}});
                $('#call_notification_acw_countdown_web_rtc_timer.values').html(acw_countdown_web_rtc_timer.getTimeValues().toString());

            }
            else {

                if (element) {
                    element.onclick = function () {
                        shared_data.callDetails.number = $scope.notification_call.number;
                        $scope.notification_panel_phone.make_call(shared_data.callDetails.number);
                    };
                }
                $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
                //document.getElementById('calltimmer').getElementsByTagName('timer')[0].stop();
                $('#calltimmer').addClass('display-none').removeClass('call-duations');
                $('#countdownCalltimmer').addClass('call-duations').removeClass('display-none');
                document.getElementById('callStatus').innerHTML = 'ACW';
                //document.getElementById('countdownCalltimmer').getElementsByTagName('timer')[0].start();
                $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
                $('#conferenceCall').addClass('display-none').removeClass('display-inline');
                $('#morebtn').addClass('display-none').removeClass('phone-sm-btn phone-sm-bn-p8 veery-font-1-more');
                $('#endButton').addClass('display-none ');
                $('#etlCall').addClass('display-none').removeClass('display-inline');
                //$('#holdButton').addClass('display-none ').removeClass('display-inline');
                $('#holdButton').addClass('display-none');
                $('#unholdButton').addClass('display-none');
                $('#muteButton').addClass('display-none ').removeClass('display-inline');
                $('#speakerMuteButton').addClass('display-none ');
                $('#speakerUnmuteButton').addClass('display-none');
                // $('#swapCall').addClass('display-none').removeClass('display-inline');
                $('#transferCall').addClass('display-none').removeClass('display-inline');
                $('#transferIvr').addClass('display-none').removeClass('display-inline');
                $('#divKeyPad').removeClass('display-none');
                $('#divIvrPad').addClass('display-none');
                $('#dialPad').addClass('display-none').removeClass('veery-font-1-menu-4');
                $('#contactList').addClass('display-none').removeClass('veery-font-1-user');
                $('#freezebtn').addClass('phone-sm-btn ').removeClass('display-none');
                $('#endACWbtn').addClass('phone-sm-btn ').removeClass('display-none');
                call_duration_webrtc_timer.reset();
                call_duration_webrtc_timer.stop();
                $('#call_notification_call_duration_webrtc_timer').html("00:00:00");
                acw_countdown_web_rtc_timer.start({countdown: true, startValues: {seconds: shared_data.acw_time}});
                $('#call_notification_acw_countdown_web_rtc_timer.values').html(acw_countdown_web_rtc_timer.getTimeValues().toString());





                /* $('#call_notification_call_function_btns').addClass('display-none');
                 $('#call_notification_acw_panel').removeClass('display-none');
                 $('#call_notification_Information').addClass('display-none');
                 $('#call_notification_outbound').addClass('display-none');

                 $('#call_notification_freeze').addClass('display-none');
                 $('#call_notification_call_transfer_panel').addClass('display-none');
                 // Kasun_Wijeartne_18_MAY_2018
                 $('#call_notification_body').css('height', '100%');
                 // Kasun_Wijeartne_18_MAY_2018 - END
                 $('#call_notification_acw').removeClass('display-none');


                 acw_countdown_timer.start({countdown: true, startValues: {seconds: shared_data.acw_time}});
                 $('#call_notification_acw_countdown_timer .values').html(acw_countdown_timer.getTimeValues().toString());*/
            }
            $scope.isAcw = true;
            $scope.inCall = false;
            stopRingbackTone();
            stopRingTone();
            phone_status = "call_disconnected";
            shared_data.agent_status = "AfterWork";
            shared_data.allow_mode_change = false;
        },
        call_mute: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#speakerMuteButton').addClass('display-none');
            $('#speakerUnmuteButton').removeClass('display-none');
            //}
            /*else {
                $('#call_notification_call_mute_btn').addClass('display-none');
                $('#call_notification_call_unmute_btn').removeClass('display-none');
            }*/
            phone_status = "call_mute";
        },
        call_unmute: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#speakerMuteButton').removeClass('display-none');
            $('#speakerUnmuteButton').addClass('display-none');
            //} else {
            //$('#call_notification_call_unmute_btn').addClass('display-none');
            // $('#call_notification_call_mute_btn').removeClass('display-none');
            //}

            phone_status = "call_unmute";
        },
        call_hold: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            //$('#holdButton').addClass('phone-sm-btn phone-sm-bn-p8 call-hold');
            $('#holdButton').addClass('display-none');
            $('#unholdButton').removeClass('display-none');
            // } else {
            //$('#call_notification_call_hold_btn').addClass('display-none');
            //$('#call_notification_call_unhold_btn').removeClass('display-none');
            // }
            phone_status = "call_hold";
        },
        call_unhold: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#holdButton').removeClass('display-none');
            $('#unholdButton').addClass('display-none')
            //}
            //else {
            //$('#call_notification_call_unhold_btn').addClass('display-none');
            //$('#call_notification_call_hold_btn').removeClass('display-none');
            //}
            phone_status = "call_hold";
        },
        call_freeze_req: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#freezeRequest').removeClass('display-none');
            $('#endACWbtn').addClass('display-none');
            $('#freezebtn').addClass('display-none');
            acw_countdown_web_rtc_timer.pause();
            // } else {
            // acw_countdown_timer.pause();
            // $('#call_notification_freeze_btn').addClass('display-none');
            // $('#call_notification_end_acw_btn').addClass('display-none');
            // $('#call_notification_freeze_request').removeClass('display-none');
            // }
            phone_status = "call_freeze_req";
        },
        call_freeze_req_cancel: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#freezeRequest').addClass('display-none');
            $('#endACWbtn').removeClass('display-none');
            $('#freezebtn').removeClass('display-none');
            acw_countdown_web_rtc_timer.start();
            // } else {
            // acw_countdown_timer.start();
            // $('#call_notification_freeze_request').addClass('display-none');
            // $('#call_notification_freeze_btn').removeClass('display-none');
            // $('#call_notification_end_acw_btn').removeClass('display-none');
            //}

            phone_status = "call_freeze_req_cancel";
        },
        call_freeze: function () {
            // if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#countdownCalltimmer').addClass('display-none').removeClass('call-duations');
            $('#freezeRequest').addClass('display-none');
            $('#calltimmer').addClass('call-duations').removeClass('display-none');
            $('#endfreezebtn').addClass('phone-sm-btn ').removeClass('display-none');
            $('#freezebtn').removeClass('phone-sm-btn ').addClass('display-none');
            $('#endACWbtn').addClass('display-none').removeClass('phone-sm-btn ');
            $('#freezeRequest').addClass('display-none').removeClass('call-duations');

            call_duration_webrtc_timer.reset();
            $("#freezebtn").attr({
                "title": "End-Freeze [Alt+Z]"
            });
            //freeze_timer.reset();
            /*} else {
                $('#call_notification_call_function_btns').addClass('display-none');
                $('#call_notification_acw_panel').removeClass('display-none');
                $('#call_notification_Information').addClass('display-none');
                $('#call_notification_outbound').addClass('display-none');

                $('#call_notification_acw').addClass('display-none');
                $('#call_notification_freeze').removeClass('display-none');
                $('#call_notification_freeze_btn').removeClass('display-none');
                $('#call_notification_end_acw_btn').removeClass('display-none');
                $('#call_notification_freeze_request').addClass('display-none');
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', '100%');
                // Kasun_Wijeartne_18_MAY_2018 - END
                acw_countdown_timer.stop();
                freeze_timer.reset();
            }*/
            $scope.freeze = true;
            phone_status = "call_freeze";
        },
        call_transfer_view: function () {
            if (shared_data.phone_strategy === "veery_web_rtc_phone") {

            }
            else {
                $('#call_notification_call_function_btns').addClass('display-none');
                $('#call_notification_call_transfer_panel').removeClass('display-none');
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', 'calc(100% - 40px)');
                // Kasun_Wijeartne_18_MAY_2018 - END
            }


        },
        call_close_transfer_view: function () {
            if (shared_data.phone_strategy === "veery_web_rtc_phone") {

                return;
            }
            $('#call_notification_call_function_btns').removeClass('display-none');
            $('#call_notification_call_transfer_panel').addClass('display-none');
            // Kasun_Wijeartne_18_MAY_2018
            $('#call_notification_body').css('height', 'calc(100% - 40px)');
            // Kasun_Wijeartne_18_MAY_2018 - END
        },
        call_transfering: function () {
            $('#call_notification_endcall_btn').addClass('display-none');
            $('#call_notification_endcall_btn_dumy').addClass('display-none');
            if (shared_data.phone_strategy === "veery_web_rtc_phone") {
                $('#phoneBtnWrapper').removeClass('display-none');
                $('#onlinePhoneBtnWrapper').addClass('display-none');
            }
            call_transfer_progress = true;
        },
        call_transfer: function () {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#etlCall').removeClass('display-none').addClass('display-inline');
            $('#transferCall').addClass('display-none').removeClass('display-inline');
            $('#transferIvr').addClass('display-none').removeClass('display-inline');
            $('#conferenceCall').removeClass('display-none').addClass('display-inline');

            /*} else {
                $('#call_notification_endcall_btn').removeClass('display-none');
                $('#call_notification_endcall_btn_dumy').removeClass('display-none');
                $('#call_notification_call_function_btns').removeClass('display-none');
                $('#call_notification_call_conference_btn').removeClass('display-none');
                $('#call_notification_call_etl_btn').removeClass('display-none');
                $('#call_notification_call_transfer_panel').addClass('display-none');
                $('#call_notification_call_transfer_btn').addClass('display-none');
                $('#call_notification_call_hold_btn').addClass('display-none');
                // Kasun_Wijeartne_18_MAY_2018
                $('#call_notification_body').css('height', 'calc(100% - 40px)');
                // Kasun_Wijeartne_18_MAY_2018 - END
            }*/

            phone_status = "call_transfer";
            call_transfer_progress = true;
        },
        call_conference: function () {
            // if (shared_data.phone_strategy === "veery_web_rtc_phone") {
            $('#etlCall').addClass('display-none').removeClass('display-inline');
            $('#conferenceCall').addClass('display-none').removeClass('display-inline');
            /*}
            else {
                $('#call_notification_call_conference_btn').addClass('display-none');
                $('#call_notification_call_etl_btn').addClass('display-none');
            }*/

            phone_status = "call_conference";
        },
        update_call_status: function (status) {
            //if (shared_data.phone_strategy === "veery_web_rtc_phone") {
                document.getElementById('callStatus').innerHTML = status;
                return;
           // }

        },
        transfer_ended: function (data) {
            /*
                Message: "transfer_ended|8c44a390-d3b5-11e8-85d6-512f1f97c823|OUTBOUND|10001|duorusiru|OUTBOUND|outbound|call|undefined|9a2081cc-938d-4ae6-b371-b572867ca4ca|NORMAL_CLEARING"
                Message: "agent_connected|9a2081cc-938d-4ae6-b371-b572867ca4ca|OUTBOUND|94112375000|94112375000|10001|OUTBOUND|outbound|call|undefined|d26436a3-377e-4474-86eb-b09cac3d7ca8"
                Message: "agent_found|d26436a3-377e-4474-86eb-b09cac3d7ca8|OUTBOUND|94112375000|94112375000|duoarafath|OUTBOUND|outbound|call|undefined|9a2081cc-938d-4ae6-b371-b572867ca4ca"
             */
            console.log("Transfer_ended--------------------------------------");
            console.log(data);
            if (data && data.Message) {
                var splitMsg = data.Message.split('|');
                /*var current_call_id = (shared_data.callDetails.direction && shared_data.callDetails.direction.toLowerCase() === 'outbound') ?
                    shared_data.callDetails.sessionId:shared_data.callDetails.callrefid;*/
                var current_call_id = splitMsg[9];
                // is that transfer end event came for current call
                if (shared_data.callDetails.sessionId === undefined || current_call_id !== shared_data.callDetails.callre_uniq_id) {
                    return;
                }
                //is that transfer end event came after call disconnect
                if (shared_data.callDetails.sessionId && (current_call_id === shared_data.callDetails.callre_uniq_id && shared_data.agent_status !== "Connected")) {
                    return;
                }
                if (splitMsg.length > 5) {
                    shared_function.showAlert("Call Transfer", 'warn', 'Call transfer ended for ' + splitMsg[4] + " " + splitMsg[10]);
                }
                if (shared_data.phone_strategy === "veery_web_rtc_phone") {
                    $('#transferCall').addClass('display-inline').removeClass('display-none');
                    $('#conferenceCall').addClass('display-none').removeClass('display-inline');
                    $('#etlCall').addClass('display-none').removeClass('display-inline');
                }
                notification_panel_ui_state.call_end_etl();
            }
            call_transfer_progress = false;
        },
        /*transfer_ended: function (data) {
            if (data && data.Message) {
                var splitMsg = data.Message.split('|');
                if(shared_data.callDetails.sessionId===undefined || shared_data.callDetails.sessionId !== splitMsg[9]){
                    return;
                }
                if (shared_data.callDetails.sessionId && ( shared_data.callDetails.sessionId === splitMsg[9] && shared_data.agent_status !== "Connected") ){
                    return;
                }
                if (splitMsg.length > 5) {
                   // shared_function.showAlert(splitMsg[10], 'warn', 'Call transfer ended for ' + splitMsg[4]);
                    shared_function.showAlert("Call Transfer", 'warn', 'Call transfer ended for ' + splitMsg[4] +" " + splitMsg[10]);
                }
                if (shared_data.phone_strategy === "veery_web_rtc_phone") {
                    $('#transferCall').addClass('display-inline').removeClass('display-none');
                    $('#conferenceCall').addClass('display-none').removeClass('display-inline');
                    $('#etlCall').addClass('display-none').removeClass('display-inline');
                }
                notification_panel_ui_state.call_end_etl();
            }
            call_transfer_progress = false;
        },*/
        transfer_trying: function (data) {
            if (data && data.Message) {
                var splitMsg = data.Message.split('|');

                if (splitMsg.length >= 9) {
                    $scope.notification_call.transferName = 'Transfer Call From : ' + splitMsg[3];
                    $scope.notification_call.number = splitMsg[8];
                }
            }
        },
        agent_suspended: function (data) {
            agent_status_mismatch_count++;
            var taskType = "Call";
            if (data && data.Message) {
                var values = data.Message.split(":");
                if (values.length > 2) {
                    taskType = values[2];
                }
                else {
                    taskType = values[1];
                }
            }

            $ngConfirm({
                icon: 'fa fa-universal-access',
                title: 'Suspended!',
                content: '<div class="suspend-header-txt"> <h5>' + taskType.trim() + ' Task Suspended</h5> <span>Hi ' + $scope.firstName + ', Your account is suspended. Please Re-Register. </span></div>',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: 'Ok',
                        btnClass: 'btn-red',
                        action: function () {
                            if (phone_status != "Offline")
                                $scope.notification_panel_phone.unregister();
                            agent_status_mismatch_count = 0;
                        }
                    }
                },
                columnClass: 'col-md-6 col-md-offset-3',
                /*boxWidth: '50%',*/
                useBootstrap: true
            });
            $('#userStatus').addClass('agent-suspend').removeClass('online');
        },
        showPhoneBook: function () {
            if (pinHeight != 0)
                removePin();
            $('#phoneBook').animate({
                left: '0'
            }, 500);
            $('#contactBtnWrp').removeClass('display-none');
            $('#phoneBtnWrapper').addClass('display-none');
            if ($('.contact-info-wr.height-auto')) $('.contact-info-wr').removeClass('height-auto');
        },
        hidePhoneBook: function () {
            $('#phoneBook').animate({
                left: '-235'
            }, 500);
            $('#contactBtnWrp').addClass('display-none');
            $('#phoneBtnWrapper').removeClass('display-none');
            $('.contact-info-wr').addClass('height-auto');
        },
        phoneLoading: function () {
            $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
            $('#isLoadingRegPhone').addClass('display-block').removeClass('display-none');
            $('#phoneRegister').addClass('display-none');
            $('#isBtnReg').addClass('display-none ').removeClass('display-block active-menu-icon');
            $('#softPhone').removeClass('display-block ').addClass('display-none');
        }
    };
    /* ---------------- UI status -------------------------------- */


    var subscribeEvents = {
        onClose: function (event) {
            /* if (veery_api_key === "" || veery_api_key === undefined) {
                 console.log("invalidMessage.");
                 return;
             }
             console.log(event);
             var msg = "Connection Interrupted with Phone.";
             notification_panel_ui_state.phone_operation_error ('Connection Interrupted', msg);
             sipConnectionLostCount++;*/
            veery_api_key === undefined;
            if (veery_api_key === "" || veery_api_key === undefined) {
                console.error("error occurred." + event);
                if (sipConnectionLostCount === 2) {
                    sipConnectionLostCount++;
                    veery_phone_api.unsubscribeEvents();
                    shared_data.phone_strategy = phoneSetting.phone_communication_strategy;
                    initialize_phone();
                    sipConnectionLostCount = 0;
                }
                sipConnectionLostCount++;
                return;
            }

        },
        onError: function (event) {
            if (sipConnectionLostCount==2){
                notification_panel_ui_state.phone_operation_error('Connection Interrupted');
            }
            veery_api_key === undefined;
            if (veery_api_key === "" || veery_api_key === undefined) {
                console.error("error occurred." + event);
                if (sipConnectionLostCount === 2) {
                    sipConnectionLostCount++;
                    veery_phone_api.unsubscribeEvents();
                    shared_data.phone_strategy = phoneSetting.phone_communication_strategy;
                    initialize_phone();
                    sipConnectionLostCount = 0;
                }
                sipConnectionLostCount++;
                return;
            }
            console.error(event);
            var msg = "Connection Interrupted with Phone.";
            if (sipConnectionLostCount < 1) {
                notification_panel_ui_state.phone_offline('Connection Interrupted', msg);
                veery_api_key = undefined;
            }
            sipConnectionLostCount++;
        },
        onForbidden: function (event) {
            notification_panel_ui_state.phone_operation_error('Connection Interrupted');
            notification_panel_ui_state.phone_offline('Connection Interrupted', event.data.description);
            /*veery_api_key === undefined;
            if (veery_api_key === "" || veery_api_key === undefined) {
                console.error("error occurred." + event);
                if (sipConnectionLostCount === 2) {
                    sipConnectionLostCount++;
                    veery_phone_api.unsubscribeEvents();
                    shared_data.phone_strategy = phoneSetting.phone_communication_strategy;
                    initialize_phone();
                    sipConnectionLostCount = 0;
                }
                sipConnectionLostCount++;
                return;
            }*/
            /*console.error(event);
            var msg = "Connection Interrupted with Phone.";
            if (sipConnectionLostCount < 1) {
                notification_panel_ui_state.phone_offline('Connection Interrupted', msg);
                veery_api_key = undefined;
            }*/
            //sipConnectionLostCount++;
        },
        onMessage: function (event) {
            console.log(event);
            var data = JSON.parse(event.data);
            switch (data.veery_command) {
                case 'Handshake':
                    veery_api_key = data.veery_api_key;
                    veery_phone_api.registerSipPhone(veery_api_key, phoneSetting, $crypto.decrypt(shared_data.pwd, "DuoS123"));
                    sipConnectionLostCount = 0;
                    break;
                case 'Initialized':
                    notification_panel_ui_state.phone_online();
                    call_in_progress = false;
                    call_transfer_progress = false;

                    if(shared_data.phone_config && shared_data.phone_config.autoAnswer){
                        veery_phone_api.autoAnswer(veery_api_key, shared_data.phone_config.autoAnswerDelay);
                    }

                    break;
                case 'InitializFail':
                    notification_panel_ui_state.phone_offline("Soft Phone", "Fail To Initialize Soft-Phone");
                    call_in_progress = false;
                    call_transfer_progress = false;
                    break;
                case 'ReciveCallInfo':
                    notification_panel_ui_state.ReciveCallInfo(data.veery_data, data.Number);
                    break;
                case 'IncomingCall':

                    var no = data.number ? data.number : "N/A";
                    console.log("Incoming_call : " + no);
                    $scope.addToCallLog(no, 'Missed Call');
                    if ($scope.isAcw || $scope.freeze) {
                        console.info("........................... Reject Call ........................... " + no);
                        $scope.notification_panel_phone.call_end();
                        $scope.addToCallLog(no, 'System Reject');
                        return;
                    }
                    shared_data.callDetails.number = no;
                    shared_data.callDetails.direction = "inbound";
                    shared_data.last_received_call = no;
                    $scope.notification_call.number = no;
                    notification_panel_ui_state.call_incoming();
                    break;
                case 'MakeCall':
                    //call_in_progress = true;
                    notification_panel_ui_state.outbound_call_connected();
                    break;
                case 'AnswerCall':
                    call_in_progress = true;
                    notification_panel_ui_state.call_connected();
                    break;
                case 'AnswerCallFail':
                    call_in_progress = false;
                    shared_function.showWarningAlert("Phone", "Fail To Answer Call");
                    notification_panel_ui_state.call_disconnected();
                    break;
                case 'EndCall':
                    call_in_progress = false;
                    notification_panel_ui_state.call_disconnected();
                    break;
                case 'HoldCall':
                    notification_panel_ui_state.call_hold();
                    break;
                case 'UnholdCall':
                    notification_panel_ui_state.call_unhold();
                    break;
                case 'MuteCall':
                    notification_panel_ui_state.call_mute();
                    break;
                case 'UnmuteCall':
                    notification_panel_ui_state.call_unmute();
                    break;
                case 'TransferCall':
                    notification_panel_ui_state.call_transfer();
                    break;
                case 'TransferIVR':
                    notification_panel_ui_state.call_transfer();
                    break;
                case 'ConfCall':
                    notification_panel_ui_state.call_conference();
                    break;
                case 'EtlCall':
                    notification_panel_ui_state.call_end_etl();
                    break;
                case 'Freeze':
                    if (shared_data.callDetails.sessionId === data.session_id) {
                        notification_panel_ui_state.call_freeze();
                    } else {
                        console.error("try to freeze for invalid call session");
                        notification_panel_ui_state.call_freeze_req_cancel();
                    }
                    break;
                case 'FreezeReqCancel':
                    notification_panel_ui_state.call_freeze_req_cancel();
                    break;
                case 'EndFreeze':
                    if (shared_data.callDetails.sessionId === data.session_id) {
                        notification_panel_ui_state.call_idel();
                    } else {
                        console.error("try to end freeze for invalid call session");
                        notification_panel_ui_state.call_freeze_req_cancel();
                    }
                    break;
                case 'OperationError':
                case 'Error':
                    notification_panel_ui_state.phone_operation_error(data.description);
                    call_in_progress = false;
                    break;
                /*case 'OperationError':
                    shared_function.showAlert("Soft Phone", "error", data.description);
                    break;*/
                case 'Session Progress':
                    shared_function.showAlert("Soft Phone", "info", 'Session Progress');
                    break;
                case 'Offline':
                case 'Unregistor':
                    notification_panel_ui_state.phone_offline("Phone Offline", "Soft Phone Unregistered.");
                    call_in_progress = false;
                    break;
                case 'Unauthorized':
                    shared_function.showWarningAlert("Unauthorized", data.description);
                    break;
                default:

            }
        }

    };

    /* ----------------------------  event subscribe ------------------------------------------*/

    var agent_status_mismatch_count = 0;
    shared_data.agent_status = "Offline"; //Reserved , Break , Connected , AfterWork , Suspended , Available
    shared_data.allow_mode_change = true;
    var check_agent_status_timer = {};

    var mismatch_with_ards = 0;
    var validate_status_with_ards_timer = {};
    var validate_status_with_ards_mismatch_timer = undefined;
    var validate_agent_status = function (message) {
        function other_status_validation(slotState, slotMode)//Reserved , Connected , AfterWork , Available , offline
        {
            function validate_status_with_ards(slotState, slotMode) {

                resourceService.validate_status_with_ards(authService.GetResourceId()).then(function (response) {

                    if (agent_status_mismatch_count === 0) {
                        return;
                    }
                    if (response && response.ConcurrencyInfo && response.ResourceStatus) {
                        var status_match = false;
                        if (response.ConcurrencyInfo.SlotInfo) {
                            var tempData = $filter('filter')(response.ConcurrencyInfo.SlotInfo, {"HandlingType": "CALL"}, true);
                            if (tempData && tempData.any()) {
                                status_match = tempData.State === shared_data.agent_status;
                            }
                        }
                        var mode_match = response.ResourceStatus.Mode === shared_data.currentModeOption;
                        if (status_match && mode_match) {
                            agent_status_mismatch_count = 0;
                            $timeout.cancel(validate_status_with_ards_timer);
                            if (validate_status_with_ards_mismatch_timer) {
                                $timeout.cancel(validate_status_with_ards_mismatch_timer);
                            }
                            console.log("----------------------- Status Match, After Validate With Server -----------------------------" + agent_status_mismatch_count + ":" + mismatch_with_ards);
                        } else {
                            console.log("----------------------- Status Mismatch, After Validate With Server -----------------------------" + agent_status_mismatch_count + ":" + mismatch_with_ards);
                            if ((mismatch_with_ards % 3) === 0) {
                                shared_function.showWarningAlert("Agent Status", "Agent Status not match with backend service. please re-register.");
                                return;
                            }
                            validate_status_with_ards_mismatch_timer = $timeout(function () {
                                console.log("----------------------- Status Mismatch, Start Validate With Server [Retry] -----------------------------" + agent_status_mismatch_count + ":" + mismatch_with_ards);
                                validate_status_with_ards(slotState, slotMode);
                            }, status_sync.re_validate_interval);
                        }
                    } else {
                        if (mismatch_with_ards >= 3) {
                            shared_function.showWarningAlert("Agent Status", "Agent Status not match with backend service. please re-register.");
                            return;
                        }
                        validate_status_with_ards_mismatch_timer = $timeout(function () {
                            validate_status_with_ards(slotState, slotMode);
                        }, status_sync.re_validate_interval);
                    }

                    /*
                                        mismatch_with_ards++
                                        if (response) {
                                            agent_status_mismatch_count = 0;
                                            $timeout.cancel(validate_status_with_ards_timer);
                                            if (validate_status_with_ards_mismatch_timer) {
                                                $timeout.cancel(validate_status_with_ards_mismatch_timer);
                                            }
                                        }
                                        else {
                                            if (mismatch_with_ards >= 3) {
                                                shared_function.showWarningAlert("Agent Status", "Agent Status not match with backend service. please re-register.");
                                                return;
                                            }
                                            validate_status_with_ards_mismatch_timer = $timeout(function () {
                                                validate_status_with_ards(slotState, slotMode);
                                            }, 60000);
                                        }*/
                }, function (error) {
                    console.log(error);
                    $scope.showAlert("Agent Status", "error", "Fail To Validate Agent Status.");
                })
            }

            if (agent_status_mismatch_count === 0) {
                validate_status_with_ards_timer = $timeout(function () {
                    console.log("----------------------- Status Mismatch, Start Validate With Server -----------------------------" + agent_status_mismatch_count);
                    validate_status_with_ards(slotState, slotMode);
                }, status_sync.validate_interval);
            }
            else {
                console.error("Your status not match with backend service. please re-register..............................");
                shared_function.showWarningAlert("Agent Status", "Your status not match with backend service. please re-register.");
            }
            agent_status_mismatch_count++;
        }

        if (message && (message.resourceId === authService.GetResourceId())) {
            if (message.task === "CALL") {
                if (!shared_data.phone_initialize && (shared_data.call_task_registered) && (agent_status_mismatch_count % 3) === 0) {
                    shared_function.showWarningAlert("Agent Status", "Please Initialize Soft Phone.");
                    console.error("Please Initialize Soft Phone.............................");
                    agent_status_mismatch_count++;
                    return;
                }
                if (shared_data.agent_status === message.slotState && shared_data.currentModeOption === message.slotMode) {
                    agent_status_mismatch_count = 0;
                    mismatch_with_ards = 0;
                    $timeout.cancel(validate_status_with_ards_timer);
                    if (validate_status_with_ards_mismatch_timer) {
                        $timeout.cancel(validate_status_with_ards_mismatch_timer);
                    }
                    console.log("----------------------- Status Match And Reset Error Count -----------------------------" + agent_status_mismatch_count);
                    return;
                }

                if (shared_data.currentModeOption != message.slotMode && (agent_status_mismatch_count % 3) === 0) { //&& (agent_status_mismatch_count % 3) === 0
                    agent_status_mismatch_count++;
                    shared_function.showWarningAlert("Agent Mode", "Agent Mode Mismatch With Servers. Please re-register");
                    console.error("----------------------- Status[mode] Mismatch -----------------------------" + agent_status_mismatch_count);
                    return;
                }

                if (shared_data.agent_status != message.slotState) {
                    if ((agent_status_mismatch_count % 3) === 0) {
                        console.log("----------------------- Status Mismatch ----------------------------- agent_status : " + shared_data.agent_status + " slotState : " + message.slotState + " -- " + agent_status_mismatch_count);
                        switch (message.slotState) {
                            case "Suspended":
                                if (shared_data.agent_status === "Suspended")
                                    return;
                                var data = {Message: "Reject Count Exceeded!, Account Suspended for Task: CALL"};
                                console.error("----------------------- Status[mode] Mismatch, Reject Count Exceeded!, Account Suspended for Task: CALL-----------------------------" + agent_status_mismatch_count);
                                notification_panel_ui_state.agent_suspended(data);
                                break;
                            case "Break":
                                if (shared_data.agent_status === "Break")
                                    return;
                                console.error("----------------------- Status[Break] Mismatch -----------------------------" + agent_status_mismatch_count);
                                shared_function.showWarningAlert("Agent Status", "Agent Status mismatch. Please re-register.");
                                break;
                            default:
                                // call status ignored. after discuss with team
                                //  other_status_validation(message.slotState, message.slotMode);
                                break;
                        }
                    }
                    else {
                        agent_status_mismatch_count++;
                        console.log("----------------------- Status Mismatch [ignore] ----------------------------- agent_status : " + shared_data.agent_status + " slotState : " + message.slotState + " -- " + agent_status_mismatch_count);
                    }
                }
            }
        }
    };


    var subscribe_to_event_and_dashboard = function () {
        try {
            chatService.SubscribeEvents("call_notification_controller", function (event, data) {
                switch (event) {
                    case 'transfer_ended':
                        notification_panel_ui_state.transfer_ended(data);
                        break;
                    case 'transfer_trying':
                        notification_panel_ui_state.transfer_trying(data);
                        break;
                    case 'agent_suspended':
                        notification_panel_ui_state.agent_suspended(data);
                        break;
                    case 'agent_disconnected':
                        if (shared_data.phone_strategy === "veery_rest_phone") {
                            notification_panel_ui_state.call_disconnected();
                        }
                        break;
                    case 'agent_connected':
                        var values = data.Message.split("|");
                        if (values.length > 10) {
                            $scope.notification_call.callrefid = values[10];
                            shared_data.callDetails.callrefid = values[10];
                        }
                        if (shared_data.phone_strategy === "veery_rest_phone") {
                            notification_panel_ui_state.call_connected();
                        }
                        break;
                    case 'agent_rejected':
                        if (shared_data.phone_strategy === "veery_rest_phone") {
                            notification_panel_ui_state.call_disconnected();
                        }
                        if (shared_data.last_received_call != shared_data.callDetails.number) {
                            shared_data.callDetails.number = "";
                        }
                        break;
                    case 'agent_found':
                        $scope.safeApply(function () {
                            $scope.notification_panel_phone.init_call_details(data);
                        });

                        break;
                }
            });

            chatService.SubscribeDashboard("call_notifications_controller_dashboard", function (event) {
                switch (event.roomName) {
                    case 'ARDS:freeze_exceeded':
                        console.log("ARDS:freeze_exceeded----------------------------------------------------");
                        var resourceId = authService.GetResourceId();
                        if ($scope.profile && event.Message && event.Message.ResourceId === resourceId) {
                            $scope.profile.freezeExceeded = true;
                            notification_panel_ui_state.update_call_status('Freeze Exceeded.');
                        }
                        break;
                    case 'ARDS:ResourceStatus':
                        console.log("ARDS:ResourceStatus----------------------------------------------------");
                        if (status_sync.enable)
                            validate_agent_status(event.Message);
                        break;
                }


            });
        }
        catch (ex) {
            console.error(ex);
        }

    };
    /* ----------------------------  event subscribe ------------------------------------------*/

    var initialize_phone = function () {

        /*if(shared_data.phone_initializing){
            shared_function.showAlert("Soft Phone", 'warn', 'Phone In Initializing process');
            console.error("------------------------------------ Phone in Initializing process---------------------------------------------------------------------");

            return;
        }*/
        shared_data.phone_initializing = true;
        veery_phone_api.setStrategy(shared_data.phone_strategy);
        notification_panel_ui_state.phoneLoading();
        veery_phone_api.subscribeEvents(subscribeEvents);
    };

    var set_agent_status_available = function () {
        if (shared_data.call_task_registered && (phone_status === "phone_online" || phone_status === "call_idel") && (shared_data.currentModeOption === "Inbound" || shared_data.currentModeOption === "Outbound")) {
            shared_data.agent_status = "Available";
            shared_data.allow_mode_change = true;
        }
    };

    $scope.setIvrExtension = function (ivr) {
        $scope.notification_call.number = ivr.Extension;
        shared_data.callDetails.number = ivr.Extension;
        $scope.notification_panel_ui_methid.showIvrPenel();
        $scope.notification_panel_phone.call_transfer_ivr(ivr.Extension);
        /*phoneFuncion.hideIvrBtn();
        phoneFuncion.hideIvrList();*/
        //$scope.veeryPhone.ivrTransferCall(ivr.Extension);
    };

    var command_processor = function (args) {
        try {
            if (args) {
                switch (args.command) {
                    case 'set_ivr_extension': {
                        $scope.setIvrExtension(args.data.ivr);
                        break;
                    }
                    case 'set_agent_extension': {
                        $scope.notification_call.number = args.data.extension;
                        shared_data.callDetails.number = args.data.extension;
                        break;
                    }
                    case 'set_agent_status_available': {
                        set_agent_status_available();
                        break;
                    }
                    case 'initialize_phone': {
                        veery_api_key = "";
                        agent_status_mismatch_count = 0;
                        sipConnectionLostCount = 0;
                        if (shared_data.phone_strategy != "" && args.data != shared_data.phone_strategy) {
                            veery_phone_api.resetPhone(veery_api_key);
                            shared_data.phone_strategy = args.data;
                            $('#softPhone').removeClass('display-block ').addClass('display-none');
                            $('#call_notification_panel').addClass('display-none');
                        }
                        initialize_phone();
                        break;
                    }
                    case 'uninitialize_phone': {
                        if (shared_data.phone_initialize) {
                            $scope.notification_panel_phone.unregister();
                        }
                        break;
                    }
                    case 'incoming_call_notification': {
                        $scope.notification_panel_phone.reset_local_call_details();
                        $scope.notification_call = args.data;
                        $scope.notification_call = args.data;
                        if (!shared_data.phone_initialize) {
                            if ((agent_status_mismatch_count % 3) === 0) {
                                shared_function.showWarningAlert("Agent Status", "Please Initialize Soft Phone.");
                            }
                            console.error("Please Initialize Soft Phone.............................");
                            agent_status_mismatch_count++;
                            return;
                        }
                        if ((args.data.direction && args.data.direction.toLowerCase() === 'inbound') && shared_data.phone_strategy === "veery_rest_phone") {
                            veery_phone_api.incomingCall(veery_api_key, args.data.number, my_id);
                        }
                        console.log("----------------------- incoming_call_notification -----------------------------\n %s \n----------------------- incoming_call_notification -----------------------------", JSON.stringify($scope.notification_call));
                        break;
                    }
                    /*case 'make_call': {
                        if (args.data) {
                            $scope.notification_panel_phone.make_call(args.data.callNumber);
                            $scope.tabReference = args.data.tabReference;
                            notification_panel_ui_state.hidePhoneBook();
                            $scope.notification_call.number = args.data.callNumber;
                            shared_data.callDetails.number = args.data.callNumber;
                        }
                        else {
                            console.error("invalid make call command");
                        }
                        break;
                    }*/
                    case 'make_call': {
                        if (args.data) {
                            $scope.notification_panel_phone.reset_local_call_details();
                            if (call_in_progress && args.data.type && args.data.type === "phoneBook") {
                                if (call_transfer_progress) {
                                    shared_function.showWarningAlert("Soft Phone", "Call Transfer in Possessing.");
                                    return;
                                }
                                $scope.notification_panel_phone.call_transfer(args.data.callNumber);
                            }
                            else {
                                $scope.notification_panel_phone.make_call(args.data.callNumber);
                            }

                            $scope.tabReference = args.data.tabReference;
                            notification_panel_ui_state.hidePhoneBook();
                            $scope.notification_call.number = args.data.callNumber;
                            shared_data.callDetails.number = args.data.callNumber;
                        }
                        else {
                            console.error("invalid make call command");
                        }
                        break;
                    }
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    };

    angular.element(document).ready(function () {
        console.log("Load Notification Doc.............................");
        /*$rootScope.$on("initialize_phone", function (event, data) {
            if (data.initialize) {
                veery_phone_api.setStrategy(shared_data.phone_strategy);
                notification_panel_ui_state.phoneLoading();
                veery_phone_api.subscribeEvents(subscribeEvents);
            }
            else {
                if (!data.initialize)
                    $scope.notification_panel_phone.unregister();
            }
        });*/

        /*$rootScope.$on("incoming_call_notification", function (event, data) {
            $scope.notification_call = data;
            if (data.direction.toLowerCase() === 'inbound' && shared_data.phone_strategy === "veery_rest_phone") {
                veery_phone_api.incomingCall(veery_api_key, data.number, my_id);
            }
        });*/

        /*var make_call_handler = $rootScope.$on('makecall', function (events, args) {
            if (args) {
                $scope.notification_panel_phone.make_call(args.callNumber);
                $scope.tabReference = args.tabReference;
                $scope.notification_call.number = args.callNumber;
                shared_data.callDetails.number = args.callNumber;
            }
        });*/


        var command_handler = $rootScope.$on('execute_command', function (events, args) {
            command_processor(args);
        });


        var mode_change_watch = $scope.$watch(function () {
            return shared_data.currentModeOption;
        }, function (newValue, oldValue) {
            console.log("---------------------  Agent Mode Change to : " + newValue + " --------------------------------");
            if (!shared_data.phone_initialize)
                return;
            if (shared_data.phone_strategy === "veery_web_rtc_phone")
                return;
            if (newValue.toString() === "Outbound" && (phone_status === "phone_online" || phone_status === "call_disconnected" || phone_status === "call_idel")) {
                notification_panel_ui_state.phone_outbound();
                $scope.notification_panel_phone.phone_mode_change(newValue);
            }
            else if (newValue.toString() === "Inbound" && shared_data.agent_status != "AfterWork") {
                notification_panel_ui_state.phone_inbound();
                $scope.notification_panel_phone.phone_mode_change(newValue);
            }

            set_agent_status_available();
        });

        var phone_strategy_change_watch = $scope.$watch(function () {
            return shared_data.phone_strategy;
        }, function (newValue, oldValue) {
            if (oldValue) {
                veery_phone_api.unsubscribeAfterFail(oldValue);
            }
            $('#phoneStrategyIcon').attr('src', 'assets/img/' + newValue + '.svg');
        });

        var agent_status_watch = $scope.$watch(function () {
            return shared_data.agent_status;
        }, function (newValue, oldValue) {
            console.log("--------------------- Agent Status Changed [" + oldValue + "]  To [" + newValue + "] --------------------------------");
        });

        var task_change_watch = $scope.$watch(function () {
            return shared_data.call_task_registered;
        }, function (newValue, oldValue) {
            console.log("---------------------  Call Task Register State : " + newValue + " --------------------------------");
            set_agent_status_available();
        });

        $('#isBtnReg').addClass('display-none').removeClass('display-block active-menu-icon');
        $('#isCallOnline').addClass('display-none').removeClass('display-block deactive-menu-icon');

        // clean up listener when directive's scope is destroyed
        $scope.$on('$destroy', command_handler);
        $scope.$on('$destroy', mode_change_watch);
        //$scope.$on('$destroy', make_call_handler);
        $scope.$on('$destroy', task_change_watch);
        $scope.$on('$destroy', phone_strategy_change_watch);
        $scope.$on('$destroy', agent_status_watch);

        subscribe_to_event_and_dashboard();
        if (shared_data.phone_strategy === "veery_rest_phone") {
            veery_api_key = "";
            agent_status_mismatch_count = 0;
            sipConnectionLostCount = 0;
            // initialize_phone();
        }
    });


    $('#softPhoneDragElem').draggable({
        preventCollision: true,
        containment: "window",
        start: function (event, ui) {
            $scope.isEnableSoftPhoneDrag = true;
        },
        stop: function (event, ui) {
        }
    });

    // Kasun_Wijeratne_1_JUNE_2018
    $('#call_notification_panel').draggable({
        preventCollision: true,
        containment: "window",
        start: function (event, ui) {
            $('#call_notification_panel').addClass('dragging');
        },
        stop: function (event, ui) {
        }
    });
    // Kasun_Wijeratne_1_JUNE_2018

});