'use strict';

describe('uiSortable', function() {

  beforeEach(module(function($compileProvider) {
    if (typeof $compileProvider.debugInfoEnabled === 'function') {
      $compileProvider.debugInfoEnabled(false);
    }
  }));

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

  describe('Drag & Drop simulation, when there are extra elements', function() {

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
        element = $compile('<ul ui-sortable ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should not allow sorting of "locked" nodes', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" ng-class="{ sortable: item.sortable }">{{ item.text }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            items:'> .sortable'
          };
          $rootScope.items = [
            { text: 'One', sortable: true },
            { text: 'Two', sortable: true },
            { text: 'Three', sortable: false },
            { text: 'Four', sortable: true }
          ];
        });

        host.append(element);

        var li = element.find(':eq(3)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(['One', 'Two', 'Three', 'Four']);
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(['One', 'Three', 'Four', 'Two']);
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(listContent(element));

        li = element.find(':eq(3)');
        dy = -(2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(['Four', 'One', 'Three', 'Two']);
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(listContent(element));

        li = element.find(':eq(4)');
        dy = -(2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(['Four', 'Two', 'One', 'Three']);
        expect($rootScope.items.map(function(x){ return x.text; })).toEqual(listContent(element));

        // also placing right above the locked node seems a bit harder !?!?

        $(element).remove();
      });
    });

    it('should work when "placeholder" option is used', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            placeholder: 'sortable-item-placeholder'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "placeholder" option equals the class of items', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "placeholder" option equals the class of items [data-ng-repeat]', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li data-ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should continue to work after a drag is reverted', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "handle" option is used', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}"><span class="handle">H</span> <span class="itemContent">{{ item }}</span></li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            handle: '.handle'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find('li:eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        $(element).remove();
      });
    });

    it('should properly remove elements after a sorting', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}"><span class="handle">H</span> <span class="itemContent">{{ item }}</span> <button type="button" class="removeButton" ng-click="remove(item, $index)">X</button></li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            handle: '.handle'
          };
          $rootScope.items = ['One', 'Two', 'Three'];

          $rootScope.remove = function (item, itemIndex) {
            $rootScope.items.splice(itemIndex, 1);
          };
        });

        host.append(element);

        var li = element.find('li:eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(2)');
        li.find('.removeButton').click();
        expect($rootScope.items).toEqual(['One', 'Two']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(1)');
        li.find('.removeButton').click();
        expect($rootScope.items).toEqual(['One']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        $(element).remove();
      });
    });

    it('should properly remove elements after a drag is reverted', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}"><span class="handle">H</span> <span class="itemContent">{{ item }}</span> <button type="button" class="removeButton" ng-click="remove(item, $index)">X</button></li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            handle: '.handle'
          };
          $rootScope.items = ['One', 'Two', 'Three'];

          $rootScope.remove = function (item, itemIndex) {
            $rootScope.items.splice(itemIndex, 1);
          };
        });

        host.append(element);

        var li = element.find('li:eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(1)');
        li.find('.removeButton').click();
        expect($rootScope.items).toEqual(['Two', 'Three']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        li = element.find('li:eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.find('.handle').simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'Two']);
        expect($rootScope.items).toEqual(listInnerContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: clone" option is used', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: 'clone'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: clone" option is used and a drag is reverted', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: 'clone'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: clone" and "appendTo" options are used together', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: 'clone',
            appendTo: 'body'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(3)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: clone" and "placeholder" options are used together.', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: 'clone',
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: function" option is used', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: function (e, item) {
              return item.clone().text('helper');
            }
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(2)');
        var dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Three', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = -(1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Three', 'One', 'Two']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: function" option is used and a drag is reverted', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: function (e, item) {
              return item.clone().text('helper');
            }
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: function" and "placeholder" options are used together.', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: function (e, item) {
              return item.clone().text('helper');
            },
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: function" that returns a list element is used', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: function (e, item) {
              return item;
            }
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    it('should work when "helper: function" that returns a list element and "placeholder" options are used together.', function() {
      inject(function($compile, $rootScope) {
        var element;
        element = $compile('<ul ui-sortable="opts" ng-model="items"><li>extra element</li><li ng-repeat="item in items" id="s-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
        $rootScope.$apply(function() {
          $rootScope.opts = {
            helper: function (e, item) {
              return item;
            },
            placeholder: 'sortable-item'
          };
          $rootScope.items = ['One', 'Two', 'Three'];
        });

        host.append(element);

        var li = element.find(':eq(1)');
        var dy = (2 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['One', 'Two', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(1)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('dragAndRevert', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'Three', 'One']);
        expect($rootScope.items).toEqual(listContent(element));

        li = element.find(':eq(2)');
        dy = (1 + EXTRA_DY_PERCENTAGE) * li.outerHeight();
        li.simulate('drag', { dy: dy });
        expect($rootScope.items).toEqual(['Two', 'One', 'Three']);
        expect($rootScope.items).toEqual(listContent(element));

        $(element).remove();
      });
    });

    describe('Multiple sortables', function() {
      it('should work when "placeholder" and "helper: function" options are used', function() {
        inject(function($compile, $rootScope) {
          var elementTop, elementBottom;
          elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li>extra element</li><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
          elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li>extra element</li><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
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

          var li1 = elementTop.find(':eq(1)');
          var li2 = elementBottom.find(':eq(1)');
          simulateElementDrag(li1, li2, 'below');
          expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          li1 = elementBottom.find(':eq(2)');
          li2 = elementTop.find(':eq(2)');
          simulateElementDrag(li1, li2, { place: 'above', extradx: -22, extrady: -12 });
          expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          $(elementTop).remove();
          $(elementBottom).remove();
        });
      });

      it('should work when "placeholder" and "helper: function" options are used and a drag is reverted', function() {
        inject(function($compile, $rootScope) {
          var elementTop, elementBottom;
          elementTop = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsTop"><li>extra element</li><li ng-repeat="item in itemsTop" id="s-top-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
          elementBottom = $compile('<ul ui-sortable="opts" class="cross-sortable" ng-model="itemsBottom"><li>extra element</li><li ng-repeat="item in itemsBottom" id="s-bottom-{{$index}}" class="sortable-item">{{ item }}</li><li>extra element</li></ul>')($rootScope);
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

          var li1 = elementTop.find(':eq(3)');
          var li2 = elementBottom.find(':eq(2)');
          simulateElementDrag(li1, li2, { place: 'below', action: 'dragAndRevert' });
          expect($rootScope.itemsTop).toEqual(['Top One', 'Top Two', 'Top Three']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          li1 = elementTop.find(':eq(1)');
          li2 = elementBottom.find(':eq(1)');
          simulateElementDrag(li1, li2, 'below');
          expect($rootScope.itemsTop).toEqual(['Top Two', 'Top Three']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Top One', 'Bottom Two', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          li1 = elementBottom.find(':eq(2)');
          li2 = elementTop.find(':eq(2)');
          simulateElementDrag(li1, li2, { place: 'above', extradx: -22, extrady: -12 });
          expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One', 'Top Three']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          li1 = elementTop.find(':eq(3)');
          li2 = elementBottom.find(':eq(2)');
          simulateElementDrag(li1, li2, { place: 'below', extradx: -22, extrady: -12 });
          expect($rootScope.itemsTop).toEqual(['Top Two', 'Top One']);
          expect($rootScope.itemsBottom).toEqual(['Bottom One', 'Bottom Two', 'Top Three', 'Bottom Three']);
          expect($rootScope.itemsTop).toEqual(listContent(elementTop));
          expect($rootScope.itemsBottom).toEqual(listContent(elementBottom));

          $(elementTop).remove();
          $(elementBottom).remove();
        });
      });
    });

  });

});
