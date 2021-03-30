
require('popper.js');
let $ = require('jquery');
const path = require('path');
let electronRemote = require('electron').remote;

//WIDGETS FUNCTIONS

function closeApp(){
  electronRemote.getCurrentWindow().close();
}

function minimizeApp(){
  electronRemote.getCurrentWindow().minimize();
}

function maximizeApp(){
  if(!electronRemote.getCurrentWindow().isMaximized()){
    electronRemote.getCurrentWindow().maximize();
  }
  else{
    electronRemote.getCurrentWindow().restore();
  }

}


function viewStock(){
  $.get(path.join(__dirname, 'stock.html'), {}, function(data){
    document.body.innerHTML = data;
    setTimeout(function(){
      writeStock().then(function(){
        setTotals();
        setBusinessInfo();
      });
    }, 100)
  });
}

function viewIndex(){
  window.location.reload();
}

function tellUser(msg){
  document.getElementById('toast').innerHTML = msg;
  $('#toast').fadeIn();
  setTimeout(function(){
    $('#toast').fadeOut();
  }, 5000);
}


function showLoader(){
  $('#loader').fadeIn();
}

function hideLoader(){
  $('#loader').fadeOut();
}

function deactivateNavItem(item){
  let img = item.children[0];
  let ind = item.children[1];
  ind.style.visibility = 'hidden';
  img.style.width = '50%';
}


function activateNavItem(item){
  let img = item.children[0];
  let ind = item.children[1];
  ind.style.visibility = 'visible';
  img.style.width = '80%';
}

function showView(view){
  $('.view').css('display', 'none');
  view.style.display = 'block';
}


function navTo(to){
  document.getElementById('viewTitle').innerHTML = to;
  let navItems = document.getElementsByClassName('sideBarMenuItem');
  let currentNavItem = document.getElementById(to+'Nav');
  let currentView = document.getElementById(to+'View');
  for(let i = 0; i < navItems.length; i++){
    deactivateNavItem(navItems[i]);
  }
  activateNavItem(currentNavItem);
  showView(currentView);
}

function setAlertDialog(msg, onYes){
  $('.paper').fadeIn();
  document.getElementById('alertDialog').style.display = 'block';

  document.getElementById('alertDialogContent').innerHTML = msg;
  $('#alertDialogYes').click(function(){
    onYes();
    document.getElementById('alertDialogContent').innerHTML = '';

    if(document.getElementById('overLayContent').style.display != 'block'){
      $('.paper').fadeOut();
    }
    document.getElementById('alertDialog').style.display = 'none';
  });

  $('#alertDialogNo').click(function(){
    document.getElementById('alertDialogContent').innerHTML = '';
    if(document.getElementById('overLayContent').style.display != 'block'){
      $('.paper').fadeOut();
    }
    document.getElementById('alertDialog').style.display = 'none';
  });
}

function setOverlay(htmlData){
  $('.paper').fadeIn();
  document.getElementById('overLayContent').style.display = 'block';
  $.get(path.join(__dirname, htmlData), {}, function(data){
    document.getElementById('overLayContent').innerHTML = data;
  });
}

function closeOverlay(){
  document.getElementById('overLayContent').innerHTML = '';
  if(document.getElementById('alertDialog').style.display != 'block'){
    $('.paper').fadeOut();
  }
  $('#overLayContent').fadeOut();
}
