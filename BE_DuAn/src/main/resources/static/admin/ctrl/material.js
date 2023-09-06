app.controller('material', function ($rootScope, $scope, $http) {

    const apiUrlMaterial = "http://localhost:8080/api/material";
    $scope.materials = [];
    $scope.formMaterial = {};
    $scope.checkName = {};
    $scope.pagerMaterial = {
        page: 0,
        size: 5,
        get materials() {
            var start = this.page * this.size;
            return $scope.materials.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.materials.length / this.size);

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
                // alert("Bạn đang ở trang cuối")
                $scope.message("Bạn đang ở trang cuối");
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }

    $scope.getMaterials = function () {
        $http.get(apiUrlMaterial)
            .then(function (response) {
                $scope.materials = response.data;
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
    $scope.addMaterial = function () {
        var materialData = {
            name: $scope.formMaterial.name,
        };
        var req = {
            method: 'POST',
            url: apiUrlMaterial,
            data: materialData
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
        $http.get(apiUrlMaterial + '/' + $scope.formMaterial.name)
            .then(function (response) {
                $scope.checkName = response.data;
                if (!$scope.checkName) {
                    $http(req).then(response => {
                        console.log("ddd " + response);
                        $scope.message("Thêm mới chất liệu thành công");
                        $scope.resetMaterial();
                        $scope.getMaterials();
                    }).catch(error => {
                        $scope.error('Thêm mới thất bại');
                    });
                } else {
                    // alert("")
                    $scope.error("Chất Liệu đã tồn tại");
                    return
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    $scope.editMaterial = function (material) {
        $scope.formMaterial = angular.copy(material);
    }
    $scope.formMaterial.status=1
    $scope.updateMaterial = function () {
        var item = angular.copy($scope.formMaterial);
        $http.put(apiUrlMaterial + '/' + item.idMaterial, item).then(resp => {
            var index = $scope.materials.findIndex(p => p.idMaterial == item.idMaterial);
            $scope.materials[index] = item;
            // alert("");
            $scope.message("Cập nhật thành công");
            $scope.resetMaterial();
        }).catch(error => {
            // alert("");
            $scope.error("Cập nhật thất bại");
            console.log("Error", error);
        });
    }
    $scope.deleteMaterial = function (material) {
        $http.put(apiUrlMaterial + '/delete',material).then(resp => {
            // alert("");
            $scope.message("Tạm ngưng thành công");
            $scope.resetMaterial();
        }).catch(error => {
            // alert("");
            $scope.error("Tạm ngưng thất bại");
            console.log("Error", error);
        });
    };
    $scope.resetMaterial = function () {
        $scope.formMaterial = {
            status: 1
        }
    }


    $scope.getMaterials();


});