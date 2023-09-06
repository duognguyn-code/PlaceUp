app.controller('product-sort', function ($rootScope, $scope, $http) {
    var apiUrlProduct = "http://localhost:8080/api/product";
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }


    $scope.colorProducts = [];
    $scope.designProducts = [];
    $scope.materialProducts = [];
    $scope.sizeProducts = [];
    $scope.getAllProduct = [];
    $scope.findProductAll = {};
    $scope.findProductAll.idColor = [];
    $scope.findProductAll.idMaterial = [];
    $scope.findProductAll.idSize = [];
    $scope.findProductAll.idDesign = [];
    $scope.findProductAll.idCategory = [];
    $scope.findProductAll.sortMinMax = 0;
    $scope.findProductAll.priceSalemin = '';
    $scope.findProductAll.priceSalemax = '';
    $scope.findProductAll.search = '';
    $scope.totalElements=0;
    $scope.totalPages=0;
    $scope.numberPage=0;
    $scope.products = [];

    $scope.totalElementsPRD=0;
    $scope.totalPagesPRD=0;
    $scope.numberPagePRD=0;



    $scope.getAllDesign = function () {
        let url = `/rest/guest/getALlDesign`;
        $http.get(url).then(function (respon) {
            $scope.designProducts = respon.data;
        }).catch(err => {
            console.log(err)
        })
    }


    $scope.getAllColor = function () {
        let url = `/rest/guest/getAllColor`;
        $http.get(url).then(function (respon) {
            $scope.colorProducts = respon.data;
        }).catch(err => {
            console.log(err)
        })
    }


    $scope.getAllMaterial = function () {
        let url = `/rest/guest/getAllMaterial`;
        $http.get(url).then(function (respon) {
            $scope.materialProducts = respon.data;
        }).catch(err => {
            console.log(err)
        })
    }

    $scope.getAllSize = function () {
        let url = `/rest/guest/getALlSize`;
        $http.get(url).then(function (respon) {
            $scope.sizeProducts = respon.data;
        }).catch(err => {
            console.log(err)
        })
    }

    $scope.getAllDesign();
    $scope.getAllColor();
    $scope.getAllMaterial();
    $scope.getAllSize();
    $scope.findProduct = function (page) {
        if(page<0){
            page=$scope.totalPagesPRD-1;
        }else if(page>$scope.totalPagesPRD-1){
            page=0
        }
        $http.post(`/rest/guest/product/findproduct/`+page, $scope.findProductAll).then(function (respon) {
            $scope.getAllProduct = respon.data.content;
            console.log(respon.data.content)
            $scope.totalElementsPRD=respon.data.totalElements
            $scope.totalPagesPRD=respon.data.totalPages;
            $scope.numberPagePRD=respon.data.number;

        }).catch(err => {
                console.log(err + 'kiixu  lỗi')
            }
        )
    }
    $scope.findProduct(0);

    $scope.checksortMinMax = function (text, check) {
        if (text == 'Tăng dần') {
            $scope.findProductAll.sortMinMax = 0;
        } else {
            $scope.findProductAll.sortMinMax = 1;
        }
        if (check == 0) {
            $scope.findProduct(0);
        }

    }
    $scope.checkSelected = function (id, check) {
        let checkseleced = true;
        if (check == 0) {
            for (let i = 0; i < $scope.findProductAll.idCategory.length; i++) {
                if (id == $scope.findProductAll.idCategory[i]) {
                    $scope.findProductAll.idCategory.splice(i, 1);
                    checkseleced = false
                }
            }
            if (checkseleced) {
                $scope.findProductAll.idCategory.push(id);
            }
        }else if (check == 1) {
            for (let i = 0; i < $scope.findProductAll.idColor.length; i++) {
                if (id == $scope.findProductAll.idColor[i]) {
                    $scope.findProductAll.idColor.splice(i, 1);
                    checkseleced = false
                }
            }
            if (checkseleced) {
                $scope.findProductAll.idColor.push(id);
            }
        } else if (check == 3) {
            for (let i = 0; i < $scope.findProductAll.idMaterial.length; i++) {
                if (id == $scope.findProductAll.idMaterial[i]) {
                    $scope.findProductAll.idMaterial.splice(i, 1);
                    checkseleced = false
                }
            }
            if (checkseleced) {
                $scope.findProductAll.idMaterial.push(id);
            }
        } else if (check == 2) {
            for (let i = 0; i < $scope.findProductAll.idSize.length; i++) {
                if (id == $scope.findProductAll.idSize[i]) {
                    $scope.findProductAll.idSize.splice(i, 1);
                    checkseleced = false
                }
            }
            if (checkseleced) {
                $scope.findProductAll.idSize.push(id);
            }
        }else if (check == 4) {
            for (let i = 0; i < $scope.findProductAll.idDesign.length; i++) {
                if (id == $scope.findProductAll.idDesign[i]) {
                    $scope.findProductAll.idDesign.splice(i, 1);
                    checkseleced = false
                }
            }
            if (checkseleced) {
                $scope.findProductAll.idDesign.push(id);
            }
        }
    }
})