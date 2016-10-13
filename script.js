/**
 * Created by danh on 10/11/16.
 */
var my_calculator = new calculator(calc);
var multipleSign = "*"; // definite your text for multiple

function calc(value){
    //console.log(value);
    switch(value) {
        case undefined:
            $("#calc_skeleton").find(".screen").text("");
            break;
        default:
            $("#calc_skeleton").find(".screen").text(value);
            break;
    }

}

function apply_click_handler() {

    $("#calc_skeleton").on("click","button.btn",function() {
        //console.log($(this).text());
        var screen = $("#calc_skeleton").find(".screen");
        var val = $(this).text();
        switch(val) {
            case 'CE':
                my_calculator.allClear(screen);
                break;
            case 'C':
                my_calculator.clear(screen);
                break;
            case multipleSign:
                my_calculator.defineType("x");
                break;
            default:
                my_calculator.defineType(val);
                break;
        }

    });
}

$(document).ready(apply_click_handler);

function calculator(param) {

    if(typeof param == 'function') // check is param is function if so set status to true to execute later
    {
        var isfunction = true;
    }
    this.type = null;
    this.value = null;
    this.index = 0;
    var global = [''];

    this.defineType = function(value) { // This function evaluates the type of the input and assigns it 4 types
        if(!isNaN(value)) {
            this.type = "number";
        } else if(value === "=") {
            this.type = "equalSign";
        } else if(value === ".") {
            this.type = "period"
        } else {
            this.type = "operator";
        }
        this.addInput(value); // This calls the next function in the chain after type has been set.
    }

    this.addInput = function(value) { // This function has state when
        switch (this.type) {
            case "equalSign":
                this.choose_math(global);
                this.allClear();
                break;
            case "operator":
                this.switchKey(value);
                this.inputstate = false; // set state to false after so it cannot be input more than once
                break;
            case "period":
                this.inputNumber(value);
                this.inputstate = false; // likewise
                break;
            default:
                this.inputstate = true; // sets state to true before so it catches any inputs that are numbers
                this.inputNumber(value);
                break;
        }
        console.log("this is state " + this.state);
        if (isfunction) {
            param(this.value);
        }
        //console.log(calc);
        console.log(global);
    }

    this.incrementKey = function() {
        if(this.inputstate || !this.clearstate) {
            console.log("This is incremented");
            this.index++;
        }
    }
    this.switchKey = function(value) { // increments key to input next value and increment to get ready for next number

        if(typeof global[this.index] === 'object') {
            //the last thing pressed was an operator, and this press is also an operator

            if(global[this.index-1]===value){
                //and they pressed the exact same operator as last time
                global[this.index] = global[this.index-2];

            } else {
                //they pressed an operator again, but this time it is different than before
                global.splice(this.index-1,2);
                this.index-=2;
            }
        }
        this.incrementKey();
        global[this.index] = value;
        this.value = global[this.index];
        this.incrementKey();
        global[this.index] = [''];
    }

    this.inputNumber = function(value){
        if(this.inputstate) {
            global[this.index] += value;
            this.value = global[this.index];
        } else {
            this.value = global[this.index];
        }
    }

    this.choose_math = function(obj){
        switch (obj[1]){
            case "+":
                this.value = this.do_math(obj[0],obj[2],obj[1]);
                break;
            case "-":
                this.value = this.do_math(obj[0],obj[2],obj[1]);
                break;
            case "/":
                this.value = this.do_math(obj[0],obj[2],obj[1]);
                break;
            case "x":
                this.value = this.do_math(obj[0],obj[2],obj[1]);
                break;
        }
    }

    this.do_math = function(num1,num2,oper){
        switch (oper) {
            case "+":
                return Number(num1) + Number(num2);
                break;
            case "-":
                return Number(num1) - Number(num2);
                break;
            case "/":
                return Number(num1) / Number(num2);
                break;
            case "x":
                return Number(num1) * Number(num2);
                break;
        }
    }

    this.clear = function() {

        if(this.index > 0 && typeof global[this.index] === 'object')
        {
            global.splice(this.index-1,2);
            this.index-=2;
        } else if(this.index > 0){
            global.pop();
            this.index--;
            global[this.index] = [''];
        }

        this.inputstate = false;
        this.clearstate = true;
        param(undefined);
        console.log(global);
    }

    this.allClear = function() {
        global = [''];
        this.index = 0;
        param(undefined);
        console.log(global);
    }
}