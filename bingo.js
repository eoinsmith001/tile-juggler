Tiles = new Meteor.Collection("tiles");

if (Meteor.isClient) {

  var dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    this.classList.add('moving');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML );
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();  // allows to drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } 
    // do nothing if dropping same tile we are dragging
    if (dragSrcEl != this ) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData( 'text/html' );
    }
    return false;
  }

  function handleDragEnd(e) {
    [].forEach.call( $('.tile'), function(tile) {
      tile.classList.remove( 'over' );
      tile.classList.remove('moving');
    });
  }

  Template.tiles.all = function () {
    return Tiles.find({}, {sort: {name: 1}});
  };

  Template.tile.rendered = function() {
    this.firstNode.addEventListener( 'dragstart', handleDragStart, false );
    this.firstNode.addEventListener( 'dragenter', handleDragEnter, false );
    this.firstNode.addEventListener( 'dragover' , handleDragOver , false );
    this.firstNode.addEventListener( 'dragleave', handleDragLeave, false );
    this.firstNode.addEventListener( 'drop'     , handleDrop     , false );
    this.firstNode.addEventListener( 'dragend'  , handleDragEnd  , false );
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Tiles.find().count() === 0) {
      Tiles.insert({name: "one"});
      Tiles.insert({name: "two"});
      Tiles.insert({name: "three"});
      Tiles.insert({name: "four"});
      Tiles.insert({name: "five"});
    }
  });
}
