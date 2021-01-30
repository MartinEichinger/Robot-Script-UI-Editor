var $ui_drop_items = $('.ui-drop-items');

// SIDEBAR
// SEARCH: search function
async function search(event) {
    console.log("searched");
    event.preventDefault();
    var searchvalue = event.currentTarget.value;
  
    // retrieve filtered lib data
    const response = await fetch("/", {
      method: "POST",
      body: JSON.stringify({
        body: searchvalue,
      }),
    });
    var result = await response.json();
    result = JSON.parse(result);


    // update item list / standard list / external list / other list 
    var keys = Object.keys(result);
    var ident = ['#ui-drop-items', '#ui-drop-items2', '#ui-drop-items3', '#ui-drop-items4'];

    ident.map((item, i) => {
        var $item = $(item);
        $item.empty();

        var itemList = result[keys[i]];
        for (item of itemList) {
            var a = $(`<li class="item-group" data-jbox-title="${item.name}" data-jbox-content="${item.tips}"></li>`);
            var b = $(`<div class="item"><img src="static/ui_editor${item.icon}" /></div>`);
            var c = $(`<div class="text">${item.name}</div>`);
            a.append(b).append(c);
            $item.append(a);
        }
    })

    // Refresh tooltips
    new jBox('Tooltip', {
        theme: 'TooltipDark',
        delayOpen: 150,
        position: {
            x: 'left',
            y: 'bottom'
        },
        attach: '.item-group',
        getTitle: 'data-jbox-title',
        getContent: 'data-jbox-content'
      });

    // refresh assignment of being draggable
    $("li", $ui_drop_items ).draggable({
        revert: "invalid",
        containment: "document",
        helper: "clone",
        cursor: "move",
    });
}