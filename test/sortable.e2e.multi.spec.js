'use strict';

describe('uiSortable', function() {

  // Ensure the sortable angular module is loaded
  beforeEach(module('ui.sortable'));
  beforeEach(module('ui.sortable.testHelper'));
  
  var EXTRA_DY_PERCENTAGE, listContent, listInnerContent, simulateElementDrag;

  beforeEach(inject(function (sortableTestHelper) {
    EXTRA_DY_PERCENTAGE = sortableTestHelper.EXTRA_DY_PERCENTAGE;
    listContent = sortableTestHelper.listContent;
    listInnerContent = sortableTestHelper.listInnerContent;
    simulateElementDrag = sortableTestHelper.simulateElementDrag;
  }));

  describe('Multiple sortables related', function() {

    var host;

    beforeEach(inject(function() {
      host = $('<div id="test-host"></div>');
      $('body').append(host);
    }));

    afterEach(function() {
      host.remove();
      host = null;
    });

    it('should update model when sorting between sortables', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = { connectWith: '.cross-sortable' };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should update model when sorting a "falsy" item between sortables', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = [0, 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = { connectWith: '.cross-sortable' };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        function parseFalsyValue (value) {
          if (value === '0') {
            return 0;
          }
          return value;
        }

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 0, 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop).map(parseFalsyValue));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom).map(parseFalsyValue));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 0, 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop).map(parseFalsyValue));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom).map(parseFalsyValue));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "placeholder" option is used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            placeholder: 'sortable-item-placeholder',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "placeholder" option equals the class of items', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            placeholder: 'sortable-item',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "helper: clone" option is used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop track by $index" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom track by $index" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: 'clone',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "placeholder" and "helper: clone" options are used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop track by $index" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom track by $index" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: 'clone',
            placeholder: 'sortable-item-placeholder',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "helper: function" option is used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: function (e, item) {
              return item.clone().text('helper');
            },
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "placeholder" and "helper: function" options are used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: function (e, item) {
              return item.clone().text('helper');
            },
            placeholder: 'sortable-item-placeholder',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "helper: function" that returns a list element is used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: function (e, item) {
              return item;
            },
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should work when "placeholder" and "helper: function" that returns a list element are used', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            helper: function (e, item) {
              return item;
            },
            placeholder: 'sortable-item-placeholder',
            connectWith: '.cross-sortable'
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(0)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

    it('should cancel sorting of nodes that contain "Two"', function() {
      inject(function($compile, $rootScope) {
        var elementTop, elementBottom;
        elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li ng-repeat="item in itemsTop" id="s-top-{{$index}}">{{ item }}</li></ul>')($rootScope);
        elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}">{{ item }}</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.itemsTop = ['Top One', 'Top Two', 'Top Three'];
          $rootScope.itemsBottom = ['Bottom One', 'Bottom Two', 'Bottom Three'];
          $rootScope.opts = {
            connectWith: '.cross-sortable',
            update: function(e, ui) {
              if (ui.item.scope() &&
                (typeof ui.item.scope().item === 'string') &&
                ui.item.scope().item.indexOf('Two') >= 0) {
                ui.item.sortable.cancel();
              }
            }
          };
        });

        host.append(elementTop).append(elementBottom).append('<div class="clear"></div>');

        var li1 = elementTop.find(':eq(1)');
        var li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top One', 'Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementTop.find(':eq(0)');
        li2 = elementBottom.find(':eq(0)');
        simulateElementDrag(li1, li2, 'below');
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        li1 = elementBottom.find(':eq(1)');
        li2 = elementTop.find(':eq(1)');
        simulateElementDrag(li1, li2, { place: 'above', extradx: -20, extrady: -10 });
        expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
        expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
        expect($rootScope.itemsTop).toEqual(listContent(elementTop));
        expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

        $(elementTop).remove();
        $(elementBottom).remove();
      });
    });

  });

});