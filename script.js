/**
 * Created by danh on 10/11/16.
 */
var my_calculator = new calculator(calc);
var multipleSign = "*"; // definite your text for multiple

function calc(type, value, item){
    switch(value) {
        case undefined:
            $("#calc_skeleton .screen").text("");
            break;
        default:
            $("#calc_skeleton .screen").text(value);
            break;
    }

}

function apply_click_handler() {

    $("#calc_skeleton").on("click","button.btn",function() {
        console.log($(this).text());
        var screen = $("#calc_skeleton .screen");
        var val = $(this).text();
        switch(val) {
            case 'CE':
                my_calculator.allClear();
                break;
            case 'C':
                my_calculator.clear();
                break;
            case multipleSign:
                my_calculator.addItem("x");
                break;
            default:
                my_calculator.addItem(val);
                break;
        }

    });
}

$(document).ready(apply_click_handler);