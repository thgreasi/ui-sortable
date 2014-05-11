'use strict';

describe('uiSortable', function() {

  // Ensure the sortable angular module is loaded
  beforeEach(module('ui.sortable'));
  beforeEach(module('ui.sortable.testHelper'));

  var EXTRA_DY_PERCENTAGE, listContent, arrayItemsPropertyValue;

  beforeEach(inject(function (sortableTestHelper) {
    EXTRA_DY_PERCENTAGE = sortableTestHelper.EXTRA_DY_PERCENTAGE;
    listContent = sortableTestHelper.listContent;
    arrayItemsPropertyValue = sortableTestHelper.arrayItemsPropertyValue;
  }));

  describe('filters related', function() {

    var host;

    beforeEach(inject(function() {
      host = $('<div id="test-host"></div>');
      $('body').append(host);
    }));

    afterEach(function() {
      host.remove();
      host = null;
    });

    it('should update model when order changes', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable ng-model="items"><li ng-repeat="item in items | orderBy: \'position\'" id="s-{{$index}}">{{ item.text }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.items = [{text: 'two', position: 1}, {text: 'one', position: 0}, {text: 'three', position: 2}];
        });

        host.append(element);

        var li = element.find(':eq(0)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        // expect($rootScope.items).toEqual([{text: 'two', position: 1}, {text: 'three', position: 0}, {text: 'one', position: 2}]);
        expect(arrayItemsPropertyValue($rootScope.items, 'text')).toEqual(['two', 'three', 'one']);
        expect(arrayItemsPropertyValue($rootScope.items, 'position')).toEqual([0, 1, 2]);
        expect(arrayItemsPropertyValue($rootScope.items, 'text')).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        // expect($rootScope.items).toEqual([{text: 'three', position: 1}, {text: 'two', position: 0}, {text: 'one', position: 2}]);
        expect(arrayItemsPropertyValue($rootScope.items, 'text')).toEqual(['three', 'two', 'one']);
        expect(arrayItemsPropertyValue($rootScope.items, 'position')).toEqual([0, 1, 2]);
        expect(arrayItemsPropertyValue($rootScope.items, 'text')).toEqual(listContent(element));

        $(element).remove();
      });
    });

  });

});