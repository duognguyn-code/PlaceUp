app.controller('design', function ($rootScope,$scope, $http) {
    const apiUrlDesign = "http://localhost:8080/api/design";

    $scope.designs = [];
    $scope.formDesign = {};
    $scope.checkName={};

    $scope.pagerDesign = {
        page: 0,
        size: 5,
        get designs() {
            var start = this.page * this.size;
            return $scope.designs.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.designs.length / this.size);

        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.first();
                // alert("Bạn đang ở trang đầu")
                $scope.message("Bạn đang ở trang đầu");
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.last();
                // alert("Bạn đang ở trang cuối")
                $scope.message("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
    $scope.getDesign = function () {
        $http.get(apiUrlDesign)
            .then(function (response) {
                $scope.designs = response.data;
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
    $scope.addDesign = function () {
        var designData = {
            name: $scope.formDesign.name,
        };
        var req = {
            method: 'POST',
            url: apiUrlDesign,
            data: designData
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
        $http.get(apiUrlDesign+'/'+$scope.formDesign.name)
            .then(function (response) {
                $scope.checkName=response.data;
                if (!$scope.checkName){
        $http(req).then(response => {
            console.log("ddd " + response);
            $scope.message("Thêm mới kiểu dáng thành công");
            $scope.resetDesign();
            $scope.getDesign();
        }).catch(error => {
            $scope.error('Thêm mới thất bại');
        });
                }else{
                    // alert("")
                    $scope.message("Kiểu dáng đã tồn tại");
                    return
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.editDesign = function (design) {
        $scope.formDesign = angular.copy(design);
    }
    $scope.formDesign.status=1
    $scope.updateDesign = function () {
        var item = angular.copy($scope.formDesign);
        $http.put(apiUrlDesign + '/' + item.idDesign, item).then(resp => {
            var index = $scope.designs.findIndex(p => p.idDesign == item.idDesign);
            $scope.designs[index] = item;
            // alert("");
            $scope.message("Cập nhật thành công");
            $scope.resetDesign();
        }).catch(error => {
            // alert("");
            $scope.error("Cập nhật thất bại");
            console.log("Error", error);
        });
    }
    $scope.deleteDesign = function (design) {
        $http.put(apiUrlDesign + '/delete', design).then(resp => {
            // var index = $scope.designs.findIndex(p => p.id == item.id);
            // $scope.designs[index] = item;
            // alert("");
            $scope.message("Tạm ngưng thành công");
            $scope.resetDesign();
            $scope.getDesign();
        }).catch(error => {
            // alert("");
            $scope.error("Tạm ngưng thất bại");
            console.log("Error", error);
        });
    };
    $scope.resetDesign = function () {
        $scope.formDesign = {
            status: 1
        }
    }
    $scope.getDesign();
});