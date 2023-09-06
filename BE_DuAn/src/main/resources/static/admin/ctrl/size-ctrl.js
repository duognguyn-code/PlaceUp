app.controller('size-ctrl', function ($rootScope,$scope, $http) {

    const apiUrlSize = "http://localhost:8080/api/size";
    $scope.sizes = [];
    $scope.formSize = {};
    $scope.checkName={};
    $scope.getSize = function () {
        $http.get(apiUrlSize)
            .then(function (response) {
                $scope.sizes = response.data;
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.message = function (mes) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
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
    $scope.addSize = function () {
        var sizeData = {
            name: $scope.formSize.name,
        };
        var req = {
            method: 'POST',
            url: apiUrlSize,
            data: sizeData
        }
        // let timerInterval
        // Swal.fire({
        //     title: 'Đang thêm  mới vui lòng chờ!',
        //     html: 'Vui lòng chờ <b></b> milliseconds.',
        //     timer: 5500,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading()
        //         const b = Swal.getHtmlContainer().querySelector('b')
        //         timerInterval = setInterval(() => {
        //             b.textContent = Swal.getTimerLeft()
        //         }, 100)
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval)
        //     }
        // });
        $http.get(apiUrlSize+'/'+$scope.formSize.name)
            .then(function (response) {
                $scope.checkName=response.data;
                if (!$scope.checkName){
                    $http(req).then(response => {
                        console.log("ddd " + response);
                        $scope.message("Thêm mới size thành công");
                        $scope.resetSize();
                        $scope.getSize();
                    }).catch(error => {
                        $scope.error('Thêm mới thất bại');
                    });
                }else{
                    // alert("")
                    $scope.error("Size đã tồn tại");
                    return
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    };
    $scope.editSize = function (size) {
        $scope.formSize = angular.copy(size);
    }
    $scope.formSize.status=1
    $scope.updateSize = function () {
        var item = angular.copy($scope.formSize);
        $http.put(apiUrlSize + '/' + item.idSize, item).then(resp => {
            var index = $scope.sizes.findIndex(p => p.idSize == item.idSize);

            $scope.message("Cập nhật thành công");
            $scope.resetSize();
            $scope.getSize();
        // }).catch(error => {
        //     alert("");
            $scope.message("Cập nhật thất bại");
            console.log("Error", error);
        });
    }
    $scope.deleteSize = function (size) {
        $http.put(apiUrlSize + '/delete',size).then(resp => {
            // var index = $scope.sizes.findIndex(p => p.id == item.id);
            // $scope.sizes[index] = item;
            // alert(");
            $scope.message("Tạm ngưng thành công");
            $scope.getSize();
            $scope.resetSize();
        }).catch(error => {
            // alert("");
            $scope.error("Tạm ngưng thất bại");
            console.log("Error", error);
        });
    };
    $scope.resetSize = function () {
        $scope.formSize = {
            status: 1
        }
    }
    $scope.getSize();
    $scope.pagerSize = {
        page: 0,
        size: 5,
        get sizes() {
            var start = this.page * this.size;
            return $scope.sizes.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.sizes.length / this.size);
            return $scope.sizes.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.sizes.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("")
                $scope.message("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                $scope.message("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
});