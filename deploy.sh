#!/bin/bash

zip -9 index.zip index.js
aws lambda update-function-code --function-name AskManny --zip-file fileb://./index.zip
