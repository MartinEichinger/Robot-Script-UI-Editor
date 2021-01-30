import { genRect, updateDate, addTask } from './ui_editor.js';

var $ui_editor_body = $('#ui-editor-body');

// save function
export async function save() {
    console.log("saveLoad/save");

    // init json object
    var json = {};

    // write script title to json object
    var $title = $('#scriptTitle');
    json['title'] = $title[0].value;

    // write key data of libraries to json object
    var lib = [];
    var $lib = $('.library');
    var dropItems = $lib.find('.dropItem');

    for (var dropItem of dropItems) {
        console.log(dropItem);
        lib.push({
            'id': dropItem.id,
            'img1': dropItem.children[0].src,
            'txt': dropItem.children[1].textContent,
            'img2': dropItem.children[2].src 
        });
    }

    json['library'] = lib;
    console.log("Lib", json);

    // write key data of tasks to json object
    var tasks = [];
    var $tasks = $('.tasks');
    var taskItems = $tasks.find('.taskItem');

    for (var taskItem of taskItems) {
        console.log(taskItem);
        tasks.push({
            'txt': taskItem.children[0].children[1].value
        })
    }

    json['tasks'] = tasks;
    console.log('Tasks', json);


    // write data to hard drive
    const response = await fetch("/save_load", {
        method: "POST",
        body: JSON.stringify({
          body: json,
        }),
    });
    //var result = await response.json();
    //result = JSON.parse(result);
}

export async function load() {
    console.log("saveLoad/load");

    // Retrieve data from local file
    const response = await fetch("/save_load", {});
    var result = await response.json();
    result = JSON.parse(result);

    // write script title to json object
    var $title = $('#scriptTitle');
    $title[0].value = result.title;

    // container for libraries and tasks
    var $list = $(".library");

    // add libraries
    for (var item of result.library) {
        // generate rect for library
        var img = item.img1.split('/');
        var text = item.txt;
        var $dropItem = genRect('dropItem', {'type': 'text', 'value': text}, 'rem', img.pop(), `RecycleBinWhite.svg`, text);
        console.log("saveLoad/load: ",$dropItem);
        $dropItem.addClass(`${text}`).appendTo($list);
        
        // add task-button only once with the first library
        if ($(".dropItem", $ui_editor_body).length === 1) {
            $("<div class='addtask'><div class='line'></div><div class='d-flex flex-row'><button id='addtask'>+</button><div id='tour_docking_2'></div><p>Add Task</p></div></div>").appendTo($ui_editor_body);
        }
    }

    // add tasks
    for (var item of result.tasks) {
        addTask(item.txt);
    }

    // update date of updating the drawing
    updateDate();
}