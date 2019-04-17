//DEPENDENCIES
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs");

//Scraping Models
var request = require("request");
var cheerio = require("cheerio");