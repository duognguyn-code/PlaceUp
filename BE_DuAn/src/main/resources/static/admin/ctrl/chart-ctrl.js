app.controller('chart-ctrl', function ($rootScope,$scope,$http,$window) {
    const apiUrlChart = "http://localhost:8080/api/chart";
    $scope.a=[];
    $scope.account=[];
    $scope.billStatus=[];
    $scope.year=[];
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }
    $scope.input=[];

    $scope.getTotalMoney = function () {
        $http.get(apiUrlChart+'/'+$scope.searchYear)
            .then(function (response) {
                $scope.a=response.data;
                console.log(response);
                $scope.getYear2();
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // $scope.getBill();
    $scope.getYear = function () {
        $http.get(apiUrlChart+'/account'+'/'+$scope.searchYear)
            .then(function (response) {
                $scope.account=response.data;
                console.log(response);
                $scope.getTotalMoney();
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getYear2 = function () {
        $http.get(apiUrlChart+'/billStatus'+'/'+$scope.searchYear)
            .then(function (response) {
                $scope.billStatus=response.data;
                console.log(response);
                $scope.getInput();

            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.inputTotalMoney=0
    $scope.inputTotalAccount=0
    $scope.inputTotalBillCancel=0
    $scope.getInput = function () {
        $http.get(apiUrlChart+'/input'+'/'+$scope.searchYear)
            .then(function (response) {
                $scope.input=response.data
                $scope.inputTotalMoney= $scope.input[0]
                $scope.inputTotalAccount=$scope.input[1]
                $scope.inputTotalBillCancel=$scope.input[2]
                $scope.ChartTotalMoney();
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getYear1 = function () {
        $http.get(apiUrlChart+'/account'+'/'+2023)
            .then(function (response) {
                $scope.account=response.data;
                console.log(response);
                $http.get(apiUrlChart+'/'+2023)
                    .then(function (response) {
                        $scope.a=response.data;
                        console.log(response);
                        $http.get(apiUrlChart+'/billStatus'+'/'+2023)
                            .then(function (response) {
                                $scope.billStatus=response.data;
                                $scope.ChartTotalMoney();
                                $http.get(apiUrlChart+'/input'+'/'+2023)
                                    .then(function (response) {
                                        $scope.input=response.data
                                        $scope.inputTotalMoney= $scope.input[0]
                                        $scope.inputTotalAccount=$scope.input[1]
                                        $scope.inputTotalBillCancel=$scope.input[2]
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                       ;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getYear1();

    $scope.ChartTotalMoney = function (){
        const  labels =['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11', 'Tháng 12']
        const  labels1 =[10,27,56,34,24,53]
        const data ={
            labels: labels,
            datasets:[
                {
                    label:'Tổng Tiền Đơn Thành Công',
                    backdropColor:'blue',
                    borderColor:'blue',
                    data:$scope.a,
                },
                {
                    label:'Tài Khoản Mới',
                    backdropColor:'red',
                    borderColor:'red',
                    data:$scope.account,
                },
                {
                    label:'Đơn Hủy',
                    backdropColor:'black',
                    borderColor:'black',
                    data:$scope.billStatus,
                }
            ],
        }
        const config={
            type:'line',
            data:data,
        }
        const  canvas = document.getElementById('canvas')
        const  chart = new Chart(canvas,config)
    }

    $scope.searchYear="2023"
    $scope.logOut = function (){
        $window.location.href = "http://localhost:8080/views/index.html#!/login"
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng đăng nhập lại!!',
            text: 'Tài khoản của bạn không có quyền truy cập!!',
        })
    }

    $scope.checkLogin = function () {
        if (jwtToken == null){
            $scope.logOut();
        }else {
            $http.get("http://localhost:8080/api/auth/getRole",token).then(respon =>{
                if (respon.data.role.name === "ROLE_USER"){
                    $scope.logOut();
                }else if (respon.data.role.name === "ROLE_ADMIN"){
                    $rootScope.check = null;
                }else {
                    $rootScope.check = "OK";
                }
            })
        }
    }
    $scope.checkLogin();

})