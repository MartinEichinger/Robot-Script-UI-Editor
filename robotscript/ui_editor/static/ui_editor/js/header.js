import { save, load } from './saveLoad.js';

// events of header section

// click "save" button event
$('#save').click(function(){
    console.log("save geklickt");
    save();
});

// click "load" button event
$('#load').click(function(){
    console.log("load geklickt");
    load();
})

// click "new" button event
$('#new').click(function(){
    $('#newModal').modal('show');
})
