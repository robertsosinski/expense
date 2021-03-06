/* global angular,alert,confirm,moment,$,_ */

(function() {
  "use strict";

  angular.module('controllers').controller('ExpensesController',
  ['$scope', '$http', function($scope, $http) {

    $scope.modal = {
      index: null,

      expense: {},

      saveExpense: function(id) {
        var save;

        if (id) {
          save = $http.patch('/api/expenses/' + id, {expense: $scope.modal.expense});

          save.success(function(expense) {
            $scope.table.expenses[$scope.modal.index] = expense;
          });
        }
        else {
          save = $http.post('/api/expenses', {expense: $scope.modal.expense});

          save.success(function(expense) {
            $scope.table.expenses.push(expense);
          });
        }

        save.success(function() {
          $("#expense-modal").modal("hide");
        });

        save.error(function() {
          alert("Seems some values are not correct, please try again.");
        });
      },

      deleteExpense: function(id, index) {
        if (confirm('Are you sure?')) {
          $http.delete('/api/expenses/' + id).success(function() {
            $scope.table.expenses.splice(index, 1);
          });
        }
      }
    };

    $scope.filters = {
      q: {},
      s: [{
        name: 'id',
        dir: 'asc'
      }]
    };

    $scope.table = {
      loading: false,

      expenses: [],

      filterExpenses: function() {
        $scope.table.loading = true;

        var search = $http.post('/api/expenses/search', _.clean($scope.filters));

        search.success(function(data) {
          $scope.table.loading = false;
          $scope.table.expenses = data.result;
        });

        search.error(function() {
          alert('Seems some filters are not valid, please try again.');
        });
      },

      newExpense: function() {
        this.isNew = true;
        this.expense = {expensed_at: moment().format('YYYY-MM-DD')};
      }.bind($scope.modal),

      editExpense: function(expense, index) {
        this.isNew = false;
        this.index = index;
        this.expense = angular.copy(expense);
        this.expense.expensed_at = moment(this.expense.expensed_at).format('YYYY-MM-DD');
      }.bind($scope.modal)
    };
  }]);
})();
