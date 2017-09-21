#!/bin/bash

aws lambda update-function-code --function-name AskManny --zip-file fileb://./index.zip
