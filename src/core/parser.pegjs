{
  const {Do, Re, Mi, Fa, Sol, La, Si} = require('./constants');
  const notesValues = {
    c: Do,
    d: Re,
    e: Mi,
    f: Fa,
    g: Sol,
    a: La,
    b: Si,
    'do': Do,
    're': Re,
    'ré': Re,
    'rè': Re,
    'mi': Mi,
    'fa': Fa,
    'sol': Sol,
    'la': La,
    'si': Si,
  };
  
  function createTrack(strings) {
    const track = {
      tuning: null,
      data: [],
      stringCount: 0,
      length: 0,
      source: text(),
      span: location(),
      errors: [],
    };

    strings.forEach((string, stringNum) => {
      console.debug(string);
      if (string.tuning) {
        (track.tuning || (track.tuning = []))[stringNum] = string.tuning;
      }
      string.data.forEach((point) => {
        point.string = stringNum;
      });
      track.data = track.data.concat(string.data);
      track.stringCount ++;
      track.length = Math.max(track.length, string.length)
    });
    track.data.sort((a, b) => a.pos - b.pos);
    return track;
   }
}

Main = (Track / Text)+

Text
	= (!Track .)+ { return text(); }

Track
	= strings:(TrackString)+ { return createTrack(strings); }
    / strings: (TrackStringTuning)+ { return createTrack(strings); }

Note = name:NoteName octave:Octave? accidental:Accidental? {
	return {
    	name: name,
        octave: octave || null,
        accidental: accidental || null,
    };
}

NoteName 
	= ('do'i / 're'i / 'ré'i / 'rè'i / 'mi'i / 'fa'i / 'sol'i / 'la'i / 'si'i / [a-g]i)
  	{
    	return notesValues[text().toLowerCase()];
	}
    
TrackString 
	= trackData:TrackStringData
    {
    	trackData.tuning = null;
        return trackData;
    }

TrackStringTuning
	= tuning:Note _ trackData:TrackStringData
    {
    	trackData.tuning = tuning;
        return trackData;
    }
    
TrackStringData
	= ('|')? _ matches: (Fret / Effect / '-')+ [\r\n]?
	{
    	const dataStart = location().start.column;
        const data = [];
        matches.forEach((d) => {
        	if (typeof d !== 'string') {
            	d.pos -= dataStart;
                data.push(d);
            }
        });
    	return {
        	data: data,
            length: matches.length,
        };
	}

Fret 
	= [0-9]+
	{ 
    	const fret = parseInt(text(), 10);
        const pos = location().start.column;
        return {fret, pos};
    }
Effect
	= ([hpbr\/\vtsS*=xo\.~]) / 'tr'i / 'tp'i / 'pm'i / '<>'
    {
        const pos = location().start.column;
        return {text: text(), pos};
    }

Octave = '-'? [0-9]+ { return parseInt(text(), 10); }

Accidental
	= [♭b] { return -1; }
    / [♯#] { return 1; }

_
  = [ \t]*
