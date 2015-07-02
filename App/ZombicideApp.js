/// <reference path="/Scripts/angular.min.js" />
(function () {
    angular.module('testModule', []).
    factory('testService', function ($http) {
        var testService = {};
        testService.getCards = function() {
            return $http.get("data/cards.js");
        };
        return testService;
    });

    var app = angular.module("ZombicideApp", ["testModule"]);

    app.controller("MainController", function () {
        this.title = "Teste";
    });

    app.controller("DeckController", function (testService) {
        this.cards = [];
        this.spawns = [];
        this.card = null;
        this.dangerLevel = "blue";
        
        this.shuffle = function () {
            for (var i = 0; i < this.cards.length * 2; i++) {
                var x = Math.floor((Math.random() * this.cards.length));
                var y = Math.floor((Math.random() * this.cards.length));
                var aux = this.cards[x];
                this.cards[x] = this.cards[y];
                this.cards[y] = aux;
            }
        }

        this.spawnCard = function () {
            this.card = this.cards.pop();
            this.spawns.unshift({ card: this.card, dangerLevel: this.dangerLevel, spawn: this.card.spawns[this.dangerLevel], timestamp: Date.now() });
        };

        this.undo = function () {
            var card = this.spawns.shift();
            this.cards.push(card.card);
        }

        var deck = this;
        testService.getCards()
            .success(function (data) {
                deck.cards = data;
                deck.shuffle();
            });
    });
})();