/**
 * Created by danh on 10/11/16.
 */
var my_calculator = new calculator(calc);
var multipleSign = "*"; // definite your text for multiple

$(document).ready(apply_click_handler);




function calc(value){
    //console.log("Inside calc function value is " + value);
    switch(value) {
        case undefined:
            $("#calc_skeleton").find(".screen").text("");
            break;
        case Infinity:
            $("#calc_skeleton").find(".screen").text("Error");
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
            case multipleSign: // this just a customer handler for multiple sign ( x / * )
                my_calculator.defineType("x");
                my_calculator.addInput("x");
                break;
            default:
                my_calculator.defineType(val);
                my_calculator.addInput(val);
                break;
        }

    });
}

function calculator(param) {
    this.type = null;
    this.value = null;
    this.index = 0;
    var gArray = [''];
    var gAdvancedArray = [];

    if(typeof param == 'function') // check is param is function if so set status to true to execute later
    {
        var isfunction = true;
    }

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
    }

    this.addInput = function(value) { // This function has state when
        switch (this.type) {
            case "equalSign":
                console.log("Initial Original array is ", gArray);
                /*
                These functions do not pass the array as parameter, instead they use global variable of the object
                 */

                if(typeof gArray[this.index] === 'object') {
                    //the last thing pressed was an operator, and this press is also an operator
                    console.log("1) Array after switch is  ", gArray);
                    if(gArray[this.index-1]===value){
                        //and they pressed the exact same operator as last time
                        // advanced operations gArray[this.index] = gArray[this.index-2];
                    } else {
                        //they pressed an operator again, but this time it is different than before
                        gArray.splice(this.index-1,2);
                        this.index-=2;
                        console.log("2) Array after switch is  ", gArray);
                    }
                }
                console.log("3) Array after switch is  ", gArray);

                this.inputNumber(value);
                this.modifyArrayIfEnter();
                this.saveLastInputForAdvancedOperations();
                this.loopArrayForMultipleDivision();
                this.loopArrayForAdditionSubtraction();
                console.log("Advanced operation array ", gAdvancedArray);
                this.inputstate = false;
                // set state to false after so we can branch a different logic for multiple entries of equal signs
                break;
            case "operator":
                this.switchKey(value);
                this.inputOperator(value);
                this.inputstate = false; // set state to false after so it cannot be input more than once
                break;
            case "period":
                this.inputNumber(value);
                this.inputstate = false; // same as operator, cannot be input more than twice because of state status
                break;
            default:
                this.inputstate = true; // sets state to true before so it catches any inputs that are numbers
                this.inputNumber(value);
                break;
        }
        if (isfunction) {
            //console.log("This value is " + this.value);
            param(this.value); // this is calling the callback function
        }
    }

    this.incrementKey = function() {
        this.index++;
    }

    this.switchKey = function(value) {

        if(typeof gArray[this.index] === 'object') {
            //the last thing pressed was an operator, and this press is also an operator

            if(gArray[this.index-1]===value){
                //and they pressed the exact same operator as last time
                // advanced operations gArray[this.index] = gArray[this.index-2];
            } else {
                //they pressed an operator again, but this time it is different than before
                gArray.splice(this.index-1,2);
                this.index-=2;
            }
        }
        console.log("Array after switch is  ", gArray);
    }

    this.inputOperator = function(value) { // increments key inputs operator and then increments again
        this.incrementKey();
        gArray[this.index] = value;
        this.value = gArray[this.index];
        this.incrementKey();
        gArray[this.index] = [''];
    }

    this.inputNumber = function(value){
        if(this.inputstate) { // Concantenate input into current array sub index
            gArray[this.index] += value;
            this.value = gArray[this.index];
        } else { // replace the input into current array sub index
            gArray[this.index] = value;
            this.value = gArray[this.index];
        }
        //console.log("This this.value is " + this.value);
        //console.log("This value is " + value);
    }

    this.modifyArrayIfEnter = function() {
        /* this function will process if an equalSign was pressed last (state as false)
         */
        if(!this.inputstate) { // if input state is not true
            this.incrementKey();
            gArray[this.index] = gAdvancedArray[0];
            this.incrementKey();
            gArray[this.index] = gAdvancedArray[1];
        }
        //console.log("The obj is ", obj);
        //console.log("The global array is ", gArray);
    }

    this.loopArrayForMultipleDivision = function() {
        /* this function loops through the array and looks for multiple and division first and if it finds it
        it will then substitute the results into the 3rd index position (ie: 3 X 3 = 0 + 9)
        When the loop is done, it calls the next function loopArrayforAdditionSubstraction to run the multiplication as is
         */
        for(var i = 0; i < gArray.length;i++)
        {
            if(gArray[i] === 'x' || gArray[i] === '/')
            {
                //console.log(gArray[i]);
                this.value = this.do_math(gArray[i-1],gArray[i+1],gArray[i]);
                gArray[i-1] = 0;
                gArray[i] = "+";
                gArray[i+1] = this.value;
            }
        }
        //console.log("final Multiple array(parameter) is ", obj);
        console.log("final Multiple array(global) is ", gArray);
    }

    this.loopArrayForAdditionSubtraction = function() {
        for(var i = 0; i < gArray.length;i++)
        {
            if(gArray[i] === '+' || gArray[i] === '-')
            {
                //console.log("Set State " + this.inputstate);
                this.value = this.do_math(gArray[i-1],gArray[i+1],gArray[i]);
                gArray[i-1] = 0;
                gArray[i] = "+";
                gArray[i+1] = this.value;

            }
        }
        console.log("Final Addition array is ", gArray);
    }

    this.saveLastInputForAdvancedOperations = function() {
        /* This function saves the last 2 input values of our main global array so we can execute
        advanced operations
         */
        gAdvancedArray[0] = gArray[gArray.length - 2];
        gAdvancedArray[1] = gArray[gArray.length - 1];
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
            default:
                break;
        }
    }

    this.clear = function() {

        if(this.index > 0 && typeof gArray[this.index] === 'object')
        {
            gArray.splice(this.index-1,2);
            this.index-=2;
        } else if(this.index > 0){
            gArray.pop();
            this.index--;
            gArray[this.index] = [''];
        }
        this.inputstate = false;
        param(undefined);
        //console.log(gArray);
    }

    this.allClear = function() {
        gArray = [''];
        this.index = 0;
        param(undefined);
        //console.log(gArray);
    }
}