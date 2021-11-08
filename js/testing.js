
const wizards = {
    neville: 'Gryffindor',
    malfoy: 'Slitherin',
    cedric: 'Hufflepuff'
};

var handler = {
    get: function (obj, prop) {

        // Do stuff when someone gets a property
        console.log('Got your value!');

        // Return the value
        // This is what happens by default when you don't have a Proxy
        return obj[prop];

    },
    set: function (obj, prop, value) {

        // Do stuff when someone sets a property
        console.log('Just set your value, dude');

        // Set a property
        // This is what happens by default when you don't have a Proxy
        obj[prop] = value;

        // Indicate success
        return true;

    },
    deleteProperty: function (obj, prop) {

        // Do stuff when someone deletes a property
        console.log('Deleted a property... bye bye bye!');

        // Delete the property
        delete obj[prop];

        // Indicate success
        return true;

    }
};


const wizardsProxy = new Proxy(wizards, handler);
