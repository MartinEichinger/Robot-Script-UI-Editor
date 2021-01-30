import { save } from './saveLoad.js';

// global variables 
var rectNumber = 1;
var $ui_editor_body = $('#ui-editor-body');
var $ui_drop_items = $('.ui-drop-items');
var $title = $('#scriptTitle');

// Instance the tour
var tour = initTour();

// DRAG&DROP: Init
function initDragDrop() {
    // let RPAFramework and RobotFramework items be draggable
    $("li", $ui_drop_items ).draggable({
        revert: "invalid",
        containment: "document",
        helper: "clone",
        cursor: "move",
    });

    // let the document body be droppable
    $ui_editor_body.droppable({
        accept: ".ui-drop-items > li",
        classes: {
            "ui-droppable-active": "highlight"
        },
        hoverClass: 'drop-hover',
        drop: function( event, ui ) {
            addLibrary(ui.draggable);
        },
        over: function(event, ui) {
            addHoverItem(ui.draggable);
        },
        out: function(event, ui) {
            console.log("droppable out");
            remHoverItem(ui.draggable);
        }
    });

    // add container for library and tasks
    $( "<ul class='library'/>" ).appendTo( $ui_editor_body );
    $( "<div class='tasks'/>" ).appendTo( $ui_editor_body );
}

// TOUR: Initialize shephard tour
function initTour(){
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: {
            enabled: false
            },
            classes: 'class-1 class-2',
            scrollTo: { behavior: 'smooth', block: 'center' }
        }
    });
        
    tour.addStep({
        title: 'Step: 1 of 3',
        text: `Drag and drop any library to Process Script area or within the existing parent node.`,

        attachTo: {
            element: '#tour_docking_1',
            on: 'auto'
        },

        buttons: [
            {
            action() { 
                localStorage.setItem("tour_step", "1");
                return this.complete(); 
            },
            text: 'Next'
            },
            {
            action() { 
                localStorage.setItem("tour_step", "1");
                return this.complete(); 
            },
            classes: 'shepherd-button-secondary',
            text: 'Skip Tour'
            }
        ],

        id: 'step1'
    });

    tour.addStep({
        title: 'Step: 2 of 3',
        text: `Add several tasks which need to be performed from here.`,

        attachTo: {
            element: '#tour_docking_2',
            on: 'bottom'
        },

        buttons: [
            {
            action() { 
                localStorage.setItem("tour_step", "2");
                return this.complete(); 
            },
            text: 'Next'
            },
            {
            action() { 
                localStorage.setItem("tour_step", "2");
                return this.complete(); 
            },
            classes: 'shepherd-button-secondary',
            text: 'Skip Tour'
            }
        ],

        id: 'step2'
    });

    return tour;
}

// DATE: update date in title
export function updateDate(opt) {
    var date = new Date;

    if (opt==="created") {
        $('#currentDate').text(`Created ${date.toLocaleString("en-US")}`);
    } else {
        $('#currentDate').text(`Updated ${date.toLocaleString("en-US")}`);
    }
}

// EDITOR METHODS
// EDITOR: generate rect element (itemType: 'bar', 'dropItem' | content: 'text': 'value', 'input field': 'value' | icon | icon)
export function genRect(itemType, content, remove, leftImg, rightImg) {
    var inputType = content['type'];
    var inputText = content['value'];

    var $divTask = remove === "rem" ? 
        $(`<div id='rect${rectNumber}' class='${itemType} d-flex flex-row justify-content-between'></div>`): 
        $(`<div class='${itemType} d-flex flex-row justify-content-between'></div>`);
    var $leftImg = $(`<img src='static/ui_editor/img/${leftImg}'/>`);
    var $rightImg = $(`<img class='rect' src='static/ui_editor/img/${rightImg}'/>`);
    var id = `#rect${rectNumber}`;
    $rightImg.click(function () {
        $(id).remove();
        if($(".dropItem", $ui_editor_body ).length === 0){
            $('.addtask').remove();
        }
    });
    var inputValue = inputText === undefined ? '' : `value=${inputText}`;
    var $text = inputType === 'input' ? 
        $(`<input class='text' type='text' placeholder='Type task title' ${inputValue} />`): 
        `<div class='text'>${inputText}</div>`;

    // update global rect counter
    rectNumber += 1;

    return $divTask.append($leftImg).append($text).append($rightImg);
}

// EDITOR: generate rect element with horizontal line + task button
function genRectHorBtn(type, rect) {
    var $rectHorBtn = $(`<div class='${type} d-flex flex-row'></div>`);
    var $horLine = $("<div class='horLine'></div>");
    var $button = $("<div class='addkeyword'><div class='d-flex flex-row'><button id='addkeyword'>+</button><p>Add Keyword</p></div></div>");

    return $rectHorBtn.append(rect).append($horLine).append($button);
}

// EDITOR: function addLibrary after drag
function addLibrary($item) {
    // container for libraries and tasks
    var $list = $(".library");
    var $tasks = $(".tasks");

    // remove drag space
    $('#remove').remove();

    // copy content of draggable and delete/replace chars '_', '(', ')' and empty spaces
    $item = $item.clone();
    var listItemId = $item.context.innerText.replace('.', '_').replace(/ /g,'').replace('(','').replace(')','');

    // add library only once
    if ($(`.${listItemId}`).length !== 0) return 0;

    // generate rect for library
    var img = $item.find("img");
    img[0].src = img[0].src.replace('.svg', '-white.svg');
    img = img[0].src.split('/');
    var text = $item.find(".text");
    var $dropItem = genRect('dropItem', {'type': 'text', 'value': text[0].textContent}, 'rem', img.pop(), `RecycleBinWhite.svg`);
    $dropItem.addClass(`${listItemId}`).appendTo($list);
    
    // add task-button only once with the first library
    if ($( ".dropItem", $ui_editor_body ).length === 1) {
        $("<div class='addtask'><div class='line'></div><div class='d-flex flex-row'><button id='addtask'>+</button><div id='tour_docking_2'></div><p>Add Task</p></div></div>").appendTo($ui_editor_body);
    }

    // update date of updating the drawing
    updateDate();

    // show next step of tour, if library added first time
    if( !(localStorage?.getItem('tour_step') > 1) ){
        tour.show('step2');
    };
}

// EDITOR: function addTask after click "add task"
export function addTask(text) {
    // get task container
    var $tasks = $(".tasks");

    // generate taskItem
    var $divTask = genRect('bar', {'type': 'input', 'value': text}, 'no-rem',`task-white.svg`, `RecycleBinWhite.svg`);
    var $taskItem = genRectHorBtn('taskItem', $divTask);

    // add vertical line and taskItem to task container
    var $line = $("<div class='line'></div>");
    var $div = $(`<div id='rect${rectNumber-1}'></div>`)
    $div.append($line);
    $div.append($taskItem);
    $tasks.append($div);

    // update date after editor update
    updateDate();
}

// EDITOR: function addHoverItem before drag
function addHoverItem($item) {
    if ($( "ul", $ui_editor_body ).length > 0) {
        var $list = $(".library");

        var $dropItem = $("<li id='remove' class='dropItem'></li>");
        var $div = $("<div class='remove d-flex flex-row'></div");
        var $img = $("<img src='static/ui_editor/img/DropHereIcon.svg'/>");
        var $text = $("<p class='text'>Drop here</p>");

        $div.append($img);
        $div.append($text);
        $dropItem.append($div);
        $dropItem.appendTo($list);
    }
}

// EDITOR: function remove hover item when drag is interrupted
function remHoverItem($item) {
    $('#remove').remove();
}

// EDITOR EVENTS
// EDITOR: add task event
$(document).on("click", "#addtask", function(){
    addTask();
});

// HEADER: update date in header when title is changed
$(document).on("change", '#scriptTitle', function(){
    updateDate();
});

// WARNING MODAL
// MODAL: save script event
$(document).on("click", '#saveNewModal', function(){
    $('#newModal').modal('hide');
    save();
    $ui_editor_body.empty();
    $title[0].value = '';
    initDragDrop();
    updateDate('created');
});

// MODAL: discard script event
$(document).on("click", '#discardNewModal', function(){
    //var $ui_editor_body = $('#ui-editor-body');
    $('#newModal').modal('hide');
    $ui_editor_body.empty();
    $title[0].value = '';
    initDragDrop();
    updateDate('created');
});

$( function() {

    $('#search').on('input',function(event) {
        console.log("hier");
        search(event);
    });
    
    // Init drag&drop
    initDragDrop();

    $('#newModal').on()

    // implement tooltip
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

    // init with new time
    updateDate('created');

    // show first step of tour, if program started first time
    if( !(localStorage?.getItem('tour_step') > 0) ){
        tour.start();
    };
});