/*
TODO: 
    -maybe move some functions from the global space to either of the pseudoClasses
    -transpose function to instrument so that we can generate more voicings
    -Verify that the chord that is spit out contains all the intervals
    -Add 7,11 extra chords
*/

//Extend Object and String to make our lives easier
Object.prototype.getKeyByValue = function (value) {
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
            if (this[prop] === value)
                return prop;
        }
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//Here begin the functional functions :)
function each(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
        callback(arr[i]);
    }
}
function contains(arr, value) {
    result = false;
    each(arr, function (e) {
        if (e == value)
            result = true;
    });
    return result;
}
function map(func, array) {
    var result = [];
    each(array, function (element) {
        result.push(func(element));
    });
    return result;
}
function reduce(combine, base, array) {
    each(array, function (element) {
        base = combine(base, element);
    });
    return base;
}
function uniq(array) {
    var result = [];
    each(array, function (element) {
        if (!contains(result, element)) { result.push(element); };
    });
    return result;
}

//here end the functional functions

//object music will contain stuff related to music theory
var Music = {
    noteNames: { c: 1, cs: 2, d: 3, ds: 4, e: 5, f: 6, fs: 7, g: 8, gs: 9, a: 10, as: 11, b: 12, b: 0 },
    INTERVAL: { perfUnison: 0, min2: 1, maj2: 2, min3: 3, maj3: 4, perf4: 5, aug4: 6, dim5: 6, perf5: 7, min6: 8, maj6: 9, min7: 10, maj7: 11, perf8: 12 },
    TRIAD: { maj: ["perfUnison", "maj3", "perf5"], min: ["perfUnison", "min3", "perf5"], dim: ["perfUnison", "min3", "dim5"], aug: ["perfUnison", "maj3", "aug5"] }
}

//MusicalString is kind of a class that contains methods for strings and generates strings for new instruments
function MusicalString(number, rootNote, frets) {
    this.number = number || 1; //This is the number relative to the instrument
    this.rootNote = rootNote || "c"; //When the string is played open
    this.rootNoteNumber = Music.noteNames[this.rootNote];

    this.frets = frets || 26; //The amount of frets

    this.notesArray = function () {
        arr = [];

        for (var i = 0; i <= this.frets; i++) {
            noteNormalized = (this.rootNoteNumber + i) % 12;
            arr.push(Music.noteNames.getKeyByValue(noteNormalized));
        }
        return arr;
    };
}

//Instrument is kind of a class that generates new instruments from tunings given by the user
function Instrument(name, tuning) {
    this.name = name || 'guitar';
    this.tuning = tuning || tunings['guitar'];
    this.numberOfStrings = this.tuning.length;
    //create a new instance of String 
    for (var i = 1; i <= this.numberOfStrings; i++) {
        this["string" + i] = new MusicalString(i, tuning[i - 1], 20);
    }

    this.voicing = function (chordArr) {//takes a parameter in the form of an array i.e. ["c","maj"]
        var chord = getChord(chordArr) || ["c", "c", "c"];
        voicing = [];
        for (var i = 1; i <= this.numberOfStrings; i++) {

            //Now we iterate over the strings to find the notes
            for (var j = 0; j < 20; j++) {
                //t = 0;
                currentNote = this["string" + i].notesArray()[j];
                //console.log(currentNote);
                if (contains(chord, currentNote)) {
                    voicing.push(j);
                    break;
                }
            }
        }

        //console.log(voicing);
        return voicing;
    };

};



tunings = {
    guitar: ["e", "b", "g", "d", "a", "e"],
    ukulele: ["a", "e", "c", "g"],
    bass: ["g", "d", "a", "e"]
}

function createInstrument(name) { //Make it accept tunings as well
    window[name] = new Instrument(name, tunings[name]);
}

createInstrument("guitar"); 
createInstrument("ukulele");
createInstrument("bass");


function chordNumberToName(chordNum) {
    return Music.noteNames.getKeyByValue(chordNum);
}

function chordNumbersToNames(arr) { //turn it in to note letters i.e. "c"
    names = [];
    each(arr, function (e) { names.push(chordNumberToName(e)); })
    return names;
}

function getChord(chord) {
    arr = [];
    root = chord[0];
    quality = chord[1];
    arr = [
	Music.noteNames[root] + Music.INTERVAL[Music.TRIAD[quality][0]],
	(Music.noteNames[root] + Music.INTERVAL[Music.TRIAD[quality][1]]) % 12, //We normalized the subsequent notes with %12
	(Music.noteNames[root] + Music.INTERVAL[Music.TRIAD[quality][2]]) % 12
    ];
    arr = chordNumbersToNames(arr);
    return arr;
}


