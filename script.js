/**
 * Created by Danh Le on 10/11/16.
 *
 * BUGS
 *
 * #1 ) Cannot enter a number starting with decimal after entering an operator .5 + .5
 * #2 ) Need to clear up the if else statements for input state, decimal counter and equalsign counter
 * #3 ) Need to limit the output of certain fractions to stay within screen ( 0.33333333 or 0.6666666)
 *
 * TEST
 *
 * Basic
 * 1 + 2 = 3 (Yes)
 * 1 * 2 = 2 (Yes)
 * 1 / 2 = 0.5 (Yes)
 * 1 - 2 = -1 (Yes)
 *
 * Comprehensive Operations
 * 1 + 1 + 2 = 4 (Yes)
 * 1 . 1 + 1 . 1 = 2.2 (Yes)
 * 1 ... 1 + 1 ... 1 = 2.2 (Yes)
 * 1 ++++ 2 = 3 (Yes)
 * 1 + - * 2 = 2 (Yes)
 * 1 + 1 = = = 4 (Yes)
 * 1 + 1 + = + = 8 (Yes)
 * 1 + 3 / 4 + 10 * 2 = 21.75 (No)
 * 1 / 0 = Error (Yes)
 *
 * Advanced Operations
 * ++++ 1 * 3 (Yes)
 * 3 * = 9 (Yes)
 * 3 = 3 (Yes)
 * = = = = 0 (Yes)
 *
 * Extra Operations
 * 1 + 3 / 4 + 10 * 2 = 21.75 (Yes!)
 */

$(document).ready(apply_click_handler);

var my_calculator = new calculator(calc);
var multipleSign = "*"; // definite your text for multiple


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
    this.partialOperandStatus = null;
    this.equalSignCounter = 0;
    this.decimalCount = 0;
    this.inputstate = true;
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
        //LFZ START
        switch (this.type) { // This switch statement evaluates the type property of our calc object, depending on what type, show addition methods
            case "equalSign": // If the current type is 'equalSign'
                console.log("Initial Original array is ", gArray);
                /*
                These functions do not pass the array as parameter, instead they use global variable of the object
                 */
                this.partialOperand(value); // this calls our function that evaluates partial Operand, basically run some logic if an = was pressed prematurely ( 3 + =)
                this.modifyArrayWithLastSavedComputations(); // at this point, we run our function to change our array of computational values to add the last 2 previous operations ( + 5 )
                this.saveLastInputForAdvancedOperations(); // we run this function to to save take the last 2 elements of the computational array and save it to a new array
                this.loopArrayForMultipleDivision(); // run through our array of computational values and multiple and divide first, convert the result in latter element with addition by 0 ( 5 * 5 = 0 + 25)
                this.loopArrayForAdditionSubtraction(); // call this function to loop through our array and compute all remaining addition and subtraction
                //console.log("Advanced operation array ", gAdvancedArray);
                this.equalSignCounter++; // increment our equal sign operator to run a check to see if an equal sign was pressed before (if it is more than 0 then it has already been pressed once)
                this.inputstate = false; // this boolean controls the adding of additional values into our computation array
                // set state to false after so we can branch a different logic for multiple entries of equal signs
                break;
            case "operator": // if the current type is 'operator'
                this.switchKey(value); // this function basically points our index to the next array element
                this.inputOperator(value); // this function inserts the operator into our computational array
                this.inputstate = false; // set state to false after so it cannot be input more than once
                this.decimalCount = 0; // reset decimal count after an operator has been pressed, this insures that the user can press a decimal again for the next computation (ie .5 + .5)
                break;
            case "period": // if the current type is period
                //debugger;
                this.inputNumber(value); // this function is the inserting the period into our global computation array
                this.decimalCount++; // increase our decimal count so that if it's more than 1, another period cannot be added to our array again
                this.inputstate = false; // same as operator, cannot be input more than twice because of state status
                break;
            default: // if not a period, if not an operator and if not equalSign (basically a number was pressed)
                this.inputstate = true; // sets state to true before so it catches any inputs that are numbers
                this.inputNumber(value); // this function is inserting any other value that's not period, operator, equalsign into our computational array
                break;
        }
        if (isfunction) {  // check this if our isfunction property is true or false, if true it is a function
            //console.log("This value is " + this.value);
            param(this.value); // this is calling the callback function param, param was the name of our parameter that's actually a function, here we invoke that function with this.value that's passed in as a parameter for that invoked function
        }
        //LFZ END
    }

    this.partialOperand = function(value) { // repeat code will have to optimize this later
        if(typeof gArray[this.index] === 'object') {
            //the last thing pressed was an operator, and this press is also an operator
            if(gArray[this.index-1]===value){
                //and they pressed the exact same operator as last time
                // advanced operations gArray[this.index] = gArray[this.index-2];
            } else {
                // if partially filled, take the first operand and fill in
                if (gArray.length <= 3) { // ( 3 + =)
                    gArray[this.index] = gArray[this.index-2];
                } else { // ( 3 + 3 + = )
                    console.log("larger " + gArray.length);
                    gArray[this.index] = 0;
                    console.log("Before gArray is ", gArray);

                    this.loopArrayForMultipleDivision();
                    this.loopArrayForAdditionSubtraction();
                    console.log("After gArray is ", gArray);

                    gArray[this.index-2] = gArray[this.index];
                    gArray[this.index] = gArray[this.index-2];

                    this.partialOperandStatus = true;
                }
            }
        }
        //console.log("3) Array after switch is  ", gArray);
    }

    this.incrementKey = function() {
        this.index++;
    }

    this.switchKey = function(value) {

        if(typeof gArray[this.index] === 'object') {
            //the last thing pressed was an operator, and this press is also an operator
            console.log("1) " + value);
            if(gArray[this.index-1]===value){
                //and they pressed the exact same operator as last time
                // advanced operations gArray[this.index] = gArray[this.index-2];
            } else {
                //they pressed an operator again, but this time it is different than before
                gArray.splice(this.index-1,2);
                this.index-=2;
                console.log("2) " + value);
            }
        }
        //debugger;
        //console.log("Array after switch is  ", gArray);
    }

    this.inputOperator = function(value) { // increments key inputs operator and then increments again
        this.incrementKey();
        gArray[this.index] = value;
        this.value = gArray[this.index];
        this.incrementKey();
        gArray[this.index] = [''];
    }

    this.inputNumber = function(value){
        if(this.inputstate &&  this.equalSignCounter === 0 && this.decimalCount === 0) { // if type is number and enter sign has not been pushed
            gArray[this.index] += value;
            this.value = gArray[this.index];
            // console.log("1) State is " + this.inputstate);
            // console.log("1) Partial State is " + this.partialOperandStatus);
            // console.log("1) Equal Sign Count is " + this.equalSignCounter);
            // console.log("1) Decimal Count is " + this.decimalCount);
        } else if (this.inputstate && this.equalSignCounter > 0 && this.decimalCount === 0) {
            this.allClear();
            gArray[this.index] += value;
            this.value = value;
            //console.log("2) State is " + this.inputstate);
            //console.log("2) Partial State is " + this.partialOperandStatus);
            //console.log("2) Equal Sign Count is " + this.equalSignCounter);
            //console.log("2) This value is " + this.value);
            //console.log("2) Decimal Count is " + this.decimalCount);
        } else if(this.inputstate && this.equalSignCounter === 0 && this.decimalCount > 0) { // if decimal has been pressed and it is pressed again
            gArray[this.index] += value;
            this.value = gArray[this.index];
            //console.log("3) State is " + this.inputstate);
            //console.log("3) Partial State is " + this.partialOperandStatus);
            //console.log("3) Equal Sign Count is " + this.equalSignCounter);
            //console.log("3) This value is " + this.value);
            //console.log("3) Decimal Count is " + this.decimalCount);
        } else if (this.equalSignCounter === 0) {  // if Equal Sign has been pressed and a number to next to press, clear the arrays/index and restart over
            this.value = gArray[this.index];
            //console.log("4) State is " + this.inputstate);
            //console.log("4) Partial State is " + this.partialOperandStatus);
            //console.log("4) Equal Sign Count is " + this.equalSignCounter);
            //console.log("4) This value is " + this.value);
            //console.log("4) Decimal Count is " + this.decimalCount);
        } else {
            this.allClear();
            gArray[this.index] += value;
            this.value = value;
            //console.log("5) State is " + this.inputstate);
            //console.log("5) Partial State is " + this.partialOperandStatus);
            //console.log("5) Equal Sign Count is " + this.equalSignCounter);
            //console.log("5) This value is " + this.value);
            //console.log("5) Decimal Count is " + this.decimalCount);
        }
    }

    this.modifyArrayWithLastSavedComputations = function() {
        /* this function will process if an equalSign was pressed last (state as false)
         */
        //console.log("Partial Operand status " + this.partialOperandStatus);
        if((!this.inputstate && gAdvancedArray.length ) && (!this.partialOperandStatus)) { // if input state is not true
            /*
            Checks for input state is not true
            Checks for if there has already been a previous computation
            Checks if partial operator has been activated already
             */
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
        //console.log("final Multiple array(global) is ", gArray);
    }

    this.loopArrayForAdditionSubtraction = function() {
        for(var i = 0; i < gArray.length;i++)
        {
            if(gArray[i] === '+' || gArray[i] === '-')
            {
                //debugger;
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
        //LFZ START
        if(this.index > 0 && typeof gArray[this.index] === 'object') // if this.index is greater than 0 (our array already has values and is not blank) AND the value inside is not an object, which means it's not an empty object literal that was prep for the next number added after an operand
        {
            gArray.splice(this.index-1,2); // removes the next number prepare (empty string object literal) and previous operator
            this.index-=2; // sets the index back by 2 spaces (move the cursor back 2)
        } else if(this.index > 0){ // if it's an operand or number
            gArray.pop(); // remove the current element
            this.index--; // decrease the index by 1
            gArray[this.index] = ['']; // sets the array element to empty string object for next data entry
        }
        this.inputstate = false; // set input state to false
        param(undefined); // run the callback function with undefined as the parameter
        console.log(gArray); // console log our global array for testing purpose
        //LFZ END
    }

    this.allClear = function() {
        gArray = [''];
        gAdvancedArray = [''];
        this.equalSignCounter = 0;
        this.decimalCount = 0;
        this.index = 0;
        this.value = 0;
        this.inputstate = true;
        param(undefined);
        //console.log(gArray);
    }
}