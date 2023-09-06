app.controller('bill-ctrl', function ($rootScope, $scope, $http, $filter,$location,$routeParams) {
    const apiUrlBill = "http://localhost:8080/api/bill";
    const apiUrlBillDetails = "http://localhost:8080/api/billDetail";
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer ` + jwtToken
        }
    }
    $scope.bills = [];
    $scope.formBill = {};
    $scope.form = {};
    $scope.status = [
        {id: '', name: "Thay đổi"},
        {id: 1, name: "Chờ xác nhận"},
        {id: 2, name: "Xác nhận"},
        {id: 3, name: "Đang giao hàng"},
        {id: 4, name: "Hoàn tất giao dịch"},
        {id: 5, name: "Hủy đơn"},
        {id: 6, name: "Hoàn Trả"}
    ];

    $scope.searchBill1 = function () {
        $scope.form.status="0"
        // alert($scope.sumSts1 + '---'+ $scope.sumSts2+'----'+ $scope.sumSts3)
        if ($scope.searchPhone === "") {
            $scope.searchPhone = " "
        }
        let date1 = $filter('date')($scope.date1, "yyyy/MM/dd");
        let date2 = $filter('date')($scope.date2, "yyyy/MM/dd");
        if (date1 == null) {
            date1 = null
        }
        if (date2 == null) {
            date2 = null
        }
        $http.get(apiUrlBill + '/' + '0' + '/' + '1' + `/date?date1=` + date1+'&&date2='+date2)

            .then(function (response) {
                $scope.bills = response.data;
                console.log(response);

            })
            .catch(function (error) {
                console.log(error);
            })
    };

    $scope.resetSearch = function () {
        $scope.searchPhone = " ";
        $scope.searchStatus = "1";
        $scope.date1 = null;
        // $scope.getBill();
        $scope.searchBill1();

    }

    $scope.resetSearch();
    $scope.searchBill1();
    $scope.searchBill = function () {
        // alert($scope.sumSts1 + '---'+ $scope.sumSts2+'----'+ $scope.sumSts3)
        if ($scope.searchPhone === "") {
            $scope.searchPhone = " "
        }
        let date1 = $filter('date')($scope.date1, "yyyy/MM/dd");
        let date2 = $filter('date')($scope.date2, "yyyy/MM/dd");
        if (date1 == null) {
            date1 = null
        }
        if (date2 == null) {
            date2 = null
        }
        $http.get(apiUrlBill + '/' + $scope.searchPhone + '/' + $scope.searchStatus + `/date?date1=` + date1+'&&date2='+date2)
            .then(function (response) {
                $scope.bills = response.data;
                console.log(response);
                $scope.pagerBill.first();
            })
            .catch(function (error) {
                console.log(error);
            })
    };
    $scope.updateStatus = function (bill) {
        Swal.fire({
            title: 'Bạn có chắc muốn đổi trạng thái không?',
            text: "Đổi không thể quay lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang gửi thông báo cho khách hàng!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        $scope.form.id = bill.id;
                        if (bill.status ===1){
                            $scope.form.status =2
                        } if (bill.status===2){
                            $scope.form.status=3
                        } if (bill.status===3){
                            $scope.form.status=4
                        }
                        if (bill.status===4){
                            $scope.messageError("Bạn không thể cập nhật");
                        }
                        $http.put(apiUrlBill + '/updateStatus'+'/'+bill.id, $scope.form,token).then(function (response) {
                            if (response.data) {
                                $scope.UpdateBillDetaillByStatusBill( $scope.form.status,$scope.form.id);
                                // $scope.getBill();
                                $scope.searchBill1();
                                $scope.sumStatus();
                                $scope.messageSuccess("Đổi trạng thái thành công");
                            } else {
                                $scope.messageError("Đổi trạng thái thất bại");
                            }
                        }).catch(error => {
                            $scope.messageError("Đổi trạng thái thất bại");
                        });
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            }
        })
    }
    $scope.updateStatusCancel = function (bill) {
        if (bill.status===4){
            // alert("Bạn không thể hủy đơn hàng này")
            $scope.messageError("Bạn không thể hủy đơn hàng này");
            return}
        if (bill.status===5){
            // alert("Đơn hàng đã được hủy")
            $scope.messageError("Đơn hàng đã được hủy");
            return}
        Swal.fire({
            title: 'Bạn có chắc muốn đổi trạng thái không?',
            text: "Đổi không thể quay lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang gửi thông báo cho khách hàng!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        $scope.form.id = bill.id;
                            $scope.form.status=5


                        $http.put(apiUrlBill + '/updateStatus'+'/'+bill.id, $scope.form,token).then(function (response) {

                            if (response.data) {
                                $scope.UpdateBillDetaillByStatusBill( $scope.form.status,$scope.form.id);
                                // $scope.getBill();
                                $scope.searchBill1();
                                $scope.sumStatus();
                                $scope.messageSuccess("Hủy đơn thành công");
                            } else {
                                $scope.messageError("Hủy đơn thất bại");
                            }
                        }).catch(error => {
                            $scope.messageError("Hủy đơn thất bại");
                        });
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            }
        })
    }
    $scope.updateStatusfailure = function (bill) {
        Swal.fire({
            title: 'Bạn có chắc muốn đổi trạng thái không?',
            text: "Đổi không thể quay lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang gửi thông báo cho khách hàng!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        $scope.form.id = bill.id;
                        $scope.form.status=7
                        $http.put(apiUrlBill + '/updateStatus'+'/'+bill.id, $scope.form,token).then(function (response) {
                            if (response.data) {
                                $scope.UpdateBillDetaillByStatusBill( $scope.form.status,$scope.form.id);
                                // $scope.getBill();
                                $scope.messageSuccess("Chuyển trạng thái thành công");
                                $scope.sumStatus();
                            }
                            else {
                                $scope.messageError("Hủy đơn thất bại");
                            }
                        }).catch(error => {
                            $scope.messageError("Chuyển trạng thái thất bại");
                        });
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            }
        })
    }
    $scope.UpdateBillDetaillByStatusBill = function (status,id){
        $http.put(apiUrlBillDetails + '/UpdateBillDetaillByStatusBill'+'/'+status +'/'+id,token).then(function (response) {
            if (response.data) {
            } else {
            }
        }).catch(error => {
            // $scope.messageError("Đổi trạng thái thất bại");
        });
    }
    $scope.messageSuccess=function (text) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1400,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: text
        })
    }
    $scope.messageError=function (text) {
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
            title: text
        })
    }


    $scope.edit = function(billId) {
        if (!$scope.isRedirected) {
            $scope.isRedirected = true;
            $location.path('/billDetail/').search({idBill: billId});
        }
    };
    $scope.pagerBill = {
        page: 0,
        size: 5,
        get bills() {
            var start = this.page * this.size;
            return $scope.bills.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.bills.length / this.size);
            return $scope.bills.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.bills.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("Bạn đang ở trang đầu")
                $scope.messageSuccess("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("Bạn đang ở trang cuối")
                $scope.messageSuccess("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
    $scope.sumSts1=0;
    $scope.sumSts2=0;
    $scope.sumSts3=0;
    $scope.sumStatus=function (){
        for (let i = 1; i < 4; i++) {
        $http.get(apiUrlBill+'/sumStatus'+'/'+i)
            .then(function (response) {
               if (i==1){
                   $scope.sumSts1=response.data;
               }
                if (i==2){
                    $scope.sumSts2=response.data;
                }
                if (i==3){
                    $scope.sumSts3=response.data;
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    }
    $scope.sumStatus();
});