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
    var calc = this;
    var global = [''];

    this.defineType = function(value) { // This function evaluates the type of the input and assigns it 4 types
        if(!isNaN(value)) {
            calc.type = "number";
        } else if(value === "=") {
            calc.type = "equalSign";
        } else if(value === ".") {
            calc.type = "period"
        } else {
            calc.type = "operator";
        }
        calc.addInput(value); // This calls the next function in the chain after type has been set.
    }

    this.addInput = function(value) { // This function has state when
        switch (calc.type) {
            case "equalSign":
                calc.choose_math(global);
                calc.allClear();
                break;
            case "operator":
                calc.switchKey(value);
                calc.inputstate = false; // set state to false after so it cannot be input more than once
                break;
            case "period":
                calc.inputNumber(value);
                calc.inputstate = false; // likewise
                break;
            default:
                calc.inputstate = true; // sets state to true before so it catches any inputs that are numbers
                calc.inputNumber(value);
                break;
        }
        console.log("this is state " + calc.state);
        if (isfunction) {
            param(this.value);
        }
        console.log(calc);
        console.log(global);
    }

    this.incrementKey = function() {
        if(calc.inputstate || !calc.clearstate) {
            console.log("This is incremented");
            calc.index++;
        }
    }
    this.switchKey = function(value) { // increments key to input next value and increment to get ready for next number
        calc.incrementKey();
        global[calc.index] = value;
        this.value = global[calc.index];
        calc.incrementKey();
        global[calc.index] = [''];
    }

    this.inputNumber = function(value){
        if(calc.inputstate) {
            global[calc.index] += value;
            this.value = global[calc.index];
        } else {
            this.value = global[calc.index];
        }
    }

    this.choose_math = function(obj){
        switch (obj[1]){
            case "+":
                this.value = calc.do_math(obj[0],obj[2],obj[1]);
                break;
            case "-":
                this.value = calc.do_math(obj[0],obj[2],obj[1]);
                break;
            case "/":
                this.value = calc.do_math(obj[0],obj[2],obj[1]);
                break;
            case "x":
                this.value = calc.do_math(obj[0],obj[2],obj[1]);
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
        global.pop();
        if(calc.index > 0)
        {
            calc.index--;
        }
        global[calc.index] = [''];
        calc.inputstate = false;
        calc.clearstate = true;
        param(undefined);
        console.log(global);
    }

    this.allClear = function() {
        global = [''];
        calc.index = 0;
        param(undefined);
        console.log(global);
    }
}