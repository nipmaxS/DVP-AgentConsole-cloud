/**
 * Created by dinusha on 5/28/2016.
 */

agentApp.controller('cdrCtrl', function ($scope, $filter, $q, $sce, $timeout, $http, profileDataParser, ngAudio,
                             baseUrls,$anchorScroll,identity_service) {

        $anchorScroll();
        $scope.dtOptions = {paging: false, searching: false, info: false, order: [7, 'desc']};
        $scope.config = {
            preload: "auto",
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: {
                url: "bower_components/videogular-themes-default/videogular.css"
            },
            "analytics": {
                "category": "Videogular",
                "label": "Main",
                "events": {
                    "ready": true,
                    "play": true,
                    "pause": true,
                    "stop": true,
                    "complete": true,
                    "progress": 10
                }
            }
        };

        $scope.moment = moment;

        $scope.isTableLoading = 0;
        $scope.enableSearchButton = true;


        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'boots' +
                    '' +
                    '' +
                    'trap3'
            });
        };

        $scope.pagination = {
            currentPage: 1,
            maxSize: 5,
            totalItems: 0,
            itemsPerPage: 10
        };

        $scope.startTimeNow = '12:00 AM';
        $scope.endTimeNow = '12:00 AM';

        $scope.timeEnabled = 'Date Only';
        $scope.timeEnabledStatus = false;

        $scope.businessUnitEnabled = false;

        $scope.changeTimeAvailability = function () {
            if ($scope.timeEnabled === 'Date Only') {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = false;
            }
        };

        $scope.dateValid = function () {
            if ($scope.timeEnabled === 'Date Only') {
                $scope.timeEnabled = 'Date & Time';
                $scope.timeEnabledStatus = true;
            }
            else {
                $scope.timeEnabled = 'Date Only';
                $scope.timeEnabledStatus = false;
            }
        };


        $scope.onDateChange = function () {
            if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
				$scope.dateValid = true;
            }
            else {
                $scope.dateValid = false;
            }
        };

        $scope.currentPlayingFile = null;

        $scope.hstep = 1;
        $scope.mstep = 15;

        var videogularAPI = null;


        $scope.onPlayerReady = function (API) {
            videogularAPI = API;

        };

        $scope.playStopFile = function (uuid) {
            if (videogularAPI)
            {
                if(videogularAPI.currentState === 'play')
                {
                    videogularAPI.stop();
                }
                var decodedToken = identity_service.getTokenDecode();

                if (decodedToken && decodedToken.company && decodedToken.tenant) {
                    var fileToPlay = baseUrls.fileService + 'FileService/File/DownloadLatest/'+uuid+'.mp3';

                    $http({
                        method: 'GET',
                        url: fileToPlay,
                        responseType: 'blob'
                    }).then(function successCallback(response)
                    {
                        if(response.data)
                        {
                            var url = URL.createObjectURL(response.data);
                            var arr = [
                                {
                                    src: $sce.trustAsResourceUrl(url),
                                    type: 'audio/mp3'
                                }
                            ];

                            $scope.config.sources = arr;


                            videogularAPI.play();
                        }
                    }, function errorCallback(response) {

                        $scope.showAlert('CDR Player', 'error', 'Error occurred while playing file');

                    });


                }
            }


        };

        //set loading option
        $scope.isTableLoading = 3;
        $scope.cdrList = [];
        $scope.userList = [];
        $scope.qList = [];
        

        $scope.searchCriteria = "";

        $scope.recLimit = "10";


        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");
        $scope.dateValid = true;

        $scope.offset = 0;

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        $scope.pageChanged = function () {
            var skipCount = ($scope.pagination.currentPage - 1) * parseInt($scope.recLimit);
            $scope.getProcessedCDR(skipCount, false);
        };

        $scope.searchWithNewFilter = function () {
            $scope.pagination.currentPage = 1;
            $scope.getProcessedCDR(0, true);
        };

        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        $scope.convertToMMSS = function (sec) {
            var minutes = Math.floor(sec / 60);

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            var seconds = sec - minutes * 60;

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        };

        $scope.$on("$destroy", function(){
            $scope.cancelDownload = true;
        });

        var getQueueList = function () {
            for (var i = 0; i < profileDataParser.myQueues.length; i++) {
                $scope.qList[i] = profileDataParser.myQueues[i];
            }
        }

        getQueueList();

        var getCDRForTimeRangeCount = function (startDate, endDate, sipusername, skillFilter, direction, record, custNumber, didFilter, bUnit, qpriority)
        {
            var url = baseUrls.cdrProcessor + 'CallCDR/Processed/GetCallDetailsByRange/Count?startTime=' + startDate + '&endTime=' + endDate;

            if (sipusername) {
                url = url + '&agent=' + sipusername;
            }

            if (skillFilter) {
                url = url + '&skill=' + skillFilter;
            }

            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if(qpriority != null && qpriority >= 0)
            {
                url = url + '&qpriority=' + qpriority;
            }

            if (didFilter) {
                url = url + '&didnumber=' + didFilter;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                //loginService.isCheckResponse(err);
            })
        };

        var getCDRForTimeRange = function (startDate, endDate, limit, offsetId, sipusername, skillFilter, direction, record, custNumber, didFilter, bUnit, qpriority) {
            var url = baseUrls.cdrProcessor + 'CallCDR/Processed/GetCallDetailsByRange?startTime=' + startDate + '&endTime=' + endDate + '&limit=' + limit;

            if (sipusername) {
                url = url + '&agent=' + sipusername;
            }

            if (skillFilter) {
                url = url + '&skill=' + skillFilter;
            }

            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (offsetId) {
                url = url + '&offset=' + offsetId;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (qpriority != null && qpriority >= 0) {
                url = url + '&qpriority=' + qpriority;
            }

            if (didFilter) {
                url = url + '&didnumber=' + didFilter;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }


            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                return null;
            })
        };

        var validateDateRange = function (startDate, endDate) {
            var validRange = 31;
            var msd = moment(new Date(startDate));
            var med = moment(new Date(endDate));
            if (msd && med) {
                var dif = med.diff(msd, 'days');
                if (dif > validRange || dif < 0) {
                    return false;
                } else {
                    return true;
                }
            }
        }


        $scope.getProcessedCDR = function (offset)
        {

            if(validateDateRange($scope.startDate, $scope.endDate) == false){
                $scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
                return -1;
            }
            $scope.enableSearchButton = false;

            try
            {
                var momentTz = moment.parseZone(new Date()).format('Z');
                momentTz = momentTz.replace("+", "%2B");

                var st = moment($scope.startTimeNow, ["h:mm A"]).format("HH:mm");
                var et = moment($scope.endTimeNow, ["h:mm A"]).format("HH:mm");

                var startDate = $scope.startDate + ' ' + st + ':00' + momentTz;
                var endDate = $scope.endDate + ' ' + et + ':59' + momentTz;

                if (!$scope.timeEnabledStatus) {
                    startDate = $scope.startDate + ' 00:00:00' + momentTz;
                    endDate = $scope.endDate + ' 23:59:59' + momentTz;
                }


                var lim = parseInt($scope.recLimit);

                $scope.pagination.itemsPerPage = lim;
                $scope.isTableLoading = 0;

                var tempBUnit = null;

                if(profileDataParser.myBusinessUnit != 'ALL' && profileDataParser.myBusinessUnit != null)
                {
                    tempBUnit = profileDataParser.myBusinessUnit;
                }

                var sipusername = profileDataParser.myProfile.veeryaccount.contact.split("@")[0]

                getCDRForTimeRangeCount(startDate, endDate,  sipusername, $scope.skillFilter, $scope.directionFilter, $scope.recFilter, $scope.custFilter, $scope.didFilter, tempBUnit, $scope.priorityFilter).then(function(cdrCntRsp)
                {
                    if (cdrCntRsp && cdrCntRsp.IsSuccess) {
                        $scope.pagination.totalItems = cdrCntRsp.Result;
                        getCDRForTimeRange(startDate, endDate, lim, offset, sipusername, $scope.skillFilter, $scope.directionFilter, $scope.recFilter, $scope.custFilter, $scope.didFilter, tempBUnit, $scope.priorityFilter).then(function (cdrResp) {
                            if (!cdrResp.Exception && cdrResp.IsSuccess && cdrResp.Result) {
                                if (!isEmpty(cdrResp.Result)) {
					
                                    for (cdr in cdrResp.Result) {
                                        if(cdr.DVPCallDirection=='inbound') {
                                                cdr.IsAnswered = cdr.AgentAnswered;
                                        }
                                    }


                                    $scope.cdrList = cdrResp.Result;
                                    $scope.isTableLoading = 1;
                                }
                                else
                                {
                                    $scope.showAlert('Info', 'info', 'No CDR Records to load');
                                    $scope.cdrList = [];
                                    $scope.isTableLoading = 1;
                                }
                            }
                            else {
                                $scope.cdrList = [];
                                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                                $scope.isTableLoading = 1;
                            }

                            $scope.enableSearchButton = true;

                        }, function (err) {
                            //loginService.isCheckResponse(err);
                            $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                            $scope.isTableLoading = 1;
                            $scope.enableSearchButton = true;
                            $scope.cdrList = [];
                        })
                    }
                    else
                    {
                        $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                        $scope.isTableLoading = 1;
                        $scope.cdrList = [];
                    }

                }).catch(function(err)
                {
                    $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                    $scope.isTableLoading = 1;
                    $scope.cdrList = [];
                });

            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'ok', 'Error occurred while loading cdr list');
                $scope.isTableLoading = 1;
                $scope.cdrList = [];
            }
        }

});



