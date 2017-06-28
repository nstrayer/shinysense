(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.acceljs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var round = function round(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

var accel = function accel(_ref) {
  var dom_target = _ref.dom_target,
      _ref$onMoveFunction = _ref.onMoveFunction,
      onMoveFunction = _ref$onMoveFunction === undefined ? function (event) {
    return console.log(event);
  } : _ref$onMoveFunction;

  var button = document.getElementById(dom_target);
  var isOn = false;

  var turnOn = function turnOn() {
    button.innerHTML = "Turn Off";
    window.addEventListener("devicemotion", handleMotion, true);
  };

  var turnOff = function turnOff() {
    button.innerHTML = "Turn On";
    window.removeEventListener("devicemotion", handleMotion, true);
  };

  var handleMotion = function handleMotion(event) {
    var _event$acceleration = event.acceleration,
        x = _event$acceleration.x,
        y = _event$acceleration.y,
        z = _event$acceleration.z;

    x = round(x, 4);
    y = round(y, 4);
    z = round(z, 4);

    onMoveFunction({ x: x, y: y, z: z });
  };

  var toggleButton = function toggleButton() {
    if (isOn) {
      turnOff();
    } else {
      turnOn();
    }
    isOn = !isOn;
  };

  // button.addEventListener("click", toggleButton, true);
  return {
    turnOn: turnOn,
    turnOff: turnOff
  };
};

module.exports = {
  accel: accel
};

},{}]},{},[1])(1)
});