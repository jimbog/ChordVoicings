module Music
  INTERVAL = { #  name: semitones
    perfUnison: 0,
    min2: 1,
    maj2: 2,
    min3:  3,
    maj3: 4,
    perf4: 5,
    aug4: 6,
    dim5: 6,
    perf5: 7,
    min6: 8,
    maj6: 9,
    min7: 10,
    maj7: 11,
    perf8: 12
    
  }
  @@note_number = {"c"=>1, "cs"=>2, "d"=>3, "ds"=>4, "e"=>5, "f"=>6, "fs"=>7, "g"=>8, "gs"=>9, "a"=>10, "as"=>11, "b"=>12}
  #p  intervals[:min3]
  TRIAD = { #maj, min, aug, dim
      maj: [:perfUnison, :maj3, :perf5],
      min: [:perfUnison, :min3, :perf5],
      dim: [:perfUnison, :min3, :dim5],
      aug: [:perfUnison, :maj3, :aug5] 
    }
  def chord(chordName)
    quality = chordName[-3..-1]
    TRIAD[quality.to_sym]
  end
end

class MusicalString
  include Music
  attr_accessor :index, :root, :note, :note_location, :note_name, :frets, :intervals_arr
  #TheString has the following properties: index, open, fret, note,...
  def initialize(string_number, root, frets=20)
    @string_number = string_number
    @root = root
    @frets = frets
  end

  def press(at_fret)
    frets_norm = at_fret - (12*(at_fret/12))
    note = @@note_number[@root] + frets_norm
    note_location = @@note_number[@root] + at_fret
    note_name = @@note_number.key(note)
    interval = INTERVAL.key(frets_norm)
    return [note, note_location, note_name, interval]
  end
  def properties
    props = (0..@frets).map{|i| press(i)}
  end
  
  def find_interval()
    chord("cmaj")[0]
    
  end
  
end

firstString = MusicalString.new(1, "c")
p firstString.press(13)
p firstString.find_interval
p firstString.properties


class Instrument
  include Music 
  attr_accessor :name, :root_notes
  attr_reader :number_of_strings
  def initialize(name, root_notes, frets=20) #ex -> root_notes = ["e", "a", "d", "g", "b", "e"]
    @name = name
    @number_of_strings = root_notes.length
    @frets = frets
    @root_notes = root_notes
    
    for i in 1..number_of_strings
      self.instance_variable_set("@string_#{i}", MusicalString.new(i, @root_notes[i-1], @frets))
    end
  end
  
  def transpose
    #just adds 1 to each element of the root_notes array and returns a transposed array
    transposed = root_notes.map{|note| @@note_number.key(@@note_number[note] + 1)}
    return transposed
  end
  
  def chord_voicings(chordName) 
    #returns an array with the corresponding chord voicing
    #voicing = [1,2,3,4,5,6]
    voicing = []
    chord_quality = chordName[-3..-1]
        
    for i in 1..number_of_strings
      voicing << 0 if self.instance_variable_get("@string_#{i}").press(0)[3] == chord
    end
    return voicing
  end
  
end

guitar = Instrument.new("guitar", ["e", "a", "d", "g", "b", "e"])

p guitar.instance_variables
p guitar.number_of_strings
p guitar.chord_voicings("whatev")
p guitar.transpose
p guitar.chord_voicings("cmaj")




    



  

