import angular from 'angular'
import ngRedux from 'ng-redux'

function CounterController ($scope, $ngRedux) {
  // Map Redux state to component scope
  function mapStateToThis (state) {
    return {
      value: state.count
    }
  }
  // Map Redux actions to component scope
  function mapDispatchToThis (dispatch) {
    return {
      onIncreaseClick: () => dispatch(increaseAction)
    }
  }

  const unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this)
  $scope.$on('$destroy', unsubscribe)
}

function counterComponent () {
  return {
    restrict: 'E',
    controllerAs: 'counter',
    controller: CounterController,
    template: `<div>
      <span>{{counter.value}}</span>
      <button ng-click="counter.onIncreaseClick()">Increase</button>
    </div>`,
    scope: {}
  }
}
// Action
const increaseAction = {type: 'increase'}

// Reducer
function counterReducer (state = {count: 0}, action) {
  let count = state.count
  switch (action.type) {
    case 'increase':
      return {count: count + 1}
    default:
      return state
  }
}

angular.module('counter', [ngRedux])
  .config(($ngReduxProvider) => {
    // Store
    $ngReduxProvider.createStoreWith(counterReducer)
  })
  .directive('counterComponent', counterComponent)
