var Core = (function(){
	'use strict';

	var // declarations
	modules = [],
	deferred = [];

	var init = function(){

	};

	var getModule = function(id){
		for(var i = 0; i < modules.length; i++){
			if(id === modules[i].id){ return modules[i] }
		}
		return false;
	};

	var addModule = function(module){
		modules.push(module);
		console.log(module.id, 'loaded');
		checkDeferred(module.id);
	};

	var add = function(moduleFn){
		addModule(moduleFn());
	};

	var moduleLoader = function(deps){
		this.deps = deps;
	};
	moduleLoader.prototype.thenAdd = function(moduleFn){
		this.moduleFn = moduleFn;
		this.load();
	};
	moduleLoader.prototype.checkDep = function(dep){
		var index = this.deps.indexOf(dep);
		if(index >= 0) this.deps.splice(index, 1);
		this.load();
	};
	moduleLoader.prototype.load = function(){
		if(this.deps.length === 0){
			deferred.splice(deferred.indexOf(this), 1);
			add(this.moduleFn);
		}
	};

	var load = function(){
		var deps = Array.prototype.slice.call(arguments);
		deps.forEach(function(dep){
			if(getModule(dep)){
				deps.splice(deps.indexOf(dep), 1);
			}
		});
		var loader = new moduleLoader(deps);
		deferred.push(loader);
		return loader;
	};

	var checkDeferred = function(id){
		deferred.forEach(function(loader){
			loader.checkDep(id);
		});
	};

    init();

    return {
    	listModules: function(){ return modules },
    	addModule: addModule,
    	getModule: getModule,
    	add: add,
    	load: load
    }

})();