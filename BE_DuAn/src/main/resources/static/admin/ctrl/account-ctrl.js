app.controller('account-ctrl', function ($rootScope, $scope, $http, $location, $routeParams,$window) {
    const apiUrlAccount = "http://localhost:8080/api/account";
    const apiUrlAuthor = "http://localhost:8080/api/auth";

    $scope.Accounts = [];
    $scope.formAccount = {};
    $scope.formAccountUpdate = {}
    $scope.formAuth = {};
    $scope.checkUsername = {};
    $scope.addAccount = function () {
        $http.get(apiUrlAccount + '/checkusername' + '/' + $scope.formAccount.username)
            .then(function (response) {
                $scope.checkUsername = response.data;
                if ($scope.checkUsername.length === 0) {
                    $http.get(apiUrlAccount + '/findByPhone' + '/' + $scope.formAccount.phone)
                        .then(function (response) {
                            $scope.checkUsername = response.data;
                            if ($scope.checkUsername.length === 0) {

                                var colorData = angular.copy($scope.formAccount)
                                var req = {
                                    method: 'POST',
                                    url: apiUrlAccount,
                                    data: colorData
                                }
                                let timerInterval
                                Swal.fire({
                                    title: 'Đang thêm  mới vui lòng chờ!',
                                    html: 'Vui lòng chờ <b></b> milliseconds.',
                                    timer: 1500,
                                    timerProgressBar: true,
                                    didOpen: () => {
                                        Swal.showLoading()
                                        const b = Swal.getHtmlContainer().querySelector('b')
                                        timerInterval = setInterval(() => {
                                            b.textContent = Swal.getTimerLeft()
                                        }, 100)
                                    },
                                    willClose: () => {
                                        clearInterval(timerInterval)
                                    }
                                });
                                $http(req).then(response => {
                                    $scope.addAuthor();
                                    $scope.message("Thêm mới tài khoản thành công");
                                }).catch(error => {
                                    $scope.error('Thêm  mới thất bại');
                                });


                            } else {
                                $scope.error('Số Điện Thoại Đã Tồn Tại');
                                return
                            }
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                } else {
                    $scope.error('Tài Khoản Đã Tồn Tại');
                    return
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    $scope.addAuthor = function () {
        var auth = {
            role: {idRole: $scope.formAuth.role},
            account: {username: $scope.formAccount.username}
        }
        $http.post(apiUrlAuthor, auth).then(response => {
            // alert("thanh cong")
            // $scope.message('Thêm Mới');
        }).catch(error => {
            // alert("that bai")
        });
    }
    $scope.getAccounts = function () {
        $http.get(apiUrlAuthor)
            .then(function (response) {
                $scope.Accounts = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.getAccounts();

    $scope.edit = function (username) {
        // alert(username)
        if (!$scope.isRedirected) {
            $scope.isRedirected = true;
            $location.path('/UpdateAccount/').search({username: username});
        }
    }
    $scope.checkPhone = null
    $scope.role = [{
        idRole: 1,
        name: "Nhân Viên"
    },
        {
            idRole: 2,
            name: "Quản Lý"
        },
        {
            idRole: 3,
            name: "Khách Hàng"
        }
    ]
    $scope.formUpdate = function () {
        var us = $routeParams.username
        $http.get(apiUrlAuthor + '/searchUsername' + '/' + us)
            .then(function (response) {
                $scope.formAccountUpdate = response.data;
                $scope.checkPhone = $scope.formAccountUpdate.account.phone
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    $scope.formUpdate();

    $scope.updateAccount = function () {
        $http.get(apiUrlAccount + '/findByPhone' + '/' + $scope.formAccountUpdate.account.phone)
            .then(function (response) {
                $scope.checkUsername = response.data;
                var phone = angular.copy($scope.checkUsername)
                if (phone.phone === $scope.checkPhone || $scope.checkUsername.length === 0) {
                    var acc = angular.copy($scope.formAccountUpdate)
                    var formUpd = {
                        username: $scope.formAccountUpdate.account.username,
                        date: $scope.formAccountUpdate.account.date,
                        email: $scope.formAccountUpdate.account.email,
                        fullName: $scope.formAccountUpdate.account.fullName,
                        password: $scope.formAccountUpdate.account.password,
                        phone: $scope.formAccountUpdate.account.phone,
                        sex: $scope.formAccountUpdate.account.sex,
                        status: $scope.formAccountUpdate.account.status
                    }
                    $http.put(apiUrlAccount, formUpd)
                        .then(function (response) {
                            // alert("Update thành công")
                            $scope.message('Cập Nhật Thành Công');
                            var auth = {
                                role: {idRole: $scope.formAccountUpdate.role.idRole},
                                account: {username: $scope.formAccountUpdate.account.username},
                                id: $scope.formAccountUpdate.id
                            }
                            $window.location.href = '#!Account';
                            $http.put(apiUrlAuthor, auth).then(response => {
                                // alert("thanh cong")
                            }).catch(error => {
                                // alert("that bai")
                            });
                            console.log(response);
                        })
                        .catch(function (error) {
                            $scope.error('Cập Nhật Thất bại');
                            console.log(error);
                        });
                } else {
                    // alert("")
                    $scope.error('Số Điện Thoại Đã Tồn Tại');
                    return
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.resetFormUpdate = function () {
        $scope.formUpdate()
    }
    $scope.deleteAccount = function (username) {
        $http.get(apiUrlAccount + '/findByUsername' + '/' + username)
            .then(function (response) {
                $scope.formAccountUpdate = response.data;
                var acc = angular.copy($scope.formAccountUpdate)
                acc.status = 0
                $http.put(apiUrlAccount, acc)
                    .then(function (response) {
                        $scope.message('Xóa thành công');
                        $scope.getAccounts();

                        console.log(response);
                    })
                    .catch(function (error) {
                        $scope.error('Xóa thất bại');
                        console.log(error);
                    });
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });


    };
    $scope.formAccount.sex=1;
    $scope.formAuth.role=1
    $scope.resetForm = function () {
    $scope.formAccount={}
        $scope.formAccount.email=""
        $scope.formAccount.phone=""
        $scope.formAccount.fullName=""
        $scope.formAccount.sex=1;
        $scope.formAuth.role=1
    }
    $scope.searchStatus='undefined'
        $scope.searchRole='undefined'
    $scope.searchAccount = function () {

        if ($scope.searchUsername == "undefined") {
            $scope.searchUsername = " "
        }
        if ($scope.searchFullname == "undefined") {
            $scope.searchFullname = " "
        }
        if ($scope.searchEmail == "undefined") {
            $scope.searchEmail = " "
        }
        if ($scope.searchPhone == "undefined") {
            $scope.searchPhone = " "
        }
        if ($scope.searchUsername == "") {
            $scope.searchUsername = " "
        }
        if ($scope.searchFullname == "") {
            $scope.searchFullname = " "
        }
        if ($scope.searchEmail == "") {
            $scope.searchEmail = " "
        }
        if ($scope.searchPhone == "") {
            $scope.searchPhone = " "
        }
        $http.get(apiUrlAuthor + '/searchAccount' + '/' + $scope.searchUsername + '/' + $scope.searchPhone + '/' + $scope.searchFullname + '/' +
            $scope.searchEmail + '/' + $scope.searchStatus + '/' + $scope.searchRole)
            .then(function (response) {
                $scope.Accounts = response.data;
                $scope.pagerAccount.first();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
$scope.resetSearch=function (){
    $scope.getAccounts();
}
    $scope.message = function (mes) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: mes,
        })
    }
    $scope.error = function (err) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: err,
        })
    }
    $scope.pagerAccount = {
        page: 0,
        size: 5,
        get Accounts() {
            var start = this.page * this.size;
            return $scope.Accounts.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.Accounts.length / this.size);
            return $scope.Accounts.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.Accounts.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("")
                $scope.message('Bạn đang ở trang đầu');
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("")
                $scope.message('Bạn đang ở trang cuối');
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
})