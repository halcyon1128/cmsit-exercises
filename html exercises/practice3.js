$(document).ready(function () {
    const swapDivs = (div1, div2) => {
        const temp = $('<div>').hide(); // Temporary placeholder element


        // Insert temp before div1, then move div1 before div2, and finally replace temp with div2
        div1.before(temp);
        div2.before(div1);
        temp.replaceWith(div2);
    };

    $('#swapButton').on('click', swap2);
});

swap1 = function () {
    const div1 = $('#div1');
    const div2 = $('#div2');

    swapDivs(div1, div2);
}

swap2 = function () {
    var first = $('#container').children().first();
    var second = $('#container').children().last();
    first.before(second);
}