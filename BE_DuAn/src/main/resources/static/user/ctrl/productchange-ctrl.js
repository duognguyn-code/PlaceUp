app.controller('productchange-ctrl',function($rootScope,$scope,$http){
    $scope.billDetail = {};
    $scope.getProductChange=function(billDetail){
        $http.get(`/rest/user/productchange/findProductChange/${billDetail}` ).then(resp=>{
            console.log($scope.billDetail.id);
            $scope.billDetail = resp.data;
            console.log(resp.data)
        }).catch(error=>{
            console.log(error);
        })
    }
    $scope.getProductChange();

});